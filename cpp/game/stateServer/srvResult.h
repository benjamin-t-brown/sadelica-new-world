#pragma once

#include "game/actions.h"
#include "game/sharedStateStructs.h"
#include <vector>

using ResultActionType = snw::state::ResultActionType;
using ResultAction = snw::state::ResultAction;

namespace snw {
namespace state {

class ServerResult {
private:
  std::vector<ResultAction> actionsToCommit;

public:
  void enqueue(const ResultAction& action);
  void sendResults();
  void reset();
};

namespace result {

void setConnected(ClientId clientId, const std::string& name);
void setTalkUpdated(ClientId player, const In2State& in2State);

} // namespace result
} // namespace state
} // namespace snw