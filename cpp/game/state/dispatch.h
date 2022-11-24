#pragma once

#include "actions.h"
#include <vector>

namespace SNW {
namespace State {

class DispatchProcessor {
private:
  std::vector<DispatchAction> actionsToCommit;

public:
  void dispatch(const DispatchAction& action);
  void applyCurrentActions();
};

} // namespace State
} // namespace SNW