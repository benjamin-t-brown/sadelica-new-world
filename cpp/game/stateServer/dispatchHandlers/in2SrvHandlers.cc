#include "dispatchHandlers.h"
#include "game/dispatchAction.h"
#include "game/payloads.h"
#include "game/stateServer/srvState.h"
#include "lib/json/json.h"

namespace snw {
namespace state {

void initIn2SrvHandlers(ServerDispatchProcessor& p) {
  p.addHandler(
      //
      DispatchActionType::TALK_START,
      //
      [](const ServerState& state, const DispatchAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadCivilDeclareTalk>();
        if (args.fileName == "") {
          logServerDispatchAssertionError(DispatchActionType::TALK_START,
                                          "fileName is empty str ''.");
          return state;
        }

        auto newState = ServerState(state);
        auto& in2State =
            newState.in2States.at(helpers::clientIdToIndex(it.clientId));
        in2State.chName = args.fileName;
        in2State.waitingState = In2WaitingState::WAITING_FOR_CONTINUE;

        return newState;
      });

  p.addHandler(
      //
      DispatchActionType::TALK_CONTINUE,
      //
      [](const ServerState& state, const DispatchAction& it) { return state; });

  p.addHandler(
      //
      DispatchActionType::TALK_SELECT_CHOICE,
      //
      [](const ServerState& state, const DispatchAction& it) { return state; });

  p.addHandler(
      //
      DispatchActionType::TALK_END,
      //
      [](const ServerState& state, const DispatchAction& it) {
        auto newState = ServerState(state);
        auto& in2State =
            newState.in2States.at(helpers::clientIdToIndex(it.clientId));
        in2State.waitingState = In2WaitingState::IN2_NONE;

        return newState;
      });

  p.addHandler(
      //
      DispatchActionType::TALK_UPDATE,
      //
      [](const ServerState& state, const DispatchAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadCivilTalkUpdate>();

        auto newState = ServerState(state);
        auto& in2State =
            newState.in2States.at(helpers::clientIdToIndex(it.clientId));
        in2State.chName = args.chName;
        in2State.choices = args.choices;
        in2State.waitingState = args.waitingState;
        in2State.conversationText = args.conversationText;

        return newState;
      });
}

} // namespace state
} // namespace snw