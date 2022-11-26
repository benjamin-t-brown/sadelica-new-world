#pragma once

#include "game/actions.h"
#include <vector>

namespace snw {
namespace state {

class ClientResultProcessor {
private:
  std::vector<ResultAction> actionsToCommit;

public:
  void enqueue(const ResultAction& action);
  void process();
  void reset();
};

} // namespace state
} // namespace snw