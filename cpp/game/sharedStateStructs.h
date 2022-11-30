#pragma once

#include <string>
#include <vector>

namespace snw {

namespace state {

enum In2WaitingState {
  IN2_NONE,
  WAITING_FOR_CONTINUE,
  WAITING_FOR_CHOICE,
  COMPLETE,
};

struct In2State {
  std::string conversationText = "";
  std::vector<std::string> choices;
  std::string chName = "";
  In2WaitingState waitingState = In2WaitingState::IN2_NONE;
};
} // namespace state
} // namespace snw