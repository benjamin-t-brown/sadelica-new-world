#pragma once

#include "game/actions.h"
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
  void reset();
  std::vector<void*> getPayloadPtrs();
};

namespace dispatch {

void startTalk(const std::string& talkName);
void continueTalk();
void chooseTalk(const std::string& choiceId);
void endTalk();

} // namespace dispatch

} // namespace state

} // namespace snw