#pragma once

#include "game/in2/in2.h"
#include "game/state/actions/sharedState.h"
#include <unordered_map>

namespace snw {
namespace state {

enum SectionType { NONE, MENU_SPLASH, CONVERSATION };

struct SectionInfo {
  SectionType type = SectionType::NONE;
};

struct ClientState {
  ConnectedClient client;
  std::unordered_map<ClientId, ConnectedClient> clients;
  In2State in2;
  std::unordered_map<ClientId, In2State> in2States;
  std::vector<SectionType> sections;
};

} // namespace state
} // namespace snw