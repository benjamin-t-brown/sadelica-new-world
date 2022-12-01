#include "client.h"
#include "config.h"
#include "logger.h"
#include "server.h"
#include <enet/enet.h>
#include <stdexcept>

namespace net {

bool Client::connect(const std::string& host, int port) {
  if (Config::mockEnabled) {
    Server::mockClientsConnected.push_back(this);
    connected = true;
    return true;
  } else {
    if (enet_initialize() != 0) {
      throw std::runtime_error(
          "[NET] An error occurred while initializing ENet");
    }

    ENetHost* client = NULL;
    client = enet_host_create(NULL /* create a client host */,
                              1 /* only allow 1 outgoing connection */,
                              2 /* allow up 2 channels to be used, 0 and 1 */,
                              0 /* assume any amount of incoming bandwidth */,
                              0 /* assume any amount of outgoing bandwidth */);
    if (client == NULL) {
      throw std::runtime_error("[NET] An error occurred while trying to create "
                               "an ENet client host.");
    }

    ENetAddress address = {0};
    ENetPeer* peer = NULL;
    ENetEvent event;
    enet_address_set_host(&address, host.c_str());
    address.port = port;

    peer = enet_host_connect(client, &address, 2, 0);
    if (peer == NULL) {
      throw std::runtime_error(
          "[NET] No available peers for initiating an ENet connection.");
    }

    /* Wait up to 5 seconds for the connection attempt to succeed. */
    if (enet_host_service(client, &event, 5000) > 0 &&
        event.type == ENET_EVENT_TYPE_CONNECT) {
      connected = true;
      clientHost = reinterpret_cast<void*>(client);
      clientPeer = reinterpret_cast<void*>(peer);
      return true;
    } else {
      /* Either the 5 seconds are up or a disconnect event was */
      /* received. Reset the peer in the event the 5 seconds   */
      /* had run out without any significant event.            */
      enet_peer_reset(peer);
      connected = false;
      return false;
    }
  }
}

void Client::send(const std::string& message) {
  if (Config::mockEnabled) {
    mockClientMessagesToSend.push_back(message);
  } else {
    if (clientPeer == nullptr) {
      // throw std::runtime_error("[NET] Cannot send.  Not connected!");
      return;
    }

    ENetPeer* peer = reinterpret_cast<ENetPeer*>(clientPeer);

    ENetPacket* packet = enet_packet_create(
        message.c_str(), message.size() + 1, ENET_PACKET_FLAG_RELIABLE);
    enet_peer_send(peer, 0, packet);
  }
}

void Client::update(std::function<void(const std::string& msg)> cb) {
  if (Config::mockEnabled) {
    for (const auto& message : mockClientMessagesToSend) {
      Server::mockServerMessagesToProcess.push_back(
          std::make_pair("mock-1234", message));
    }

    for (const auto& message : mockClientMessagesToProcess) {
      cb(message);
    }

    mockClientMessagesToSend.clear();
    mockClientMessagesToProcess.clear();
  } else {
    if (clientPeer == nullptr || clientHost == nullptr) {
      throw std::runtime_error("[NET] Cannot update.  Not connected!");
      return;
    }

    ENetPeer* peer = reinterpret_cast<ENetPeer*>(clientPeer);
    ENetHost* client = reinterpret_cast<ENetHost*>(clientHost);
    ENetEvent event;
    while (enet_host_service(client, &event, 0) > 0) {
      switch (event.type) {
      case ENET_EVENT_TYPE_RECEIVE: {
        char* data = reinterpret_cast<char*>(event.packet->data);
        cb(data);
        enet_packet_destroy(event.packet);
        // // Disconnect
        // enet_peer_disconnect(peer, 0);
        break;
      }
      case ENET_EVENT_TYPE_DISCONNECT: {
        connected = false;
        logger::error("Disconnected from server!");
        cb("");
        break;
      }
      default:
        break;
      }
    }
  }
}

bool Client::isConnected() { return connected; }

void Client::cleanUp() {
  if (!Config::mockEnabled) {
    // Drop connection, since disconnection didn't succeed
    if (clientPeer != nullptr && clientHost != nullptr) {
      // ENetPeer* peer = reinterpret_cast<ENetPeer*>(clientPeer);
      ENetHost* client = reinterpret_cast<ENetHost*>(clientHost);
      enet_host_destroy(client);
      enet_deinitialize();
    }
  }
  connected = false;
}

} // namespace net