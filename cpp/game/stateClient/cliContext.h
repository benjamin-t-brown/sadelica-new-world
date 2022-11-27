#pragma once

#include "cliDispatch.h"
#include "cliLoopbackProcessor.h"
#include "cliResultProcessor.h"
#include "cliState.h"

namespace snw {
namespace state {

class ClientContext {
private:
  ClientState clientState;
  ClientDispatch clientDispatch;
  ClientResultProcessor clientResultProcessor;
  ClientLoopbackProcessor clientLoopbackProcessor;

  static ClientContext globalClientContext;

public:
  ClientContext();

  static void init();
  static ClientContext& get();

  const ClientState& getState() const;
  ClientState& getStateMut();
  const ClientState& setState(const ClientState& state);

  ClientDispatch& getDispatch();
  ClientResultProcessor& getResultProcessor();
  ClientLoopbackProcessor& getLoopbackProcessor();
  void update();
};

} // namespace state
} // namespace snw