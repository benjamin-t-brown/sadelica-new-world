#pragma once

#include "./stateClient/stateClient.h"
#include "./stateServer/stateServer.h"

namespace snw {
namespace state {
const ClientState& getClientState();
const ServerState& getServerState();

const ClientId getClientId();
const snw::in2::In2Context& getIn2Ctx();

} // namespace state
} // namespace snw
