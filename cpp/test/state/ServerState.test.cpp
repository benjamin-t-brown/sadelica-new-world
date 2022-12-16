#include "game/in2/in2.h"
#include "game/stateClient/dispatch.h"
#include "game/stateClient/stateClient.h"
#include "game/stateServer/stateServer.h"
#include "logger.h"
#include <fstream>
#include <gtest/gtest.h>

using namespace snw;
using namespace snw::state;
using ClientContext = snw::state::ClientContext;
using ServerContext = snw::state::ServerContext;

class ServerStateTest : public testing::Test {
protected:
  static void SetUpTestSuite() {
    Logger::disabled = true;
    in2::init(readIn2CompiledSrcMock());
    ClientContext::init();
  }
  static void TearDownTestSuite() { Logger::disabled = true; }
  void SetUp() override {
    ClientContext::get().setState(ClientState());
    ServerContext::get().setState(ServerState());
  }
  void TearDown() override {}

  static std::string readIn2CompiledSrcMock() {
    const std::string path = "test/in2/main.compiled.mock.js";
    Logger().get(LogType::DEBUG)
        << "Reading in2 compiled src from " << path << Logger::endl;
    const std::ifstream src(path);

    std::stringstream buffer;
    buffer << src.rdbuf();
    return buffer.str();
  }
};

TEST_F(ServerStateTest, ProperlyHandlesConnectionRequests) {
  dispatch::establishConnection("testPlayer1");

  ClientContext::get().update();
  ClientContext::get().update();
  EXPECT_EQ(getCliState().client.playerName, "testPlayer1");
  EXPECT_EQ(getCliState().client.isConnected, false);
  EXPECT_NE(getCliState().client.playerId, "");

  ServerContext::get().update();
  ServerContext::get().update();
  EXPECT_EQ(getSrvState().clients[0].playerName, "testPlayer1");
  EXPECT_EQ(getSrvState().clients[0].playerId, getCliState().client.playerId);
  EXPECT_EQ(getSrvState().clients[0].isConnected, true);

  ClientContext::get().update();
  EXPECT_EQ(getCliState().client.playerName, "testPlayer1");
  EXPECT_EQ(getCliState().client.clientId, ClientId::PLAYER1);
  EXPECT_EQ(getCliState().client.isConnected, true);
  EXPECT_NE(getCliState().client.playerId, "");
}

TEST_F(ServerStateTest, CanHandleReconnection) {
  auto update = []() {
    ClientContext::get().update();
    ServerContext::get().update();
    ClientContext::get().update();
    ServerContext::get().update();
    ClientContext::get().update();
    ServerContext::get().update();
  };

  dispatch::establishConnection("testPlayer1");
  update();
  EXPECT_TRUE(getSrvState().clients[0].isConnected);
  EXPECT_TRUE(getCliState().client.isConnected);
  EXPECT_EQ(getCliState().client.clientId, ClientId::PLAYER1);

  dispatch::unEstablishConnection();
  update();
  EXPECT_FALSE(getSrvState().clients[0].isConnected);
  EXPECT_FALSE(getCliState().client.isConnected);

  dispatch::establishConnection("testPlayer1");
  update();
  EXPECT_TRUE(getSrvState().clients[0].isConnected);
  EXPECT_TRUE(getCliState().client.isConnected);
  EXPECT_EQ(getCliState().client.clientId, ClientId::PLAYER1);
}

TEST_F(ServerStateTest, ProperlySendsTalkMessagesToServer) {
  // a startTalk should update the server state to indicate who is talking
  dispatch::startTalk("main1");
  ClientContext::get().update();
  ServerContext::get().update();
  EXPECT_EQ(getCliState().in2.conversationText, "The value of test is value.");
  EXPECT_EQ(getSrvState().in2States[0].conversationText, "");
  EXPECT_EQ(getSrvState().in2States[0].chName, "main1");

  // after the next update, the client should have sent a TALK_UPDATE which sets
  // the talk state of the server
  ClientContext::get().update();
  ServerContext::get().update();
  EXPECT_EQ(getSrvState().in2States[0].conversationText,
            "The value of test is value.");

  // continuing a talk should dispatch an update to ther server.
  // 2 updates because the client sends the TALK_UPDATE during the first
  // dispatch.
  dispatch::continueTalk();
  ClientContext::get().update();
  ServerContext::get().update();
  ClientContext::get().update();
  ServerContext::get().update();
  EXPECT_EQ(getCliState().in2.conversationText,
            "The value of test is value.\n\nThis node currently has no actual "
            "content.");
  EXPECT_EQ(getSrvState().in2States[0].conversationText,
            "The value of test is value.\n\nThis node currently has no actual "
            "content.");

  // Ending the talk should make the talk end in the server state as well.
  dispatch::endTalk();
  ClientContext::get().update();
  ServerContext::get().update();
  EXPECT_FALSE(getCliContext().getIn2Ctx().isExecutionActive());
  EXPECT_EQ(getCliState().in2.waitingState, In2WaitingState::IN2_NONE);
  EXPECT_EQ(getSrvState().in2States[0].waitingState, In2WaitingState::IN2_NONE);
}
