#pragma once

#include <string>
#include <vector>

namespace snw {

namespace state {

struct ConnectedClient {
  ClientId clientId = ClientId::PLAYER1;
  std::string socketId;
  std::string playerName;
  std::string playerId;
  bool isConnected = false;
};

enum In2WaitingState {
  IN2_NONE = 0,
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