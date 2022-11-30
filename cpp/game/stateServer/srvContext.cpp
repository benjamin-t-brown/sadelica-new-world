#include "srvContext.h"
#include "game/dispatchAction.h"
#include "game/resultAction.h"
#include "logger.h"

namespace snw {
namespace state {

constexpr int LISTEN_PORT = 7777;

ServerContext ServerContext::globalServerContext;

ServerContext::ServerContext() {}
void ServerContext::init() {
  ServerContext::get().getNetServer().listen(LISTEN_PORT);
#ifndef NET_ENABLED
  logger::info("SRV using mock net.");
#endif
  logger::info("SRV now listening on port %i", LISTEN_PORT);
}

ServerContext& ServerContext::get() { return globalServerContext; }

const ServerState& ServerContext::getState() const { return serverState; }
ServerState& ServerContext::getStateMut() { return serverState; }
const ServerState& ServerContext::setState(const ServerState& s) {
  serverState = ServerState(s);

  auto s2 = ServerContext::get().getState();

  return serverState;
}

net::Server& ServerContext::getNetServer() { return netServer; }
void ServerContext::update() {
  // auto payloadPtrs = clientDispatch.getPayloadPtrs();

  netServer.update([&](const std::string& socketId, const std::string& msg) {
    logger::info("SRV Recvd message from client (id=%s): %s",
                 socketId.c_str(),
                 msg.c_str());
    const auto actionList = jsonToDispatchActionList(msg);
    for (const auto& action : actionList.actions) {
      serverDispatchProcessor.enqueue(actionList.clientId, action);
    }
  });

  // clientDispatch.dispatch();
  // clientDispatch.reset();
  // clientLoopbackProcessor.process();
  // clientLoopbackProcessor.reset();
  serverDispatchProcessor.process();
  serverDispatchProcessor.reset();

  // for (auto it : payloadPtrs) {
  //   // NOLINTNEXTLINE
  //   auto j = reinterpret_cast<json*>(it);
  //   // NOLINTNEXTLINE
  //   delete j;
  // }
}

ServerContext& getSrvContext() { return ServerContext::get(); }

const ServerState& getSrvState() { return getSrvContext().getState(); }

} // namespace state
} // namespace snw
