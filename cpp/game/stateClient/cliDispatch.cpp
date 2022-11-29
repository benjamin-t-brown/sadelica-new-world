#include "cliDispatch.h"
#include "cliContext.h"
#include "lib/json/json.h"
#include "logger.h"
#include <string>

using json = nlohmann::json;
using ClientContext = snw::state::ClientContext;
using DispatchActionType = snw::state::DispatchActionType;
using ActionCl = snw::state::ActionCl;

namespace snw {
namespace state {

void ClientDispatch::enqueue(const DispatchAction& action) {
  actionsToCommit.push_back(action);
}
void ClientDispatch::dispatch() {
  json serverPayload = json::array();

  for (auto& it : actionsToCommit) {
    logger::debug("Dispatch action: %s", dispatchActionString(it.type).c_str());
    switch (it.cl) {
    case ActionCl::LOOPBACK_ONLY:
      ClientContext::get().getLoopbackProcessor().enqueue(it);
      break;
    case ActionCl::BOTH:
      ClientContext::get().getLoopbackProcessor().enqueue(it);
    case ActionCl::SEND_ONLY: {
      json action;
      action["type"] = it.type;
      if (it.jsonPayload != nullptr) {
        json* p = reinterpret_cast<json*>(it.jsonPayload);
        action["payload"] = *p;
      }
      serverPayload.push_back(action);
      break;
    }
    }
  }

  if (serverPayload.size() > 0) {
    const json message = {{"id", getCliState().account.id},
                          {"payload", serverPayload}};
    logger::debug("Sending to server: %s", message.dump().c_str());
    getCliContext().getNetClient().send(message.dump());
  }
}

std::vector<void*> ClientDispatch::getPayloadPtrs() {
  std::vector<void*> ptrs;
  for (auto& it : actionsToCommit) {
    if (it.jsonPayload != nullptr) {
      ptrs.push_back(it.jsonPayload);
    }
  }
  return ptrs;
}

void ClientDispatch::reset() {
  actionsToCommit.erase(actionsToCommit.begin(), actionsToCommit.end());
}

namespace dispatch {

void startTalk(const std::string& talkName) {
  const DispatchAction action{ActionCl::BOTH,
                              DispatchActionType::TALK_START,
                              new json({{"fileName", talkName}})};

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
                              new json({{"choiceIndex", choiceIndex}})};

  ClientContext::get().getDispatch().enqueue(action);
}

void endTalk() {
  const DispatchAction action{
      ActionCl::BOTH, DispatchActionType::TALK_END, nullptr};

  ClientContext::get().getDispatch().enqueue(action);
}

} // namespace dispatch
} // namespace state
} // namespace snw