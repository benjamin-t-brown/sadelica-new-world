#include "client.h"
#include "logger.h"
#include <stdexcept>

#ifdef NET_ENABLED
#include <enet/enet.h>
#else
#include "server.h"
#endif

namespace net {

std::vector<std::string> Client::mockClientMessagesToSend;
std::vector<std::string> Client::mockClientMessagesToProcess;

bool Client::connect(const std::string& host, int port) {
#ifdef NET_ENABLED
  if (enet_initialize() != 0) {
    throw std::runtime_error("[NET] An error occurred while initializing ENet");
  }

  ENetHost* client = NULL;
  client = enet_host_create(NULL /* create a client host */,
                            1 /* only allow 1 outgoing connection */,
                            2 /* allow up 2 channels to be used, 0 and 1 */,
                            0 /* assume any amount of incoming bandwidth */,
                            0 /* assume any amount of outgoing bandwidth */);
  if (client == NULL) {
    throw std::runtime_error(
        "[NET] An error occurred while trying to create an ENet client host.");
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
    isConnected = true;
    clientHost = reinterpret_cast<void*>(client);
    clientPeer = reinterpret_cast<void*>(peer);
    return true;
  } else {
    /* Either the 5 seconds are up or a disconnect event was */
    /* received. Reset the peer in the event the 5 seconds   */
    /* had run out without any significant event.            */
    enet_peer_reset(peer);
    isConnected = false;
    return false;
  }
#else
  return true;
#endif
}

void Client::send(const std::string& message) {
#ifdef NET_ENABLED

  if (clientPeer == nullptr) {
    // throw std::runtime_error("[NET] Cannot send.  Not connected!");
    return;
  }

  ENetPeer* peer = reinterpret_cast<ENetPeer*>(clientPeer);

  ENetPacket* packet = enet_packet_create(
      message.c_str(), message.size() + 1, ENET_PACKET_FLAG_RELIABLE);
  enet_peer_send(peer, 0, packet);

#else

  Client::mockClientMessagesToSend.push_back(message);

#endif
}

void Client::update(std::function<void(const std::string& msg)> cb) {
#ifdef NET_ENABLED

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
      isConnected = false;
      break;
    }
    default:
      break;
    }
  }

#else

  for (const auto& message : Client::mockClientMessagesToSend) {
    Server::mockServerMessagesToProcess.push_back(
        std::make_pair("mock-1234", message));
  }

  for (const auto& message : Client::mockClientMessagesToProcess) {
    cb(message);
  }

  Client::mockClientMessagesToSend.clear();
  Client::mockClientMessagesToProcess.clear();

#endif
}

void Client::cleanUp() {
#ifdef NET_ENABLED
  // Drop connection, since disconnection didn't succeed
  if (clientPeer != nullptr && clientHost != nullptr) {
    // ENetPeer* peer = reinterpret_cast<ENetPeer*>(clientPeer);
    ENetHost* client = reinterpret_cast<ENetHost*>(clientHost);
    enet_host_destroy(client);
    enet_deinitialize();
  }
#else

#endif
}

} // namespace net