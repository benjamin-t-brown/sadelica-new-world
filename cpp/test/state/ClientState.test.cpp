#include "game/in2/in2.h"
#include "game/stateClient/cliContext.h"
#include "game/stateClient/cliState.h"
#include "logger.h"
#include <fstream>
#include <gtest/gtest.h>

using namespace snw;
using namespace snw::state;
using ClientContext = snw::state::ClientContext;

class ClientStateTest : public testing::Test {
protected:
  static void SetUpTestSuite() {
    in2::init(readIn2CompiledSrcMock());
    ClientContext::init();
  }
  static void TearDownTestSuite() {}
  void SetUp() override {
    Logger::disabled = true;
    ClientContext::get().setState(ClientState());
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

  static const ClientState& getState() {
    return ClientContext::get().getState();
  }
};

TEST_F(ClientStateTest, CanStartContinueAndStopAConversation) {
  // a startTalk should show the first line of text in the conversation
  EXPECT_EQ(getState().in2.conversationText, "");
  dispatch::startTalk("main1");
  ClientContext::get().update();
  EXPECT_EQ(getState().in2.conversationText, "The value of test is value.");
  EXPECT_TRUE(helpers::isSectionVisible(getState(), SectionType::CONVERSATION));

  // // a blank update shouldn't change the in2 state
  // ClientContext::get().update();
  // EXPECT_EQ(getState().in2.conversationText, "The value of test is value.");

  // // continuing the talk should change the text
  // dispatch::continueTalk();
  // ClientContext::get().update();
  // EXPECT_EQ(getState().in2.conversationText,
  //           "The value of test is value.\n\nThis node currently has no actual
  //           " "content.");
  // EXPECT_TRUE(helpers::isSectionVisible(getState(),
  // SectionType::CONVERSATION));

  // // ending a conversation should remove it from the sections
  // dispatch::continueTalk();
  // dispatch::endTalk();
  // ClientContext::get().update();
  // EXPECT_FALSE(
  //     helpers::isSectionVisible(getState(), SectionType::CONVERSATION));
  // EXPECT_EQ(getState().in2.waitingState, In2WaitingState::IN2_NONE);
  // EXPECT_FALSE(getCliContext().getIn2Ctx().isExecutionActive());
}
