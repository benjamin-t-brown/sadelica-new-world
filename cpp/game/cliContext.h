#pragma once

#include "game/state/cliDispatch.h"
#include "game/state/cliResultProcessor.h"
#include "game/state/cliState.h"
#include "game/state/srvState.h"

namespace snw {

class ClientContext {
private:
  static snw::state::ClientState* clientState;
  static state::ClientDispatch clientDispatch;
  static state::ClientResultProcessor clientResultProcessor;

public:
  static void init();

  static void setClientState(snw::state::ClientState* s);
  static const snw::state::ClientState& getClientState();
  static snw::state::ClientState& getClientStateMut();

  static state::ClientDispatch& getClientDispatch();
};

} // namespace snw