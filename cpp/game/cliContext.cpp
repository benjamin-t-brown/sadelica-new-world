#include "cliContext.h"

using ClientState = snw::state::ClientState;

namespace snw {

ClientState* ClientContext::clientState = nullptr;
state::ClientDispatch ClientContext::clientDispatch;
state::ClientResultProcessor ClientContext::clientResultProcessor;

void ClientContext::init() {}

void ClientContext::setClientState(snw::state::ClientState* s) {}

const ClientState& ClientContext::getClientState() {
  if (clientState == nullptr) {
    throw std::runtime_error("Cannot getClientState! (was it initialized?)");
  }
  return *clientState;
}

ClientState& ClientContext::getClientStateMut() {
  if (clientState == nullptr) {
    throw std::runtime_error("Cannot getClientStateMut! (was it initialized?)");
  }
  return *clientState;
}

state::ClientDispatch& ClientContext::getClientDispatch() {
  return clientDispatch;
}

} // namespace snw