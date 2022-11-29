#include "cliContext.h"
#include "lib/json/json.h"
#include "logger.h"

using json = nlohmann::json;

namespace snw {
namespace state {

ClientContext ClientContext::globalClientContext = ClientContext();

ClientContext::ClientContext()
    : clientState(ClientState()),
      clientDispatch(ClientDispatch()),
      clientResultProcessor(ClientResultProcessor()),
      clientLoopbackProcessor(ClientLoopbackProcessor()) {}
void ClientContext::init() {}
ClientContext& ClientContext::get() { return globalClientContext; }
const ClientState& ClientContext::getState() const { return clientState; }
ClientState& ClientContext::getStateMut() { return clientState; }
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

void ClientContext::update() {
  auto payloadPtrs = clientDispatch.getPayloadPtrs();

  clientDispatch.dispatch();
  clientDispatch.reset();
  clientLoopbackProcessor.process();
  clientLoopbackProcessor.reset();
  clientResultProcessor.process();
  clientResultProcessor.reset();

  netClient.update([](const std::string& msg){
    logger::info("Recvd message from server %s", msg.c_str());
  });

  for (auto it : payloadPtrs) {
    // NOLINTNEXTLINE
    auto j = reinterpret_cast<json*>(it);
    // NOLINTNEXTLINE
    delete j;
  }
}

ClientContext& getCliContext() { return ClientContext::get(); }
const ClientState& getCliState() { return ClientContext::get().getState(); }

} // namespace state
} // namespace snw