#include "../stateClient.h"
#include "game/payloads.h"
#include "game/resultAction.h"
#include "lib/json/json.h"
#include "logger.h"
#include "resultHandlers.h"

namespace snw {
namespace state {

void initConnectionResultHandlers(ClientResultProcessor& p) {
  p.addHandler(
      //
      ResultActionType::NET_PLAYER_CONNECTED,
      //
      [](ClientState& state, const ResultAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadEstablishConnection>();

        if (args.playerId == state.client.playerId) {
          state.client.clientId = helpers::intToClientId(args.clientId);
          state.client.playerId = args.playerId;
          state.client.playerName = args.playerName;
          state.client.isConnected = true;

          logger::info("Connected as clientId=%i", state.client.clientId);

          // So we don't have to keep track of our state twice with extra
          // copies, no need to also store the client state here
          // state.clients[state.client.clientId] = state.client;
        } else {

          logger::info("Another client has connected as clientId=%i",
                       state.client.clientId);

          // check if another account exists with the clientId
          for (auto& it2 : state.clients) {
            auto acct = it2.second;
            if (acct.clientId == args.clientId && acct.isConnected) {
              logger::warn("ClientId '%i' is already connected! (updating "
                           "playerId to %s and playerName to %s)",
                           args.clientId,
                           args.playerId,
                           args.playerName);
              acct.playerId = args.playerId;
              acct.playerName = args.playerName;
              return;
            }

            ConnectedClient c;
            c.clientId = helpers::intToClientId(args.clientId);
            c.playerId = args.playerId;
            c.playerName = args.playerName;
            c.isConnected = true;
            state.clients[c.clientId] = c;
          }
        }
      });

  p.addHandler(
      //
      ResultActionType::NET_PLAYER_DISCONNECTED,
      //
      [](ClientState& state, const ResultAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadEstablishConnection>();
        logger::info("ClientId=%i has disconnected.", state.client.clientId);
        // check if another account exists with the clientId
        for (auto& it2 : state.clients) {
          auto acct = it2.second;
          if (acct.clientId == args.clientId && acct.isConnected) {
            acct.isConnected = false;
            return;
          }
        }
      });
}

} // namespace state
} // namespace snw