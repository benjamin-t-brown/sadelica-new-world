#include "srvDispatchProcessor.h"
#include "dispatchHandlers/dispatchHandlers.h"
#include "game/dispatchAction.h"
#include "game/payloads.h"
#include "lib/json/json.h"
#include "logger.h"
#include "srvContext.h"
#include "srvState.h"

using json = nlohmann::json;

namespace snw {
namespace state {

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

  // logger::debug("SRV add handler for %s",
  // dispatchActionToString(type).c_str());
  handlers[type] = handler;
}

void ServerDispatchProcessor::init() { initDispatchHandlers(*this); }

void logServerDispatchAssertionError(DispatchActionType type,
                                     const std::string& msg) {
  logger::error("SRV Failure at ServerDispatchProcessor during %s: %s",
                dispatchActionToString(type).c_str(),
                msg.c_str());
}

} // namespace state
} // namespace snw