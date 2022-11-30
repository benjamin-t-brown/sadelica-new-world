#pragma once

#include "lib/net/server.h"
#include "srvDispatchProcessor.h"
#include "srvResult.h"
#include "srvState.h"

namespace snw {
namespace state {

class ServerContext {
private:
  ServerState serverState;
  ServerDispatchProcessor serverDispatchProcessor;

  net::Server netServer;

  static ServerContext globalServerContext;

public:
  ServerContext();

  static void init();
  static ServerContext& get();

  const ServerState& getState() const;
  ServerState& getStateMut();
  const ServerState& setState(const ServerState& state);

  net::Server& getNetServer();
  void update();
};

ServerContext& getSrvContext();
const ServerState& getSrvState();

} // namespace state
} // namespace snw