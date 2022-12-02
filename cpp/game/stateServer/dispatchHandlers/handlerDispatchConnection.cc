#include "../stateServer.h"
#include "dispatchHandlers.h"
#include "game/dispatchAction.h"
#include "game/payloads.h"
#include "lib/json/json.h"
#include "logger.h"

namespace snw {
namespace state {

void initConnectionSrvHandlers(ServerDispatchProcessor& p) {
  p.addHandler(
      //
      DispatchActionType::NET_CONNECT,
      //
      [](ServerState& state, const DispatchAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadEstablishConnection>();

        ClientId clientId = ClientId::PLAYER1;

        if (state.clients[0].isConnected) {
          clientId = ClientId::PLAYER2;
        }

        auto& clientState =
            state.clients.at(helpers::clientIdToIndex(clientId));

        if (clientState.isConnected) {
          logger::error("Both clients are already connected!");
          return;
        }
        clientState.playerName = args.playerName;
        clientState.playerId = args.playerId;
        clientState.isConnected = true;
        results::setConnected(clientId, args.playerId, args.playerName);
      });
}

} // namespace state
} // namespace snw