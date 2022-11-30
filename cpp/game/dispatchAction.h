#pragma once

#include "actions.h"
#include "lib/json/json.h"

namespace snw {
namespace state {

struct DispatchAction {
  ActionCl cl = ActionCl::LOOPBACK_ONLY;
  DispatchActionType type = DispatchActionType::NOOP_DISPATCH;
  nlohmann::json jsonPayload;
  std::string clientId = "";
};

} // namespace state
} // namespace snw
