#include "../cliResultProcessor.h"
#include "game/payloads.h"
#include "game/resultAction.h"
#include "game/stateClient/cliContext.h"
#include "game/stateClient/cliState.h"
#include "lib/json/json.h"
#include "resultHandlers.h"

namespace snw {
namespace state {

void initConnectionResultHandlers(ClientResultProcessor& p) {
  p.addHandler(
      //
      ResultActionType::NET_PLAYER_CONNECTED,
      //
      [](const ClientState& state, const ResultAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadEstablishConnection>();

        if (args.clientId == 0) {
          logClientResultAssertionError(ResultActionType::NET_PLAYER_CONNECTED,
                                        "clientId is not valid.");
          return state;
        }

        if (args.playerName != getCliState().account.name) {
          return state;
        }

        auto newState = ClientState(state);
        newState.account.isConnected = true;
        newState.account.id = helpers::intToClientId(args.clientId);

        return newState;
      });
}

} // namespace state
} // namespace snw