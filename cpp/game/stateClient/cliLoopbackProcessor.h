#pragma once

#include "cliState.h"
#include "game/actions.h"
#include <functional>
#include <unordered_map>
#include <vector>

namespace snw {
namespace state {

class ClientLoopbackProcessor {
private:
  std::vector<DispatchAction> actionsToCommit;
  std::unordered_map<
      DispatchActionType,
      std::function<ClientState(const ClientState&, const DispatchAction&)>>
      handlers;

  void init();

public:
  ClientLoopbackProcessor();

  void enqueue(const DispatchAction& action);
  void process();
  void reset();
};

} // namespace state
} // namespace snw