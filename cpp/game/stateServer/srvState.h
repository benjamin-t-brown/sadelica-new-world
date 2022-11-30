#pragma once

#include "game/actions.h"
#include "game/sharedStateStructs.h"

namespace snw {
namespace state {

struct ConnectedClient {
  std::string clientId;
  std::string socketId;
  std::string clientName;
  bool isConnected = false;
};

struct ServerState {
  std::vector<ConnectedClient> clients = {ConnectedClient(), ConnectedClient()};
  std::vector<In2State> in2States = {In2State(), In2State()};
};

namespace helpers {

unsigned int clientIdToIndex(ClientId clientId);

} // namespace helpers

} // namespace state
} // namespace snw