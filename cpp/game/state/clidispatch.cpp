#include "cliDispatch.h"
#include "game/cliContext.h"
#include "lib/json/json.h"
#include <string>

using json = nlohmann::json;

namespace snw {
namespace state {

void ClientDispatch::enqueue(const DispatchAction& action) {}
void ClientDispatch::dispatch() {}

} // namespace state

namespace dispatch {

void startTalk(const std::string& talkName) {
  const DispatchAction action{DispatchActionType::CIVIL_DECLARE_TALK,
                              new json({"fileName", talkName})};
  ClientContext::getClientDispatch().enqueue(action);
}

} // namespace dispatch
} // namespace snw