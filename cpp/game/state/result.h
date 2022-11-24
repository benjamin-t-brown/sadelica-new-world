#pragma once

#include "actions.h"
#include <vector>

namespace SNW {
namespace State {

class ResultProcessor {
private:
  std::vector<ResultAction> actionsToCommit;

public:
  void handleResult(const ResultAction& action);
  void applyCurrentActions();
};

} // namespace State
} // namespace SNW