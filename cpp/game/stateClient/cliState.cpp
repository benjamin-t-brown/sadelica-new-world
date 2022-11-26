#include "cliState.h"
#include <algorithm>
#include "logger.h"

namespace snw {
namespace state {
ClientState::ClientState() : sections({}), in2({nullptr, "", {}}) {}

ClientState::ClientState(const ClientState& state) {
  sections = state.sections;
  in2 = {
      state.in2.in2Ctx,
      state.in2.conversationText,
      state.in2.choices,
  };
}

namespace helpers {

bool isSectionVisible(const ClientState& state, SectionType type) {
  auto it = std::find(state.sections.begin(), state.sections.end(), type);
  if (it != state.sections.end()) {
    return true;
  }
  return false;
}

} // namespace helpers
} // namespace state
} // namespace snw