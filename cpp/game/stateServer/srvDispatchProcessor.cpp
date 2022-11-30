#include "srvDispatchProcessor.h"
#include "game/dispatchAction.h"
#include "lib/json/json.h"
#include "logger.h"
#include "srvContext.h"
#include "srvState.h"

using json = nlohmann::json;

namespace snw {
namespace state {
void ServerDispatchProcessor::enqueue(const std::string& clientId,
                                      const DispatchAction& action) {
  actionsToCommit.push_back(action);
  auto& a = actionsToCommit[actionsToCommit.size() - 1];
  a.clientId = clientId;
}

void ServerDispatchProcessor::process() {
  ServerState state = ServerState(ServerContext::get().getState());
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
    state = ServerState(handlers[it.type](state, it));
  }
  ServerContext::get().setState(state);
}

void ServerDispatchProcessor::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

void ServerDispatchProcessor::init() {}

} // namespace state
} // namespace snw