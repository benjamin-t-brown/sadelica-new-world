
#include "cliResultProcessor.h"
#include "game/resultAction.h"

namespace snw {
namespace state {

void ClientResultProcessor::enqueue(const ResultAction& action) {}

void ClientResultProcessor::process() {}

void ClientResultProcessor::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

} // namespace state
} // namespace snw