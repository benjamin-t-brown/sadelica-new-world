#pragma once

#include "actions.h"
#include "lib/json/json.h"

namespace snw {
namespace state {

struct DispatchAction {
  ActionCl cl = ActionCl::LOOPBACK_ONLY;
  DispatchActionType type = DispatchActionType::NOOP_DISPATCH;
  nlohmann::json jsonPayload;
  ClientId clientId = ClientId::PLAYER_NONE;
};

} // namespace state
} // namespace snw
