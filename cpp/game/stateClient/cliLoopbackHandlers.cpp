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
  NLOHMANN_DEFINE_TYPE_INTRUSIVE(PayloadCivilDeclareTalk, fileName)
};

struct PayloadCivilTalkChoose {
  std::string choiceId = "";
  NLOHMANN_DEFINE_TYPE_INTRUSIVE(PayloadCivilTalkChoose, choiceId)
};

void logAssertionError(DispatchActionType type, const std::string& msg) {
  logger::error("Failure at ClientLoopbackProcessor during {}: {}",
                dispatchActionString(type),
                msg);
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
        newState.in2.in2Ctx->executeFile(args.fileName);
        newState.sections.push_back(SectionType::CONVERSATION);
        newState.in2.conversationText =
            utils::join(newState.in2.in2Ctx->getLines(), "\n");

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

        auto newState = ClientState(state);
        newState.in2.in2Ctx->resumeExecution();
        newState.in2.conversationText =
            utils::join(newState.in2.in2Ctx->getLines(), "\n");

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

        auto j = *reinterpret_cast<json*>(it.jsonPayload);
        auto args = j.get<snw::state::PayloadCivilTalkChoose>();
        if (args.choiceId == "") {
          logAssertionError(DispatchActionType::TALK_SELECT_CHOICE,
                            "choiceId is ''.");
          return state;
        }

        auto newState = ClientState(state);
        newState.in2.in2Ctx->chooseExecution(args.choiceId);

        newState.in2.conversationText =
            utils::join(newState.in2.in2Ctx->getLines(), "\n");

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