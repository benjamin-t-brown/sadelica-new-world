#include "../stateServer.h"
#include "dispatchHandlers.h"
#include "game/state/actions/dispatchAction.h"
#include "game/state/actions/payloads.h"
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
        clientState.socketId = it.socketId;
        results::setConnected(clientId, args.playerId, args.playerName);
      });

  p.addHandler(
      //
      DispatchActionType::NET_DISCONNECT,
      //
      [](ServerState& state, const DispatchAction& it) {
        if (it.clientId == ClientId::PLAYER_NONE) {
          logger::warn("PLAYER_NONE disconnected socketId=%s.", it.socketId);
          return;
        }

        auto& clientState =
            state.clients.at(helpers::clientIdToIndex(it.clientId));

        if (!clientState.isConnected) {
          logger::warn("ClientId=%i is already disconnected.", it.clientId);
          return;
        }

        clientState.isConnected = false;

        results::setDisconnected(
            it.clientId, clientState.playerId, clientState.playerName);
      });
}

} // namespace state
} // namespace snw