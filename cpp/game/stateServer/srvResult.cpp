#include "srvResult.h"
#include "game/payloads.h"
#include "game/resultAction.h"
#include "lib/json/json.h"
#include "logger.h"
#include "srvContext.h"
#include <string>

using json = nlohmann::json;
using ServerContext = snw::state::ServerContext;
using ResultActionType = snw::state::ResultActionType;
using ActionCl = snw::state::ActionCl;

namespace snw {
namespace state {

void ServerResult::enqueue(const ResultAction& action) {
  actionsToCommit.push_back(action);
}
void ServerResult::sendResults() {
  json clientPayload = json::array();

  for (auto& it : actionsToCommit) {
    logger::debug("SRV Send Result action: %s",
                  resultActionToString(it.type).c_str());
    json action;
    action["type"] = it.type;
    action["payload"] = it.jsonPayload;
    clientPayload.push_back(action);
  }

  if (clientPayload.size() > 0) {
    const json message = {{"id", "server"}, {"payload", clientPayload}};
    logger::debug("SRV Sending to clients: %s", message.dump().c_str());
    getSrvContext().getNetServer().broadcast(message.dump());
  }
}

void ServerResult::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

namespace result {

void setConnected(ClientId clientId, const std::string& name) {
  const ResultAction action{
      ResultActionType::NET_PLAYER_CONNECTED,
      json(payloads::PayloadEstablishConnection{clientId, name})};

  ServerContext::get().getServerResult().enqueue(action);
}

void setTalkUpdated(ClientId player, const In2State& in2State) {
  const ResultAction action{
      ResultActionType::TALK_UPDATED,
      json(payloads::PayloadCivilTalkUpdateResult{player,
                                                  in2State.conversationText,
                                                  in2State.choices,
                                                  in2State.chName,
                                                  in2State.waitingState})};

  ServerContext::get().getServerResult().enqueue(action);
}

} // namespace result
} // namespace state
} // namespace snw