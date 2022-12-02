#include "stateClient.h"
#include "./loopbackHandlers/loopbackHandlers.h"
#include "./resultHandlers/resultHandlers.h"
#include "game/dispatchAction.h"
#include "game/payloads.h"
#include "game/resultAction.h"
#include "lib/json/json.h"
#include "lib/net/config.h"
#include "logger.h"
#include "utils/utils.h"
#include <algorithm>

using json = nlohmann::json;
using DispatchActionType = snw::state::DispatchActionType;
using ActionCl = snw::state::ActionCl;

namespace snw {
namespace state {

constexpr int CONNECT_PORT = 7777;
constexpr char* CONNECT_URL = "127.0.0.1";

ClientContext ClientContext::globalClientContext = ClientContext();

ClientContext::ClientContext()
    : clientState(ClientState()),
      clientDispatch(ClientDispatch()),
      clientResultProcessor(ClientResultProcessor()),
      clientLoopbackProcessor(ClientLoopbackProcessor()) {}
void ClientContext::init() {
  if (net::Config::mockEnabled) {
    logger::info("CLI using mock net.");
  }
  logger::info("CLI attempting to connect to %s:%i", CONNECT_URL, CONNECT_PORT);
  bool c =
      ClientContext::get().getNetClient().connect(CONNECT_URL, CONNECT_PORT);
  if (c) {
    logger::info("CLI now connected.");
  } else {
    throw std::runtime_error("Could not connect to server (eclipsed timeout).");
  }
}

ClientContext& ClientContext::get() { return globalClientContext; }
const ClientState& ClientContext::getState() const { return clientState; }
ClientState& ClientContext::getStateMut() { return clientState; }
const ClientState& ClientContext::setState(const ClientState& s) {
  clientState = ClientState(s);

  auto s2 = ClientContext::get().getState();

  return clientState;
}
ClientDispatch& ClientContext::getDispatch() { return clientDispatch; }
ClientResultProcessor& ClientContext::getResultProcessor() {
  return clientResultProcessor;
}
ClientLoopbackProcessor& ClientContext::getLoopbackProcessor() {
  return clientLoopbackProcessor;
}

net::Client& ClientContext::getNetClient() { return netClient; }

snw::in2::In2Context& ClientContext::getIn2Ctx() { return in2Ctx; }

void ClientContext::update() {
  clientDispatch.dispatch();
  clientDispatch.reset();
  clientLoopbackProcessor.process();
  clientLoopbackProcessor.reset();

  netClient.update([&](const std::string& msg) {
    logger::info("CLI Recvd message from server %s", msg.c_str());
    if (msg.size() == 0) {
      logger::error("NET reports that socket is disconnected.");
      throw std::runtime_error("DISCONNECTED!");
    }
    const auto actionList = jsonToResultActionList(msg);
    for (const auto& action : actionList.actions) {
      clientResultProcessor.enqueue(action);
    }
  });

  clientResultProcessor.process();
  clientResultProcessor.reset();
}

ClientContext& getCliContext() { return ClientContext::get(); }
const ClientState& getCliState() { return ClientContext::get().getState(); }

const ClientId getClientId() { return getCliState().client.clientId; }

void ClientDispatch::enqueue(const DispatchAction& action) {
  actionsToCommit.push_back(action);
}
void ClientDispatch::dispatch() {
  json serverPayload = json::array();

  for (auto& it : actionsToCommit) {
    logger::debug("Dispatch action: %s",
                  dispatchActionToString(it.type).c_str());
    switch (it.cl) {
    case ActionCl::LOOPBACK_ONLY:
      ClientContext::get().getLoopbackProcessor().enqueue(it);
      break;
    case ActionCl::BOTH:
      ClientContext::get().getLoopbackProcessor().enqueue(it);
    case ActionCl::SEND_ONLY: {
      json action;
      action["type"] = it.type;
      action["payload"] = it.jsonPayload;
      serverPayload.push_back(action);
      break;
    }
    }
  }

  if (serverPayload.size() > 0) {
    const json message = {{"id", getCliState().client.clientId},
                          {"payload", serverPayload}};
    logger::debug("Sending to server: %s", message.dump().c_str());
    getCliContext().getNetClient().send(message.dump());
  }
}

void ClientDispatch::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

ClientLoopbackProcessor::ClientLoopbackProcessor()
    : actionsToCommit({}), handlers({}) {
  init();
}

void ClientLoopbackProcessor::enqueue(const DispatchAction& action) {
  actionsToCommit.push_back(action);
}

void ClientLoopbackProcessor::process() {
  auto& state = ClientContext::get().getStateMut();
  for (auto& it : actionsToCommit) {
    logger::debug("CLI process loopback action %s",
                  dispatchActionToString(it.type).c_str());
    auto itHandler = handlers.find(it.type);
    if (itHandler == handlers.end()) {
      logger::warn("CLI Could not find loopback handler for type=%s",
                   dispatchActionToString(it.type).c_str());
      if (it.jsonPayload != nullptr) {
        logger::warn("Payload: %", it.jsonPayload.dump().c_str());
      }
      continue;
    }
    handlers[it.type](state, it);
  }
}

void ClientLoopbackProcessor::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

void ClientLoopbackProcessor::addHandler(
    DispatchActionType type,
    std::function<void(ClientState&, const DispatchAction&)> handler) {
  if (handlers.find(type) != handlers.end()) {
    throw std::runtime_error("A loopback handler for " +
                             dispatchActionToString(type) + " already exists!");
  }

  handlers[type] = handler;
}

void ClientLoopbackProcessor::init() {
  // add more handlers here
  initLoopbackHandlers(*this);
}

void logLoopbackDispatchAssertionError(DispatchActionType type,
                                       const std::string& msg) {
  logger::error("CLI Failure at ClientLoopbackProcessor during %s: %s",
                dispatchActionToString(type).c_str(),
                msg.c_str());
}

ClientResultProcessor::ClientResultProcessor()
    : actionsToCommit({}), handlers({}) {
  init();
}

void ClientResultProcessor::init() { initResultHandlers(*this); }

void ClientResultProcessor::enqueue(const ResultAction& action) {
  actionsToCommit.push_back(action);
}

void ClientResultProcessor::process() {
  auto& state = ClientContext::get().getStateMut();
  for (auto& it : actionsToCommit) {
    logger::debug("CLI process result action %s",
                  resultActionToString(it.type).c_str());
    auto itHandler = handlers.find(it.type);
    if (itHandler == handlers.end()) {
      logger::warn("CLI Could not find result handler for type=%s",
                   resultActionToString(it.type).c_str());
      if (it.jsonPayload != nullptr) {
        logger::warn("Payload: %", it.jsonPayload.dump().c_str());
      }
      continue;
    }
    handlers[it.type](state, it);
  }
}

void ClientResultProcessor::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

void ClientResultProcessor::addHandler(
    ResultActionType type,
    std::function<void(ClientState&, const ResultAction&)> handler) {
  if (handlers.find(type) != handlers.end()) {
    throw std::runtime_error("A result result handler for " +
                             resultActionToString(type) + " already exists!");
  }

  handlers[type] = handler;
}

void logClientResultAssertionError(ResultActionType type,
                                   const std::string& msg) {
  logger::error("CLI Failure at ClientResultProcessor during %s: %s",
                resultActionToString(type).c_str(),
                msg.c_str());
}

namespace helpers {

bool isSectionVisible(const ClientState& state, SectionType type) {
  auto it = std::find(state.sections.begin(), state.sections.end(), type);
  if (it != state.sections.end()) {
    return true;
  }
  return false;
}

void addSection(ClientState& state, SectionType type) {
  if (isSectionVisible(state, type)) {
    return;
  }

  state.sections.push_back(type);
}

void removeSection(ClientState& state, SectionType type) {
  if (!isSectionVisible(state, type)) {
    return;
  }

  state.sections.erase(
      //
      std::remove_if(state.sections.begin(),
                     state.sections.end(),
                     [&](SectionType i) { return i == type; }),
      state.sections.end());
}

// After the in2 state executes to it's next waiting period, some stuff
// on the state needs to be set up.  This function sets all that up.
void setIn2StateAfterExecution(ClientState& state) {
  auto& in2Ctx = getCliContext().getIn2Ctx();
  state.in2.conversationText = utils::join(in2Ctx.getLines(), "\n\n");
  if (in2Ctx.waitingForChoice) {
    auto& choices = in2Ctx.getChoices();
    state.in2.choices = {};
    for (auto& c : choices) {
      state.in2.choices.push_back(c.line);
    }
    state.in2.waitingState = In2WaitingState::WAITING_FOR_CHOICE;
  } else if (in2Ctx.waitingForResume) {
    state.in2.choices = {};
    state.in2.waitingState = In2WaitingState::WAITING_FOR_CONTINUE;
  } else if (in2Ctx.executionCompleted) {
    state.in2.waitingState = In2WaitingState::COMPLETE;
  } else {
    state.in2.waitingState = In2WaitingState::IN2_NONE;
  }
}

ClientId intToClientId(int clientIdInt) {
  if (clientIdInt == 1) {
    return ClientId::PLAYER1;
  } else if (clientIdInt == 2) {
    return ClientId::PLAYER2;
  } else {
    logger::error(
        "Invalid conversion to clientId from int=%i (defaulting to PLAYER1)",
        clientIdInt);
    return ClientId::PLAYER1;
  }
}
} // namespace helpers

namespace dispatch {

void establishConnection(const std::string& playerName) {
  const DispatchAction action{ActionCl::BOTH,
                              DispatchActionType::NET_CONNECT,
                              json(payloads::PayloadEstablishConnection{
                                  0, utils::getRandomId(), playerName})};
  ClientContext::get().getDispatch().enqueue(action);
}

void startTalk(const std::string& talkName) {
  const DispatchAction action{ActionCl::BOTH,
                              DispatchActionType::TALK_START,
                              json({{"fileName", talkName}})};

  ClientContext::get().getDispatch().enqueue(action);
}

void continueTalk() {
  const DispatchAction action{
      ActionCl::BOTH, DispatchActionType::TALK_CONTINUE, nullptr};

  ClientContext::get().getDispatch().enqueue(action);
}

void chooseTalk(const int choiceIndex) {
  const DispatchAction action{ActionCl::BOTH,
                              DispatchActionType::TALK_SELECT_CHOICE,
                              json({{"choiceIndex", choiceIndex}})};

  ClientContext::get().getDispatch().enqueue(action);
}

void endTalk() {
  const DispatchAction action{
      ActionCl::BOTH, DispatchActionType::TALK_END, nullptr};

  ClientContext::get().getDispatch().enqueue(action);
}

void updateTalk(const In2State& in2State) {
  const DispatchAction action{
      ActionCl::SEND_ONLY,
      DispatchActionType::TALK_UPDATE,
      json({{"conversationText", in2State.conversationText},
            {"choices", in2State.choices},
            {"chName", in2State.chName},
            {"waitingState", in2State.waitingState}})};

  ClientContext::get().getDispatch().enqueue(action);
}
} // namespace dispatch

} // namespace state
} // namespace snw