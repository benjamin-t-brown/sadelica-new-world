#pragma once

#include "game/actions.h"
#include "srvState.h"
#include <functional>
#include <unordered_map>
#include <vector>

namespace snw {
namespace state {

class ServerDispatchProcessor {
private:
  std::vector<DispatchAction> actionsToCommit;
  std::unordered_map<DispatchActionType,
                     std::function<void(ServerState&, const DispatchAction&)>>
      handlers;

  void init();

public:
  ServerDispatchProcessor();
  void enqueue(const ClientId clientId, const DispatchAction& action);
  void process();
  void reset();
  void addHandler(DispatchActionType type,
                  std::function<void(ServerState&, const DispatchAction&)> handler);
};

void logServerDispatchAssertionError(DispatchActionType type,
                                     const std::string& msg);

} // namespace state
} // namespace snw