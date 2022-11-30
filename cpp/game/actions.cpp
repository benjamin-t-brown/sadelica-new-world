#include "actions.h"
#include "dispatchAction.h"
#include "lib/json/json.h"
#include "logger.h"
#include "resultAction.h"

using json = nlohmann::json;

namespace snw {
namespace state {

std::string dispatchActionToString(DispatchActionType type) {
  switch (type) {
  case DispatchActionType::NOOP_DISPATCH:
    return "NOOP_DISPATCH";
  case DispatchActionType::NET_CONNECT:
    return "NET_CONNECT";
  case DispatchActionType::NET_DISCONNECT:
    return "NET_DISCONNECT";
  case DispatchActionType::TALK_START:
    return "TALK_START";
  case DispatchActionType::TALK_SELECT_CHOICE:
    return "TALK_SELECT_CHOICE";
  case DispatchActionType::TALK_CONTINUE:
    return "TALK_CONTINUE";
  case DispatchActionType::TALK_END:
    return "TALK_END";
  case DispatchActionType::TALK_UPDATE:
    return "TALK_UPDATE";
  default:
    return std::to_string(static_cast<int>(type));
  }
}
std::string resultActionToString(ResultActionType type) {
  switch (type) {
  case ResultActionType::NOOP_RESULT:
    return "NOOP_RESULT";
  case ResultActionType::TALK_UPDATED:
    return "TALK_UPDATED";
  default:
    return std::to_string(static_cast<int>(type));
  }
}

DispatchActionList jsonToDispatchActionList(const std::string& jsonMsg) {
  json jMsg = json::parse(jsonMsg);

  const int clientIdInt = jMsg["id"];
  std::vector<DispatchAction> actions;

  ClientId clientId = ClientId::PLAYER_NONE;

  if (clientIdInt == 1) {
    clientId = ClientId::PLAYER1;
  } else if (clientIdInt == 2) {
    clientId = ClientId::PLAYER2;
  } else {
    logger::warn("Translating to dispatch action with invalid clientId=%i",
                 clientIdInt);
  }

  for (auto& j : jMsg["payload"]) {
    DispatchAction action;
    action.type = j["type"];
    action.jsonPayload = j["payload"];
    actions.push_back(action);
  }

  return DispatchActionList{clientId, actions};
}

ResultActionList jsonToResultActionList(const std::string& jsonMsg) {
  json jMsg = json::parse(jsonMsg);

  std::vector<ResultAction> actions;

  for (auto& j : jMsg["payload"]) {
    ResultAction action;
    action.type = j["type"];
    action.jsonPayload = j["payload"];
    actions.push_back(action);
  }

  return ResultActionList{actions};
}

} // namespace state
} // namespace snw