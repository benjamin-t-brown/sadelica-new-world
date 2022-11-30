#include "actions.h"
#include "dispatchAction.h"
#include "lib/json/json.h"
#include "resultAction.h"

using json = nlohmann::json;

namespace snw {
namespace state {

std::string dispatchActionString(DispatchActionType type) {
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
std::string resultActionString(ResultActionType type) {
  switch (type) {
  case ResultActionType::NOOP_RESULT:
    return "NOOP_RESULT";
  default:
    return std::to_string(static_cast<int>(type));
  }
}

DispatchAction jsonToDispatchAction(const std::string& jsonDispatchAction) {
  DispatchAction action;
  json j = json::parse(jsonDispatchAction);
  // json* payload = new json();

  action.type = j['type'];
  action.jsonPayload = j['payload'];

  return action;
}

ResultAction jsonToResultAction(const std::string& jsonToResultAction) {
  ResultAction action;
  json j = json::parse(jsonToResultAction);
  // json* payload = new json();

  action.type = j['type'];
  action.jsonPayload = j['payload'];

  return action;
}

} // namespace state
} // namespace snw