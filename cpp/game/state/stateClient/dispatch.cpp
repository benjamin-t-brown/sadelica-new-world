#include "game/state/actions/actions.h"
#include "game/state/actions/dispatchAction.h"
#include "game/state/actions/payloads.h"
#include "game/state/state.h"
#include "game/state/stateClient/stateClient.h"
#include "game/state/stateClient/stateClientContext.h"
#include "lib/json/json.h"
#include "utils/utils.h"

using json = nlohmann::json;
using DispatchActionType = snw::state::DispatchActionType;
using ActionCl = snw::state::ActionCl;

namespace snw {
namespace state {
namespace dispatch {

void establishConnection(const std::string& playerName) {
  const DispatchAction action{ActionCl::BOTH,
                              DispatchActionType::NET_CONNECT,
                              json(payloads::PayloadEstablishConnection{
                                  0, utils::getRandomId(), playerName})};
  ClientContext::get().getDispatch().enqueue(action);
}

void unEstablishConnection() {
  const DispatchAction action{ActionCl::BOTH,
                              DispatchActionType::NET_DISCONNECT,
                              json(payloads::PayloadEstablishConnection{
                                  0,
                                  getClientState().client.playerId,
                                  getClientState().client.playerName})};
  ClientContext::get().getDispatch().enqueue(action);
}

void startTalk(const std::string& talkName) {
  const DispatchAction action{ActionCl::BOTH,
                              DispatchActionType::TALK_START,
                              json({{"fileName", talkName}})};

  ClientContext::get().getDispatch().enqueue(action);
}

void continueTalk() {
  const DispatchAction action{
      ActionCl::BOTH, DispatchActionType::TALK_CONTINUE, nullptr};

  ClientContext::get().getDispatch().enqueue(action);
}

void chooseTalk(const int choiceIndex) {
  const DispatchAction action{ActionCl::BOTH,
                              DispatchActionType::TALK_SELECT_CHOICE,
                              json({{"choiceIndex", choiceIndex}})};

  ClientContext::get().getDispatch().enqueue(action);
}

void endTalk() {
  const DispatchAction action{
      ActionCl::BOTH, DispatchActionType::TALK_END, nullptr};

  ClientContext::get().getDispatch().enqueue(action);
}

void updateTalk(const In2State& in2State) {
  const DispatchAction action{
      ActionCl::SEND_ONLY,
      DispatchActionType::TALK_UPDATE,
      json({{"conversationText", in2State.conversationText},
            {"choices", in2State.choices},
            {"chName", in2State.chName},
            {"waitingState", in2State.waitingState}})};

  ClientContext::get().getDispatch().enqueue(action);
}
} // namespace dispatch
} // namespace state
} // namespace snw