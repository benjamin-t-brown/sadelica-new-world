#pragma once

#include "cliState.h"
#include "game/actions.h"
#include <functional>
#include <unordered_map>
#include <vector>

namespace snw {
namespace state {

class ClientResultProcessor {
private:
  std::vector<ResultAction> actionsToCommit;

  std::unordered_map<
      ResultActionType,
      std::function<ClientState(const ClientState&, const ResultAction&)>>
      handlers;

  void init();

public:
  void enqueue(const ResultAction& action);
  void process();
  void reset();
  void addHandler(ResultActionType type,
                  std::function<ClientState(const ClientState&,
                                            const ResultAction&)> handler);
};

void logClientResultAssertionError(ResultActionType type,
                                   const std::string& msg);

} // namespace state
} // namespace snw