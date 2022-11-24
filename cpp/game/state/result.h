#pragma once

#include "actions.h"
#include <vector>

namespace snw {
namespace state {

class ResultProcessor {
private:
  std::vector<ResultAction> actionsToCommit;

public:
  void enqueue(const ResultAction& action);
  void applyCurrentActions();
};

} // namespace state
} // namespace snw