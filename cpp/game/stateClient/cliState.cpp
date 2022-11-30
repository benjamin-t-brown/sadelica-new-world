#include "cliState.h"
#include "cliContext.h"
#include "logger.h"
#include "utils/utils.h"
#include <algorithm>

namespace snw {
namespace state {
// ClientState::ClientState() : sections({}), in2(In2State()) {}

// ClientState::ClientState(const ClientState& state) {
//   account = state.account;
//   sections = state.sections;
//   in2 = {state.in2.in2Ctx,
//          state.in2.conversationText,
//          state.in2.choices,
//          state.in2.chName};
// }

namespace helpers {

bool isSectionVisible(const ClientState& state, SectionType type) {
  auto it = std::find(state.sections.begin(), state.sections.end(), type);
  if (it != state.sections.end()) {
    return true;
  }
  return false;
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

} // namespace helpers
} // namespace state
} // namespace snw