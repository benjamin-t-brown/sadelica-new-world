
#include "cliResultProcessor.h"
#include "game/resultAction.h"
#include "logger.h"
#include "resultHandlers/resultHandlers.h"

namespace snw {
namespace state {
void ClientResultProcessor::init() { initResultHandlers(*this); }

void ClientResultProcessor::enqueue(const ResultAction& action) {}

void ClientResultProcessor::process() {}

void ClientResultProcessor::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

void ClientResultProcessor::addHandler(
    ResultActionType type,
    std::function<ClientState(const ClientState&, const ResultAction&)>
        handler) {
  if (handlers.find(type) != handlers.end()) {
    throw std::runtime_error("A result handler for " +
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

} // namespace state
} // namespace snw