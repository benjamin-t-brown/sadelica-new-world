#include "clidispatch.h"
#include "game/context.h"
#include "lib/json/json.h"
#include <string>

using json = nlohmann::json;

namespace snw {
namespace state {

void DispatchProcessor::enqueue(const DispatchAction& action) {}
void DispatchProcessor::apply() {}

} // namespace state

namespace dispatch {

void startTalk(const std::string& talkName) {
  auto payloadPtr = new json();
  json& payload = *payloadPtr;
  payload["filename"] = talkName;
  const DispatchAction action{DispatchActionType::CIVIL_DECLARE_TALK,
                              payloadPtr};
  snw::Context::dispatchProcessor.enqueue(action);
}

} // namespace dispatch
} // namespace snw