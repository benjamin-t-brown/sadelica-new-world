#include "../cliContext.h"
#include "../cliLoopbackProcessor.h"
#include "../cliState.h"
#include "game/actions.h"
#include "game/dispatchAction.h"
#include "lib/json/jsonHelpers.h"
#include "logger.h"
#include "utils/utils.h"

using json = nlohmann::json;

namespace snw {
namespace state {

struct PayloadCivilDeclareTalk {
  std::string fileName = "";
  // this macro makes this struct deserializable so you can do:
  // auto args = j.get<snw::state::PayloadCivilDeclareTalk>();
  NLOHMANN_DEFINE_TYPE_INTRUSIVE(PayloadCivilDeclareTalk, fileName)
};

struct PayloadCivilTalkChoose {
  int choiceIndex = -1;
  NLOHMANN_DEFINE_TYPE_INTRUSIVE(PayloadCivilTalkChoose, choiceIndex)
};

void initIn2Handlers(ClientLoopbackProcessor& p) {
  p.addHandler(
      //
      DispatchActionType::TALK_START,
      //
      [](const ClientState& state, const DispatchAction& it) {
        auto& in2Ctx = getCliContext().getIn2Ctx();

        if (in2Ctx.isExecutionActive()) {
          logLoopbackDispatchAssertionError(DispatchActionType::TALK_START,
                                            "conversation is already active.");
          return state;
        }

        auto& j = it.jsonPayload;

        auto args = j.get<snw::state::PayloadCivilDeclareTalk>();
        if (args.fileName == "") {
          logLoopbackDispatchAssertionError(DispatchActionType::TALK_START,
                                            "fileName is empty str ''.");
          return state;
        }

        auto newState = ClientState(state);
        newState.sections.push_back(SectionType::CONVERSATION);
        newState.in2.chName = args.fileName;
        in2Ctx.createNewCtx();
        in2Ctx.executeFile(args.fileName);
        helpers::setIn2StateAfterExecution(newState);

        return newState;
      });

  p.addHandler(
      //
      DispatchActionType::TALK_CONTINUE,
      //
      [](const ClientState& state, const DispatchAction& it) {
        auto& in2Ctx = getCliContext().getIn2Ctx();

        if (!in2Ctx.isExecutionActive()) {
          logLoopbackDispatchAssertionError(DispatchActionType::TALK_CONTINUE,
                                            "no conversation is active.");
          return state;
        }

        logger::info("Talk continue!");

        auto newState = ClientState(state);
        in2Ctx.resumeExecution();
        helpers::setIn2StateAfterExecution(newState);
        if (in2Ctx.executionCompleted) {
          dispatch::endTalk();
        }

        return newState;
      });

  p.addHandler(
      //
      DispatchActionType::TALK_SELECT_CHOICE,
      //
      [](const ClientState& state, const DispatchAction& it) {
        auto& in2Ctx = getCliContext().getIn2Ctx();

        if (!in2Ctx.isExecutionActive()) {
          logLoopbackDispatchAssertionError(
              DispatchActionType::TALK_SELECT_CHOICE,
              "no conversation is active.");
          return state;
        }

        auto newState = ClientState(state);
        auto& choices = in2Ctx.getChoices();
        auto& j = it.jsonPayload;
        auto args = j.get<snw::state::PayloadCivilTalkChoose>();
        if (args.choiceIndex < 0 ||
            args.choiceIndex > static_cast<int>(choices.size())) {
          logLoopbackDispatchAssertionError(
              DispatchActionType::TALK_SELECT_CHOICE,
              "choiceIndex is not valid: " + std::to_string(args.choiceIndex));
          return state;
        }

        auto& choice = choices[args.choiceIndex];
        std::stringstream ss;
        ss << "  " << args.choiceIndex + 1 << ". " << choice.line;
        in2Ctx.pushLine(ss.str());
        in2Ctx.chooseExecution(choice.id);
        helpers::setIn2StateAfterExecution(newState);
        if (in2Ctx.executionCompleted) {
          dispatch::endTalk();
        }

        logger::info("Log storage");
        in2Ctx.logStorage();

        return newState;
      });

  p.addHandler(
      //
      DispatchActionType::TALK_END,
      //
      [](const ClientState& state, const DispatchAction& it) {
        auto& in2Ctx = getCliContext().getIn2Ctx();

        if (!in2Ctx.isExecutionActive()) {
          logLoopbackDispatchAssertionError(DispatchActionType::TALK_END,
                                            "no conversation is active.");
          return state;
        }

        auto newState = ClientState(state);

        if (!in2Ctx.executionCompleted) {
          logger::warn("Ending conversation without conversation having been "
                       "completed.");
        }

        in2Ctx.cleanCtx();
        newState.in2.conversationText = "";
        newState.in2.chName = "";
        newState.in2.choices = {};
        newState.in2.waitingState = In2WaitingState::IN2_NONE;
        newState.sections.erase(
            std::remove_if(
                newState.sections.begin(),
                newState.sections.end(),
                [](SectionType i) { return i == SectionType::CONVERSATION; }),
            newState.sections.end());

        return newState;
      });
}

} // namespace state
} // namespace snw