#include "stateServer.h"
#include "./dispatchHandlers/dispatchHandlers.h"
#include "game/dispatchAction.h"
#include "game/payloads.h"
#include "game/resultAction.h"
#include "lib/json/json.h"
#include "lib/net/config.h"
#include "logger.h"

#ifndef SNW_PORT
#define SNW_PORT 7777
#endif

using json = nlohmann::json;
using ResultActionType = snw::state::ResultActionType;
using ActionCl = snw::state::ActionCl;

namespace snw {
namespace state {

constexpr int DEFAULT_LISTEN_PORT = SNW_PORT;

ServerContext ServerContext::globalServerContext;

ServerContext::ServerContext() {}
void ServerContext::init() {
  if (net::Config::mockEnabled) {
    logger::info("SRV using mock net.");
  }
  ServerContext::get().getNetServer().listen(DEFAULT_LISTEN_PORT);
  logger::info("SRV now listening on port %i", DEFAULT_LISTEN_PORT);
}

ServerContext& ServerContext::get() { return globalServerContext; }

const ServerState& ServerContext::getState() const { return serverState; }
ServerState& ServerContext::getStateMut() { return serverState; }
const ServerState& ServerContext::setState(const ServerState& s) {
  serverState = ServerState(s);

  auto s2 = ServerContext::get().getState();

  return serverState;
}

ServerResult& ServerContext::getServerResult() { return serverResult; }

net::Server& ServerContext::getNetServer() { return netServer; }
void ServerContext::update() {
  netServer.update([&](const std::string& socketId, const std::string& msg) {
    if (msg.size() == 0) {
      logger::info("SRV reports that socketId=%s is disconnected.",
                    socketId.c_str());
      DispatchAction disconnectAction;
      disconnectAction.type = DispatchActionType::NET_DISCONNECT;
      disconnectAction.clientId = helpers::socketIdToClientId(socketId);
      disconnectAction.socketId = socketId;
      disconnectAction.jsonPayload = json();
      serverDispatchProcessor.enqueue(disconnectAction.clientId,
                                      disconnectAction);
      return;
    }

    logger::debug("SRV Recvd message from client (socketId=%s): %s",
                 socketId.c_str(),
                 msg.c_str());
    auto actionList = jsonToDispatchActionList(msg);
    for (auto& action : actionList.actions) {
      action.socketId = socketId;
      serverDispatchProcessor.enqueue(actionList.clientId, action);
    }
  });

  serverDispatchProcessor.process();
  serverDispatchProcessor.reset();
  serverResult.sendResults();
  serverResult.reset();
}

ServerContext& getSrvContext() { return ServerContext::get(); }
const ServerState& getSrvState() { return getSrvContext().getState(); }

void ServerResult::enqueue(const ResultAction& action) {
  actionsToCommit.push_back(action);
}
void ServerResult::sendResults() {
  json clientPayload = json::array();

  for (auto& it : actionsToCommit) {
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

ServerDispatchProcessor::ServerDispatchProcessor()
    : actionsToCommit({}), handlers({}) {
  init();
}

void ServerDispatchProcessor::enqueue(const ClientId clientId,
                                      const DispatchAction& action) {
  actionsToCommit.push_back(action);
  auto& a = actionsToCommit[actionsToCommit.size() - 1];
  a.clientId = clientId;
}

void ServerDispatchProcessor::process() {
  ServerState& state = ServerContext::get().getStateMut();
  for (auto& it : actionsToCommit) {
    logger::debug("SRV process dispatch action %s",
                  dispatchActionToString(it.type).c_str());
    auto itHandler = handlers.find(it.type);
    if (itHandler == handlers.end()) {
      logger::warn("SRV Could not find dispatch handler for type=%s",
                   dispatchActionToString(it.type).c_str());
      logger::warn("Payload: %s", it.jsonPayload.dump().c_str());
      continue;
    }
    handlers[it.type](state, it);
  }
}

void ServerDispatchProcessor::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

void ServerDispatchProcessor::addHandler(
    DispatchActionType type,
    std::function<void(ServerState&, const DispatchAction&)> handler) {
  if (handlers.find(type) != handlers.end()) {
    throw std::runtime_error("A server handler for " +
                             dispatchActionToString(type) + " already exists!");
  }

  handlers[type] = handler;
}

void ServerDispatchProcessor::init() { initDispatchHandlers(*this); }

void logServerDispatchAssertionError(DispatchActionType type,
                                     const std::string& msg) {
  logger::error("SRV Failure at ServerDispatchProcessor during %s: %s",
                dispatchActionToString(type).c_str(),
                msg.c_str());
}

namespace helpers {

ClientId socketIdToClientId(const std::string& socketId) {
  auto& state = ServerContext::get().getState();
  for (auto& it : state.clients) {
    if (it.socketId == socketId) {
      return it.clientId;
    }
  }
  return ClientId::PLAYER_NONE;
}

unsigned int clientIdToIndex(ClientId clientId) {
  if (clientId == ClientId::PLAYER1) {
    return 0;
  } else if (clientId == ClientId::PLAYER2) {
    return 1;
  } else {
    logger::error(
        "Invalid conversion to index from clientId=%i (defaulting to PLAYER1) ",
        clientId);
    return 0;
  }
}

} // namespace helpers

namespace results {

void setConnected(ClientId clientId,
                  const std::string& playerId,
                  const std::string& playerName) {
  const ResultAction action{clientId,
                            ResultActionType::NET_PLAYER_CONNECTED,
                            json(payloads::PayloadEstablishConnection{
                                clientId, playerId, playerName})};

  ServerContext::get().getServerResult().enqueue(action);
}

void setDisconnected(ClientId clientId,
                     const std::string& playerId,
                     const std::string& playerName) {
  const ResultAction action{clientId,
                            ResultActionType::NET_PLAYER_DISCONNECTED,
                            json(payloads::PayloadEstablishConnection{
                                clientId, playerId, playerName})};

  ServerContext::get().getServerResult().enqueue(action);
}

void setTalkUpdated(ClientId clientId, const In2State& in2State) {
  const ResultAction action{
      clientId,
      ResultActionType::TALK_UPDATED,
      json(payloads::PayloadCivilTalkUpdateResult{clientId,
                                                  in2State.conversationText,
                                                  in2State.choices,
                                                  in2State.chName,
                                                  in2State.waitingState})};

  ServerContext::get().getServerResult().enqueue(action);
}

} // namespace results

} // namespace state
} // namespace snw