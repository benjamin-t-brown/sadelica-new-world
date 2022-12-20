#include "../stateClient.h"
#include "../stateClientContext.h"
#include "game/state/actions/actions.h"
#include "game/state/actions/dispatchAction.h"
#include "game/state/actions/payloads.h"
#include "game/state/stateClient/dispatch.h"
#include "lib/json/json.h"
#include "logger.h"
#include "utils/utils.h"

using json = nlohmann::json;

namespace snw {
namespace state {

void initIn2Handlers(ClientLoopbackProcessor& p) {
  p.addHandler(
      //
      DispatchActionType::TALK_START,
      //
      [](ClientState& state, const DispatchAction& it) {
        auto& in2Ctx = snw::state::ClientContext::get().getIn2Ctx();

        if (in2Ctx.isExecutionActive()) {
          logLoopbackDispatchAssertionError(DispatchActionType::TALK_START,
                                            "conversation is already active.");
          return;
        }

        auto& j = it.jsonPayload;

        auto args = j.get<payloads::PayloadCivilDeclareTalk>();
        if (args.fileName == "") {
          logLoopbackDispatchAssertionError(DispatchActionType::TALK_START,
                                            "fileName is empty str ''.");
          return;
        }

        state.sections.push_back(SectionType::CONVERSATION);
        state.in2.chName = args.fileName;
        state.in2.conversationText = "";

        in2Ctx.createNewCtx();
        in2Ctx.executeFile(args.fileName);
        helpers::setIn2StateAfterExecution(state);
        dispatch::updateTalk(state.in2);
        // dispatch::update
      });

  p.addHandler(
      //
      DispatchActionType::TALK_CONTINUE,
      //
      [](ClientState& state, const DispatchAction& it) {
        auto& in2Ctx = snw::state::ClientContext::get().getIn2Ctx();

        if (!in2Ctx.isExecutionActive()) {
          logLoopbackDispatchAssertionError(DispatchActionType::TALK_CONTINUE,
                                            "no conversation is active.");
          return;
        }

        in2Ctx.resumeExecution();
        helpers::setIn2StateAfterExecution(state);
        if (in2Ctx.executionCompleted) {
          dispatch::endTalk();
        }
        dispatch::updateTalk(state.in2);
      });

  p.addHandler(
      //
      DispatchActionType::TALK_SELECT_CHOICE,
      //
      [](ClientState& state, const DispatchAction& it) {
        auto& in2Ctx = snw::state::ClientContext::get().getIn2Ctx();

        if (!in2Ctx.isExecutionActive()) {
          logLoopbackDispatchAssertionError(
              DispatchActionType::TALK_SELECT_CHOICE,
              "no conversation is active.");
          return;
        }

        auto& choices = in2Ctx.getChoices();
        auto& j = it.jsonPayload;
        auto args = j.get<payloads::PayloadCivilTalkChoose>();
        if (args.choiceIndex < 0 ||
            args.choiceIndex > static_cast<int>(choices.size())) {
          logLoopbackDispatchAssertionError(
              DispatchActionType::TALK_SELECT_CHOICE,
              "choiceIndex is not valid: " + std::to_string(args.choiceIndex));
          return;
        }

        auto& choice = choices[args.choiceIndex];
        std::stringstream ss;
        ss << "  " << args.choiceIndex + 1 << ". " << choice.line;
        in2Ctx.pushLine(ss.str());
        in2Ctx.chooseExecution(choice.id);
        helpers::setIn2StateAfterExecution(state);
        if (in2Ctx.executionCompleted) {
          dispatch::endTalk();
        }
        dispatch::updateTalk(state.in2);

        logger::info("Log storage");
        in2Ctx.logStorage();
      });

  p.addHandler(
      //
      DispatchActionType::TALK_END,
      //
      [](ClientState& state, const DispatchAction& it) {
        auto& in2Ctx = snw::state::ClientContext::get().getIn2Ctx();

        if (!in2Ctx.isExecutionActive()) {
          logLoopbackDispatchAssertionError(DispatchActionType::TALK_END,
                                            "no conversation is active.");
          return;
        }

        if (!in2Ctx.executionCompleted) {
          logger::warn("Ending conversation without conversation having been "
                       "completed.");
        }

        in2Ctx.cleanCtx();
        state.in2.conversationText = "";
        state.in2.chName = "";
        state.in2.choices = {};
        state.in2.waitingState = In2WaitingState::IN2_NONE;
        helpers::removeSection(state, SectionType::CONVERSATION);
      });
}

} // namespace state
} // namespace snw