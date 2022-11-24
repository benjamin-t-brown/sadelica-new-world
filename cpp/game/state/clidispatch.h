#pragma once

#include "actions.h"
#include <vector>

using DispatchActionType = snw::state::DispatchActionType;
using DispatchAction = snw::state::DispatchAction;

namespace snw {
namespace state {

class ClientDispatch {
private:
  std::vector<DispatchAction> actionsToCommit;

public:
  void enqueue(const DispatchAction& action);
  void dispatch();
};

} // namespace state

namespace dispatch {

void startTalk(const std::string& talkName);
void continueTalk();
void chooseTalk(const std::string& choiceId);

} // namespace dispatch
} // namespace snw