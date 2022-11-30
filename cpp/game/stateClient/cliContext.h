#pragma once

#include "cliDispatch.h"
#include "cliLoopbackProcessor.h"
#include "cliResultProcessor.h"
#include "cliState.h"
#include "game/in2/in2.h"
#include "lib/net/client.h"

namespace snw {
namespace state {

class ClientContext {
private:
  ClientState clientState;
  ClientDispatch clientDispatch;
  ClientResultProcessor clientResultProcessor;
  ClientLoopbackProcessor clientLoopbackProcessor;

  snw::in2::In2Context in2Ctx;

  net::Client netClient;

  static ClientContext globalClientContext;

public:
  ClientContext();

  static void init();
  static ClientContext& get();

  const ClientState& getState() const;
  const ClientState& setState(const ClientState& state);

  ClientDispatch& getDispatch();
  ClientResultProcessor& getResultProcessor();
  ClientLoopbackProcessor& getLoopbackProcessor();
  net::Client& getNetClient();
  snw::in2::In2Context& getIn2Ctx();
  void update();
};

ClientContext& getCliContext();
const ClientState& getCliState();
const ClientId getClientId();

} // namespace state
} // namespace snw