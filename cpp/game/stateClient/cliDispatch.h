#pragma once

#include "game/actions.h"
#include "game/sharedStateStructs.h"
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
};

namespace dispatch {

void establishConnection(const std::string& playerName);
void startTalk(const std::string& talkName);
void continueTalk();
void chooseTalk(const int choiceIndex);
void endTalk();
void updateTalk(const In2State& in2State);

} // namespace dispatch

} // namespace state

} // namespace snw