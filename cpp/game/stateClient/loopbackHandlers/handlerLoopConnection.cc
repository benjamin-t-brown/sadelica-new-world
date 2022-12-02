#include "../stateClient.h"
#include "game/actions.h"
#include "game/dispatchAction.h"
#include "game/payloads.h"
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
        logger::info("setting net connect action on loopback");

        state.client.isConnected = false;
        state.client.playerId = args.playerId;
        state.client.playerName = args.playerName;
      });
}

} // namespace state
} // namespace snw