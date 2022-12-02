#pragma once

#include "game/actions.h"
#include "game/sharedState.h"
#include "lib/net/server.h"
#include <functional>
#include <unordered_map>
#include <vector>

namespace snw {
namespace state {

struct ServerState {
  std::vector<ConnectedClient> clients = {ConnectedClient(), ConnectedClient()};
  std::vector<In2State> in2States = {In2State(), In2State()};
};

class ServerDispatchProcessor {
private:
  std::vector<DispatchAction> actionsToCommit;
  std::unordered_map<DispatchActionType,
                     std::function<void(ServerState&, const DispatchAction&)>>
      handlers;

  void init();

public:
  ServerDispatchProcessor();
  void enqueue(const ClientId clientId, const DispatchAction& action);
  void process();
  void reset();
  void
  addHandler(DispatchActionType type,
             std::function<void(ServerState&, const DispatchAction&)> handler);
};

void logServerDispatchAssertionError(DispatchActionType type,
                                     const std::string& msg);

class ServerResult {
private:
  std::vector<ResultAction> actionsToCommit;

public:
  void enqueue(const ResultAction& action);
  void sendResults();
  void reset();
};

class ServerContext {
private:
  ServerState serverState;
  ServerDispatchProcessor serverDispatchProcessor;
  ServerResult serverResult;

  net::Server netServer;

  static ServerContext globalServerContext;

public:
  ServerContext();

  static void init();
  static ServerContext& get();

  const ServerState& getState() const;
  ServerState& getStateMut();
  const ServerState& setState(const ServerState& state);

  ServerResult& getServerResult();
  net::Server& getNetServer();
  void update();
};

ServerContext& getSrvContext();
const ServerState& getSrvState();

namespace helpers {

unsigned int clientIdToIndex(ClientId clientId);

} // namespace helpers

namespace results {

void setConnected(ClientId clientId,
                  const std::string& playerId,
                  const std::string& playerName);
void setTalkUpdated(ClientId player, const In2State& in2State);

} // namespace results

} // namespace state
} // namespace snw