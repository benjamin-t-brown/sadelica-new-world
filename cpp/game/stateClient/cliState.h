#pragma once

#include "game/in2/in2.h"
#include "lib/betterenum/enum.h"
#include <vector>

namespace snw {
namespace state {

// NOLINTNEXTLINE
// BETTER_ENUM(SectionType,
//             int,
//             MENU_SPLASH = 1,
//             MENU_START,
//             MENU_OPTIONS,
//             MENU_GAME,
//             CONVERSATION)

enum SectionType { MENU_SPLASH, CONVERSATION };

struct SectionInfo {
  SectionType type;
};

struct In2State {
  snw::in2::In2Context* in2Ctx = nullptr;
  std::string conversationText = "";
  std::vector<std::string> choices;
};

struct ClientState {
  std::vector<SectionType> sections;
  In2State in2;

  ClientState();
  ClientState(const ClientState& state);
  ClientState(ClientState&&) = default;
  ClientState& operator=(const ClientState&) = default;
  ClientState& operator=(ClientState&&) = default;
  virtual ~ClientState() = default;
};

namespace helpers {

bool isSectionVisible(const ClientState& state, SectionType type);

}

} // namespace state
} // namespace snw