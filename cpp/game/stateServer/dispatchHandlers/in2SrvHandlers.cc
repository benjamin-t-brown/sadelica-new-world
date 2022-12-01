#include "dispatchHandlers.h"
#include "game/dispatchAction.h"
#include "game/payloads.h"
#include "game/stateServer/srvResult.h"
#include "game/stateServer/srvState.h"
#include "lib/json/json.h"

namespace snw {
namespace state {

void initIn2SrvHandlers(ServerDispatchProcessor& p) {
  p.addHandler(
      //
      DispatchActionType::TALK_START,
      //
      [](ServerState& state, const DispatchAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadCivilDeclareTalk>();
        if (args.fileName == "") {
          logServerDispatchAssertionError(DispatchActionType::TALK_START,
                                          "fileName is empty str ''.");
          return;
        }

        auto& in2State =
            state.in2States.at(helpers::clientIdToIndex(it.clientId));
        in2State.chName = args.fileName;
        in2State.waitingState = In2WaitingState::WAITING_FOR_CONTINUE;
      });

  p.addHandler(
      //
      DispatchActionType::TALK_CONTINUE,
      //
      [](ServerState& state, const DispatchAction& it) {});

  p.addHandler(
      //
      DispatchActionType::TALK_SELECT_CHOICE,
      //
      [](ServerState& state, const DispatchAction& it) {});

  p.addHandler(
      //
      DispatchActionType::TALK_END,
      //
      [](ServerState& state, const DispatchAction& it) {
        auto& in2State =
            state.in2States.at(helpers::clientIdToIndex(it.clientId));
        in2State.waitingState = In2WaitingState::IN2_NONE;
      });

  p.addHandler(
      //
      DispatchActionType::TALK_UPDATE,
      //
      [](ServerState& state, const DispatchAction& it) {
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadCivilTalkUpdate>();

        auto& in2State =
            state.in2States.at(helpers::clientIdToIndex(it.clientId));
        in2State.chName = args.chName;
        in2State.choices = args.choices;
        in2State.waitingState = args.waitingState;
        in2State.conversationText = args.conversationText;

        result::setTalkUpdated(it.clientId, in2State);
      });
}

} // namespace state
} // namespace snw