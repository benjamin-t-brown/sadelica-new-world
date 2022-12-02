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

        if (args.playerId == state.account.playerId) {
          state.account.clientId = helpers::intToClientId(args.clientId);
          state.account.playerId = args.playerId;
          state.account.playerName = args.playerName;
          state.account.isConnected = true;
          return;
        } else {

          // check if another account exists with the clientId
          for (auto& acct : state.otherAccounts) {
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
          }

          ConnectedClient c;
          c.clientId = helpers::intToClientId(args.clientId);
          c.playerId = args.playerId;
          c.playerName = args.playerName;
          c.isConnected = true;
          state.otherAccounts.push_back(c);
        }
      });
}

} // namespace state
} // namespace snw