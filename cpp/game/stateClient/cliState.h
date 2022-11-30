#pragma once

// #include "game/in2/in2.h"
#include "game/actions.h"
#include "game/sharedStateStructs.h"

namespace snw {
namespace state {

enum SectionType { NONE, MENU_SPLASH, CONVERSATION };

struct AccountInfo {
  ClientId id = ClientId::PLAYER1;
  std::string name;
  bool isConnected = false;
};

struct SectionInfo {
  SectionType type = SectionType::NONE;
};

struct ClientState {
  AccountInfo account;
  std::vector<SectionType> sections;
  In2State in2;
};

namespace helpers {

bool isSectionVisible(const ClientState& state, SectionType type);
void setIn2StateAfterExecution(ClientState& state);
ClientId intToClientId(int clientIdInt);

} // namespace helpers

} // namespace state
} // namespace snw
