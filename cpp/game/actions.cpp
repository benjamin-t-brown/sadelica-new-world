#include "actions.h"
#include "dispatchAction.h"
#include "lib/json/json.h"
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
  default:
    return std::to_string(static_cast<int>(type));
  }
}
std::string resultActionToString(ResultActionType type) {
  switch (type) {
  case ResultActionType::NOOP_RESULT:
    return "NOOP_RESULT";
  default:
    return std::to_string(static_cast<int>(type));
  }
}

DispatchActionList jsonToDispatchActionList(const std::string& jsonMsg) {
  json jMsg = json::parse(jsonMsg);

  const std::string clientId = jMsg["id"];
  std::vector<DispatchAction> actions;

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