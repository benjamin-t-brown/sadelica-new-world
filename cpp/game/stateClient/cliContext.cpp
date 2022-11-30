#include "cliContext.h"
#include "game/dispatchAction.h"
#include "game/resultAction.h"
#include "lib/json/json.h"
#include "logger.h"

using json = nlohmann::json;

namespace snw {
namespace state {

constexpr int CONNECT_PORT = 7777;
constexpr char* CONNECT_URL = "127.0.0.1";

ClientContext ClientContext::globalClientContext = ClientContext();

ClientContext::ClientContext()
    : clientState(ClientState()),
      clientDispatch(ClientDispatch()),
      clientResultProcessor(ClientResultProcessor()),
      clientLoopbackProcessor(ClientLoopbackProcessor()) {}
void ClientContext::init() {
#ifndef NET_ENABLED
  logger::info("CLI using mock net.");
#endif
  logger::info("CLI attempting to connect to %s:%i", CONNECT_URL, CONNECT_PORT);
  ClientContext::get().getNetClient().connect(CONNECT_URL, CONNECT_PORT);
  logger::info("CLI now connected.");
}
ClientContext& ClientContext::get() { return globalClientContext; }
const ClientState& ClientContext::getState() const { return clientState; }
const ClientState& ClientContext::setState(const ClientState& s) {
  clientState = ClientState(s);

  auto s2 = ClientContext::get().getState();

  return clientState;
}
ClientDispatch& ClientContext::getDispatch() { return clientDispatch; }
ClientResultProcessor& ClientContext::getResultProcessor() {
  return clientResultProcessor;
}
ClientLoopbackProcessor& ClientContext::getLoopbackProcessor() {
  return clientLoopbackProcessor;
}

net::Client& ClientContext::getNetClient() { return netClient; }

snw::in2::In2Context& ClientContext::getIn2Ctx() { return in2Ctx; }

void ClientContext::update() {
  clientDispatch.dispatch();
  clientDispatch.reset();
  clientLoopbackProcessor.process();
  clientLoopbackProcessor.reset();
  clientResultProcessor.process();
  clientResultProcessor.reset();

  netClient.update([](const std::string& msg) {
    logger::info("CLI Recvd message from server %s", msg.c_str());
  });
}

ClientContext& getCliContext() { return ClientContext::get(); }
const ClientState& getCliState() { return ClientContext::get().getState(); }

const ClientId getClientId() { return getCliState().account.id; }

} // namespace state
} // namespace snw