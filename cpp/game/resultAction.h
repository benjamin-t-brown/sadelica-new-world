#pragma once

#include "actions.h"
#include "lib/json/json.h"

namespace snw {
namespace state {

struct ResultAction {
  ResultActionType type = ResultActionType::NOOP_RESULT;
  nlohmann::json jsonPayload;
};

} // namespace state
} // namespace snw