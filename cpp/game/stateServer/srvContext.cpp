#include "srvContext.h"

namespace snw {
namespace state {

ServerContext ServerContext::globalServerContext;

ServerContext::ServerContext() {}
void ServerContext::init() {}

ServerContext& ServerContext::get() { return globalServerContext; }

const ServerState& ServerContext::getState() const { return serverState; }
ServerState& ServerContext::getStateMut() { return serverState; }
const ServerState& ServerContext::setState(const ServerState& s) {
  serverState = ServerState(s);

  auto s2 = ServerContext::get().getState();

  return serverState;
}

net::Server& ServerContext::getNetServer() { return netServer; }
void ServerContext::update() {}

} // namespace state
} // namespace snw