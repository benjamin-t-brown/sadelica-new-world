#pragma once

// #include "lib/sdl2wrapper/Window.h"
#include "game/state/statecli.h"
#include "game/state/statesrv.h"

namespace SNW {

class Context {
private:
  static SNW::State::ClientState* clientState;
  static SNW::State::ServerState* serverState;

public:
  static void init();

  static void setClientState(SNW::State::ClientState* s);
  static const SNW::State::ClientState& getClientState();
  static SNW::State::ClientState& getClientStateMut();

  static void setServerState(SNW::State::ServerState* s);
  static const SNW::State::ServerState& getServerState();
  static SNW::State::ServerState& getServerStateMut();
};

} // namespace SNW