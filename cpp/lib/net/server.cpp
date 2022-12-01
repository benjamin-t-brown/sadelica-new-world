#include "server.h"
#include "client.h"
#include "config.h"
#include "logger.h"
#include <enet/enet.h>
#include <stdexcept>

namespace net {

bool Config::mockEnabled = true;

constexpr unsigned int MAX_CLIENTS = 2;

std::vector<Client*> Server::mockClientsConnected;
std::vector<std::string> Server::mockServerMessagesToBroadcast;
std::vector<std::pair<std::string, std::string>>
    Server::mockServerMessagesToProcess;

std::string getRandomId(int len = 10) {
  const int id = rand() % 100000;
  const std::string asStr = std::to_string(id);
  const int n = 6 - static_cast<int>(asStr.size());
  std::stringstream ss;
  for (int i = 0; i < n; i++) {
    ss << "0";
  }
  ss << id;
  return ss.str();
}

void Server::listen(int port) {
  if (!Config::mockEnabled) {
    if (enet_initialize() != 0) {
      throw std::runtime_error(
          "[NET] An error occurred while initializing ENet.");
      return;
    }

    if (serverHost != nullptr) {
      throw std::runtime_error("[NET] Already listening.");
    }

    ENetAddress address;

    address.host = ENET_HOST_ANY;
    address.port = port;

    ENetHost* server = enet_host_create(&address, MAX_CLIENTS, 2, 0, 0);

    if (server == NULL) {
      throw std::runtime_error("[NET] An error occurred while trying to create "
                               "an ENet server host.");
      return;
    }

    serverHost = server;
  }

  isListening = true;
}

void Server::broadcast(const std::string& message) {
  if (Config::mockEnabled) {
    Server::mockServerMessagesToBroadcast.push_back(message);
  } else {
    if (serverHost == nullptr) {
      throw std::runtime_error("[NET] Cannot broadcast, server is null.");
      return;
    }
    ENetHost* server = reinterpret_cast<ENetHost*>(serverHost);
    ENetPacket* packet = enet_packet_create(
        message.c_str(), message.size() + 1, ENET_PACKET_FLAG_RELIABLE);
    enet_host_broadcast(server, 0, packet);
  }
}

void Server::update(
    std::function<void(const std::string id, const std::string& msg)> cb) {

  if (Config::mockEnabled) {
    for (const auto& messagePair : Server::mockServerMessagesToProcess) {
      cb(messagePair.first, messagePair.second);
    }

    for (Client* client : Server::mockClientsConnected) {
      for (const auto& message : Server::mockServerMessagesToBroadcast) {
        client->mockClientMessagesToProcess.push_back(message);
      }
    }

    Server::mockServerMessagesToProcess.clear();
    Server::mockServerMessagesToBroadcast.clear();

  } else {
    if (serverHost == nullptr) {
      return;
    }

    ENetHost* server = reinterpret_cast<ENetHost*>(serverHost);
    ENetEvent event;

    /* Wait up to 10000 milliseconds for an event. (WARNING: blocking) */
    while (enet_host_service(server, &event, 0) > 0) {
      switch (event.type) {
      case ENET_EVENT_TYPE_CONNECT: {
        // logger::debug("Client connected: %i:%i",
        //               static_cast<int>(event.peer->address.host),
        //               static_cast<int>(event.peer->address.port));
        /* Store any relevant client information here. */
        ConnectionData* d = new ConnectionData{getRandomId()};
        event.peer->data = reinterpret_cast<void*>(d);
        connectedPeers[d->socketId] = "";
        break;
      }
      case ENET_EVENT_TYPE_RECEIVE: {
        ConnectionData* d = reinterpret_cast<ConnectionData*>(event.peer->data);
        // logger::debug(
        //     "A packet of length %i containing '%s' was received from %s on "
        //     "channel %i.\n",
        //     static_cast<int>(event.packet->dataLength),
        //     event.packet->data,
        //     d->socketId.c_str(),
        //     static_cast<int>(event.channelID));
        char* data = reinterpret_cast<char*>(event.packet->data);
        cb(d->socketId.c_str(), data);
        /* Clean up the packet now that we're done using it. */
        enet_packet_destroy(event.packet);
        break;
      }
      case ENET_EVENT_TYPE_DISCONNECT: {
        ConnectionData* d = reinterpret_cast<ConnectionData*>(event.peer->data);
        logger::info("%s disconnected.", d->socketId.c_str());
        /* Reset the peer's client information. */
        auto it = connectedPeers.find(d->socketId);
        if (it != connectedPeers.end()) {
          connectedPeers.erase(d->socketId);
        }
        delete d;
        logger::info("resetting...");
        event.peer->data = NULL;
        break;
      }
      case ENET_EVENT_TYPE_NONE:
        break;
      }
    }
  }
}

void Server::cleanUp() {
  if (!Config::mockEnabled) {
    if (serverHost != nullptr) {
      ENetHost* server = reinterpret_cast<ENetHost*>(serverHost);
      enet_host_destroy(server);
      enet_deinitialize();
      serverHost = nullptr;
    }
  }
}

} // namespace net