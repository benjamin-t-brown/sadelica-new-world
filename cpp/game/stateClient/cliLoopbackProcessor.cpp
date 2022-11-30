#include "cliLoopbackProcessor.h"
#include "cliContext.h"
#include "game/dispatchAction.h"
#include "lib/json/jsonHelpers.h"
#include "logger.h"
#include "loopbackHandlers/loopbackHandlers.h"
#include "utils/utils.h"

using json = nlohmann::json;

namespace snw {
namespace state {

ClientLoopbackProcessor::ClientLoopbackProcessor()
    : actionsToCommit({}), handlers({}) {
  init();
}

void ClientLoopbackProcessor::enqueue(const DispatchAction& action) {
  actionsToCommit.push_back(action);
}

void ClientLoopbackProcessor::process() {
  ClientState state = ClientState(ClientContext::get().getState());
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
    state = ClientState(handlers[it.type](state, it));
  }
  ClientContext::get().setState(state);
}

void ClientLoopbackProcessor::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

void ClientLoopbackProcessor::addHandler(
    DispatchActionType type,
    std::function<ClientState(const ClientState&, const DispatchAction&)>
        handler) {
  handlers[type] = handler;
}

void ClientLoopbackProcessor::init() {
  // add more handlers here
  initIn2Handlers(*this);
}

void logLoopbackDispatchAssertionError(DispatchActionType type, const std::string& msg) {
  logger::error("CLI Failure at ClientLoopbackProcessor during %s: %s",
                dispatchActionToString(type).c_str(),
                msg.c_str());
}

} // namespace state
} // namespace snw