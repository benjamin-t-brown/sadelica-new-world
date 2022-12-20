#include "../stateClient.h"
#include "../stateClientContext.h"
#include "game/state/actions/actions.h"
#include "game/state/actions/dispatchAction.h"
#include "game/state/actions/payloads.h"
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
      [](ClientState& state, const DispatchAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadEstablishConnection>();

        state.client.isConnected = false;
        state.client.playerId = args.playerId;
        state.client.playerName = args.playerName;
      });

  p.addHandler(
      //
      DispatchActionType::NET_DISCONNECT,
      //
      [](ClientState& state, const DispatchAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadEstablishConnection>();

        state.client.isConnected = false;
        state.client.playerId = args.playerId;
        state.client.playerName = args.playerName;
      });
}

} // namespace state
} // namespace snw