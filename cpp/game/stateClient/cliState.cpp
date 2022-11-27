#include "cliState.h"
#include "logger.h"
#include "utils/utils.h"
#include <algorithm>

namespace snw {
namespace state {
ClientState::ClientState() : sections({}), in2(In2State()) {}

ClientState::ClientState(const ClientState& state) {
  sections = state.sections;
  in2 = {state.in2.in2Ctx,
         state.in2.conversationText,
         state.in2.choices,
         state.in2.chName};
}

namespace helpers {

bool isSectionVisible(const ClientState& state, SectionType type) {
  auto it = std::find(state.sections.begin(), state.sections.end(), type);
  if (it != state.sections.end()) {
    return true;
  }
  return false;
}

void setIn2StateAfterExecution(ClientState& state) {
  if (state.in2.in2Ctx == nullptr) {
    logger::error("Cannot setIn2StateAfterExecution in2ctx is null");
    return;
  }

  state.in2.conversationText =
      utils::join(state.in2.in2Ctx->getLines(), "\n\n");
  if (state.in2.in2Ctx->waitingForChoice) {
    auto& choices = state.in2.in2Ctx->getChoices();
    state.in2.choices = {};
    for (auto& c : choices) {
      state.in2.choices.push_back(c.line);
    }
  } else {
    state.in2.choices = {};
  }
}

} // namespace helpers
} // namespace state
} // namespace snw