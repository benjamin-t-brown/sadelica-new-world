#include "state.h"
#include "stateClient/stateClientContext.h"
#include "stateServer/stateServerContext.h"

namespace snw {
namespace state {

const ClientState& getClientState() { return ClientContext::get().getState(); }
const ServerState& getServerState() { return ServerContext::get().getState(); }

const ClientId getClientId() { return getClientState().client.clientId; }

const snw::in2::In2Context& getIn2Ctx() {
  return ClientContext::get().getIn2Ctx();
}

} // namespace state
} // namespace snw
