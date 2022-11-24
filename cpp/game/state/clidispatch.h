#pragma once

#include "actions.h"
#include <vector>

using DispatchActionType = snw::state::DispatchActionType;
using DispatchAction = snw::state::DispatchAction;

namespace snw {
namespace state {

class DispatchProcessor {
private:
  std::vector<DispatchAction> actionsToCommit;

public:
  void enqueue(const DispatchAction& action);
  void apply();
};

} // namespace state

namespace dispatch {

void startTalk(const std::string& talkName);

} // namespace dispatch
} // namespace snw