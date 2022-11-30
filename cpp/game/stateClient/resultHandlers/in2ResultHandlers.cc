#include "../cliResultProcessor.h"
#include "game/payloads.h"
#include "game/resultAction.h"
#include "game/stateClient/cliState.h"
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
          return state;
        }

        // if (args.client

        auto newState = ClientState(state);
        // auto& in2State =
        //     newState.in2States.at(helpers::clientIdToIndex(it.clientId));
        // in2State.chName = args.chName;
        // in2State.choices = args.choices;
        // in2State.waitingState = args.waitingState;
        // in2State.conversationText = args.conversationText;

        return newState;
      });
}

} // namespace state
} // namespace snw