#pragma once

#include "game/actions.h"
#include <vector>

namespace snw {
namespace state {

class ServerDispatchProcessor {
private:
  std::vector<DispatchAction> actionsToCommit;

public:
  void enqueue(const DispatchAction& action);
  void process();
  void reset();
};

} // namespace state
} // namespace snw