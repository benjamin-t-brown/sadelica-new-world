#include "cliContext.h"
#include "cliLoopbackProcessor.h"
#include "cliState.h"
#include "game/actions.h"
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

void logAssertionError(DispatchActionType type, const std::string& msg) {
  logger::error("Failure at ClientLoopbackProcessor during %s: %s",
                dispatchActionString(type).c_str(),
                msg.c_str());
}

void ClientLoopbackProcessor::init() {
  handlers[DispatchActionType::TALK_START] =
      //
      [](const ClientState& state, const DispatchAction& it) {
        if (it.jsonPayload == nullptr) {
          logAssertionError(DispatchActionType::TALK_START, "payload is null.");
          return state;
        }

        if (state.in2.in2Ctx != nullptr) {
          logAssertionError(DispatchActionType::TALK_START,
                            "conversation is already active.");
          return state;
        }

        auto j = *reinterpret_cast<json*>(it.jsonPayload);

        auto args = j.get<snw::state::PayloadCivilDeclareTalk>();
        if (args.fileName == "") {
          logAssertionError(DispatchActionType::TALK_START, "fileName is ''.");
          return state;
        }

        auto newState = ClientState(state);
        newState.in2.in2Ctx = new in2::In2Context();
        newState.sections.push_back(SectionType::CONVERSATION);
        newState.in2.chName = args.fileName;
        newState.in2.in2Ctx->executeFile(args.fileName);
        helpers::setIn2StateAfterExecution(newState);

        return newState;
      };

  handlers[DispatchActionType::TALK_CONTINUE] =
      //
      [](const ClientState& state, const DispatchAction& it) {
        if (state.in2.in2Ctx == nullptr) {
          logAssertionError(DispatchActionType::TALK_CONTINUE,
                            "no conversation is active.");
          return state;
        }

        logger::info("Talk continue!");

        auto newState = ClientState(state);
        newState.in2.in2Ctx->resumeExecution();
        helpers::setIn2StateAfterExecution(newState);
        if (newState.in2.in2Ctx->isExecutionCompleted) {
          dispatch::endTalk();
        }

        return newState;
      };

  handlers[DispatchActionType::TALK_SELECT_CHOICE] =
      //
      [](const ClientState& state, const DispatchAction& it) {
        if (state.in2.in2Ctx == nullptr) {
          logAssertionError(DispatchActionType::TALK_SELECT_CHOICE,
                            "no conversation is active.");
          return state;
        }
        auto newState = ClientState(state);
        auto& choices = newState.in2.in2Ctx->getChoices();
        auto j = *reinterpret_cast<json*>(it.jsonPayload);
        auto args = j.get<snw::state::PayloadCivilTalkChoose>();
        if (args.choiceIndex < 0 ||
            args.choiceIndex > static_cast<int>(choices.size())) {
          logAssertionError(DispatchActionType::TALK_SELECT_CHOICE,
                            "choiceIndex is not valid: " +
                                std::to_string(args.choiceIndex));
          return state;
        }

        auto& choice = choices[args.choiceIndex];
        std::stringstream ss;
        ss << "  " << args.choiceIndex + 1 << ". " << choice.line;
        newState.in2.in2Ctx->pushLine(ss.str());
        newState.in2.in2Ctx->chooseExecution(choice.id);
        helpers::setIn2StateAfterExecution(newState);
        if (newState.in2.in2Ctx->isExecutionCompleted) {
          dispatch::endTalk();
        }

        logger::info("Log storage");
        newState.in2.in2Ctx->logStorage();

        return newState;
      };

  handlers[DispatchActionType::TALK_END] =
      //
      [](const ClientState& state, const DispatchAction& it) {
        if (state.in2.in2Ctx == nullptr) {
          logAssertionError(DispatchActionType::TALK_END,
                            "no conversation is active.");
          return state;
        }

        auto newState = ClientState(state);

        if (!newState.in2.in2Ctx->isExecutionCompleted) {
          logger::warn("Ending conversation without conversation having been "
                       "completed.");
        }

        delete newState.in2.in2Ctx;
        newState.in2.in2Ctx = nullptr;
        newState.in2.conversationText = "";
        newState.in2.chName = "";
        newState.in2.choices = {};
        newState.sections.erase(
            std::remove_if(
                newState.sections.begin(),
                newState.sections.end(),
                [](SectionType i) { return i == SectionType::CONVERSATION; }),
            newState.sections.end());

        return newState;
      };
}

} // namespace state
} // namespace snw