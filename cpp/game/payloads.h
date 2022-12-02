#pragma once

#include "lib/json/json.h"
#include "sharedState.h"
#include <string>
#include <vector>

namespace snw {
namespace state {
namespace payloads {

struct PayloadEstablishConnection {
  int clientId;
  std::string playerId;
  std::string playerName;
  NLOHMANN_DEFINE_TYPE_INTRUSIVE(PayloadEstablishConnection,
                                 clientId,
                                 playerId,
                                 playerName)
};

struct PayloadCivilDeclareTalk {
  std::string fileName = "";
  // this macro makes this struct deserializable so you can do:
  // auto args = j.get<snw::state::PayloadCivilDeclareTalk>();
  NLOHMANN_DEFINE_TYPE_INTRUSIVE(PayloadCivilDeclareTalk, fileName)
};

struct PayloadCivilTalkChoose {
  int choiceIndex = -1;
  NLOHMANN_DEFINE_TYPE_INTRUSIVE(PayloadCivilTalkChoose, choiceIndex)
};

struct PayloadCivilTalkUpdate {
  std::string conversationText = "";
  std::vector<std::string> choices;
  std::string chName = "";
  In2WaitingState waitingState = In2WaitingState::IN2_NONE;

  NLOHMANN_DEFINE_TYPE_INTRUSIVE(
      PayloadCivilTalkUpdate, conversationText, choices, chName, waitingState)
};

struct PayloadCivilTalkUpdateResult {
  ClientId clientId;
  std::string conversationText = "";
  std::vector<std::string> choices;
  std::string chName = "";
  In2WaitingState waitingState = In2WaitingState::IN2_NONE;

  NLOHMANN_DEFINE_TYPE_INTRUSIVE(PayloadCivilTalkUpdateResult,
                                 clientId,
                                 conversationText,
                                 choices,
                                 chName,
                                 waitingState)
};

}; // namespace payloads
}; // namespace state
} // namespace snw