#pragma once

// #include "lib/sdl2wrapper/Window.h"
#include "game/state/clidispatch.h"
#include "game/state/clistate.h"
#include "game/state/result.h"
#include "game/state/srvstate.h"

namespace snw {

class Context {
private:
  static snw::state::ClientState* clientState;
  static snw::state::ServerState* serverState;

public:
  static void init();

  static state::DispatchProcessor dispatchProcessor;
  static state::ResultProcessor resultProcessor;

  static void setClientState(snw::state::ClientState* s);
  static const snw::state::ClientState& getClientState();
  static snw::state::ClientState& getClientStateMut();

  static void setServerState(snw::state::ServerState* s);
  static const snw::state::ServerState& getServerState();
  static snw::state::ServerState& getServerStateMut();
};

} // namespace snw