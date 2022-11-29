#pragma once

#include "game/in2/in2.h"
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

enum SectionType { NONE, MENU_SPLASH, CONVERSATION };

struct AccountInfo {
  std::string id = "";
  bool isConnected = false;
};

struct SectionInfo {
  SectionType type = SectionType::NONE;
};

struct In2State {
  snw::in2::In2Context* in2Ctx = nullptr;
  std::string conversationText = "";
  std::vector<std::string> choices;
  std::string chName = "";
};

struct ClientState {
  AccountInfo account;
  std::vector<SectionType> sections;
  In2State in2;

  // ClientState();
  // ClientState(const ClientState& state);
  // ClientState(ClientState&&) = default;
  // ClientState& operator=(const ClientState&) = default;
  // ClientState& operator=(ClientState&&) = default;
  // virtual ~ClientState() = default;
};

namespace helpers {

bool isSectionVisible(const ClientState& state, SectionType type);
void setIn2StateAfterExecution(ClientState& state);

} // namespace helpers

} // namespace state
} // namespace snw