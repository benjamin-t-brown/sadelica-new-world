#include "../stateClient.h"
#include "game/payloads.h"
#include "game/resultAction.h"
#include "lib/json/json.h"
#include "resultHandlers.h"

namespace snw {
namespace state {

void initIn2ResultHandlers(ClientResultProcessor& p) {
  p.addHandler(
      //
      ResultActionType::TALK_UPDATED,
      //
      [](const ClientState& state, const ResultAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadCivilTalkUpdateResult>();

        if (args.clientId == 0) {
          logClientResultAssertionError(ResultActionType::TALK_UPDATED,
                                        "clientId is not valid.");
          return;
        }

        if (args.clientId == getClientId()) {
          return;
        }
      });
}

} // namespace state
} // namespace snw