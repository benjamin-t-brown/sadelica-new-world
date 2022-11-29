#include "cliLoopbackProcessor.h"
#include "cliContext.h"
#include "lib/json/jsonHelpers.h"
#include "logger.h"
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
    logger::debug("process loopback action %s",
                  dispatchActionString(it.type).c_str());
    auto itHandler = handlers.find(it.type);
    if (itHandler == handlers.end()) {
      logger::warn("Could not find loopback handler for type={}",
                   dispatchActionString(it.type).c_str());
      if (it.jsonPayload != nullptr) {
        // NOLINTNEXTLINE
        auto j = reinterpret_cast<json*>(it.jsonPayload);
        logger::warn("Payload: {}", j->dump().c_str());
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

} // namespace state
} // namespace snw