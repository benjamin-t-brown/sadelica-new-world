#include "game/actions.h"
#include "game/dispatchAction.h"
#include "game/payloads.h"
#include "game/stateClient/cliContext.h"
#include "game/stateClient/cliLoopbackProcessor.h"
#include "game/stateClient/cliState.h"
#include "lib/json/json.h"
#include "logger.h"
#include "utils/utils.h"

using json = nlohmann::json;

namespace snw {
namespace state {

void initConnectionLoopbackHandlers(ClientLoopbackProcessor& p) {
  p.addHandler(
      //
      DispatchActionType::NET_CONNECT,
      //
      [](const ClientState& state, const DispatchAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadEstablishConnection>();
        auto newState = ClientState(state);
        newState.account.isConnected = false;
        newState.account.name = args.playerName;
        return newState;
      });
}

} // namespace state
} // namespace snw