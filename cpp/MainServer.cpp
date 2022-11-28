#include "logger.h"
#include <enet/enet.h>
#include <string>
// #include "lib

constexpr const int MAX_CLIENTS = 32;
constexpr const int HOST = ENET_HOST_ANY;
constexpr const int PORT = 7777;

struct ConnectionData {
  std::string id;
};

int main() {
  if (enet_initialize() != 0) {
    logger::error("An error occurred while initializing ENet.");
    return 1;
  }

  ENetAddress address;

  address.host = HOST; /* Bind the server to the default localhost.     */
  address.port = PORT; /* Bind the server to port 7777. */

  /* create a server */
  ENetHost* server = enet_host_create(&address, MAX_CLIENTS, 2, 0, 0);

  if (server == NULL) {
    logger::error(
        "An error occurred while trying to create an ENet server host.");
    return 1;
  }

  logger::info("Started a server at localhost:%i", PORT);

  ENetEvent event;
  int idCtr = 255;
  // char* s = "Client information";

  /* Wait up to 10000 milliseconds for an event. (WARNING: blocking) */
  while (1) {
    if (enet_host_service(server, &event, 10000) > 0) {
      switch (event.type) {
      case ENET_EVENT_TYPE_CONNECT: {
        logger::debug("Client connected: %i:%i",
                      static_cast<int>(event.peer->address.host),
                      static_cast<int>(event.peer->address.port));
        /* Store any relevant client information here. */
        ConnectionData* d = new ConnectionData{std::to_string(idCtr++)};
        event.peer->data = reinterpret_cast<void*>(d);
        break;
      }
      case ENET_EVENT_TYPE_RECEIVE: {
        ConnectionData* d = reinterpret_cast<ConnectionData*>(event.peer->data);
        logger::debug(
            "A packet of length %i containing '%s' was received from %s on "
            "channel %i.\n",
            static_cast<int>(event.packet->dataLength),
            event.packet->data,
            d->id.c_str(),
            static_cast<int>(event.channelID));

        ENetPacket* packet = enet_packet_create(
            "ack", strlen("ack") + 1, ENET_PACKET_FLAG_RELIABLE);
        enet_host_broadcast(server, 0, packet);
        /* Clean up the packet now that we're done using it. */
        enet_packet_destroy(event.packet);
        break;
      }
      case ENET_EVENT_TYPE_DISCONNECT: {
        ConnectionData* d = reinterpret_cast<ConnectionData*>(event.peer->data);
        logger::info("%s disconnected.\n", d->id.c_str());
        /* Reset the peer's client information. */
        event.peer->data = NULL;
        break;

        // case ENET_EVENT_TYPE_DISCONNECT_TIMEOUT:
        //     printf("%s disconnected due to timeout.\n", event.peer->data);
        //     /* Reset the peer's client information. */
        //     event.peer->data = NULL;
        //     break;
      }
      case ENET_EVENT_TYPE_NONE:
        break;
      }
    }
  }

  enet_host_destroy(server);
  enet_deinitialize();
  return 0;
}