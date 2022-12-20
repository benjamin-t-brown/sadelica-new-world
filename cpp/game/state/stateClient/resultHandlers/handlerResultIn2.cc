#include "../stateClient.h"
#include "../stateClientContext.h"
#include "game/state/state.h"
#include "game/state/actions/payloads.h"
#include "game/state/actions/resultAction.h"
#include "lib/json/json.h"
#include "resultHandlers.h"

namespace snw {
namespace state {

void initIn2ResultHandlers(ClientResultProcessor& p) {
  p.addHandler(
      //
      ResultActionType::TALK_UPDATED,
      //
      [](ClientState& state, const ResultAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadCivilTalkUpdateResult>();

        if (args.clientId == 0) {
          logClientResultAssertionError(ResultActionType::TALK_UPDATED,
                                        "clientId is not valid.");
          return;
        }

        auto clientId = helpers::intToClientId(args.clientId);

        if (clientId == getClientId()) {
          return;
        }

        if (state.in2States.find(args.clientId) == state.in2States.end()) {
          In2State in2;
          in2.chName = args.chName;
          in2.choices = args.choices;
          in2.conversationText = args.conversationText;
          in2.waitingState = args.waitingState;
          state.in2States[clientId] = in2;
        } else {
          In2State& in2 = state.in2States[clientId];
          in2.chName = args.chName;
          in2.choices = args.choices;
          in2.conversationText = args.conversationText;
          in2.waitingState = args.waitingState;
          state.in2States[clientId] = in2;
        }
      });
}

} // namespace state
} // namespace snw