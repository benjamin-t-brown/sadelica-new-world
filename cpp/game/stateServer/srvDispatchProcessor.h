#pragma once

#include "game/actions.h"
#include "srvState.h"
#include <functional>
#include <vector>

namespace snw {
namespace state {

class ServerDispatchProcessor {
private:
  std::vector<DispatchAction> actionsToCommit;
  std::unordered_map<
      DispatchActionType,
      std::function<ServerState(const ServerState&, const DispatchAction&)>>
      handlers;

  void init();

public:
  void enqueue(const DispatchAction& action);
  void process();
  void reset();
};

} // namespace state
} // namespace snw