#pragma once

#include "game/actions.h"
#include "game/in2/in2.h"
#include "game/sharedState.h"
#include "lib/net/client.h"
#include <functional>

namespace snw {
namespace state {

enum SectionType { NONE, MENU_SPLASH, CONVERSATION };

struct SectionInfo {
  SectionType type = SectionType::NONE;
};

struct ClientState {
  ConnectedClient account;
  std::vector<ConnectedClient> otherAccounts;
  std::vector<SectionType> sections;
  In2State in2;
};

class ClientLoopbackProcessor {
private:
  std::vector<DispatchAction> actionsToCommit;
  std::unordered_map<DispatchActionType,
                     std::function<void(ClientState&, const DispatchAction&)>>
      handlers;

  void init();

public:
  ClientLoopbackProcessor();

  void enqueue(const DispatchAction& action);
  void process();
  void reset();
  void
  addHandler(DispatchActionType type,
             std::function<void(ClientState&, const DispatchAction&)> handler);
};

void logLoopbackDispatchAssertionError(DispatchActionType type,
                                       const std::string& msg);

class ClientResultProcessor {
private:
  std::vector<ResultAction> actionsToCommit;
  std::unordered_map<ResultActionType,
                     std::function<void(ClientState&, const ResultAction&)>>
      handlers;

  void init();

public:
  ClientResultProcessor();

  void enqueue(const ResultAction& action);
  void process();
  void reset();
  void
  addHandler(ResultActionType type,
             std::function<void(ClientState&, const ResultAction&)> handler);
};

void logClientResultAssertionError(ResultActionType type,
                                   const std::string& msg);

class ClientDispatch {
private:
  std::vector<DispatchAction> actionsToCommit;

public:
  void enqueue(const DispatchAction& action);
  void dispatch();
  void reset();
};

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
  ClientState& getStateMut();
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

namespace helpers {

bool isSectionVisible(const ClientState& state, SectionType type);
void setIn2StateAfterExecution(ClientState& state);
ClientId intToClientId(int clientIdInt);

} // namespace helpers

namespace dispatch {

void establishConnection(const std::string& playerName);
void startTalk(const std::string& talkName);
void continueTalk();
void chooseTalk(const int choiceIndex);
void endTalk();
void updateTalk(const In2State& in2State);

} // namespace dispatch

} // namespace state
} // namespace snw