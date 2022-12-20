#pragma once

#include "game/state/actions/actions.h"
#include "game/state/actions/sharedState.h"
#include "lib/net/server.h"
#include <functional>
#include <unordered_map>
#include <vector>

namespace snw {
namespace state {

struct ServerState {
  std::vector<ConnectedClient> clients = {ConnectedClient(), ConnectedClient()};
  std::vector<In2State> in2States = {In2State(), In2State()};
};

} // namespace state
} // namespace snw