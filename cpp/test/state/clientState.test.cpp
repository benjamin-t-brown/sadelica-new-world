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
    Logger::disabled = true;
    in2::init(readIn2CompiledSrcMock());
    ClientContext::init();
  }
  static void TearDownTestSuite() {}
  void SetUp() override { Logger::disabled = true; }
  void TearDown() override {}

  static std::string readIn2CompiledSrcMock() {
    const std::string path = "test/in2/main.compiled.mock.js";
    Logger(LogType::DEBUG) << "Reading in2 compiled src from " << path
                           << Logger::endl;
    const std::ifstream src(path);

    std::stringstream buffer;
    buffer << src.rdbuf();
    return buffer.str();
  }
};

namespace ClientStateTestHelpers {
const ClientState& getState() { return ClientContext::get().getState(); }
} // namespace ClientStateTestHelpers

using namespace ClientStateTestHelpers;

TEST_F(ClientStateTest, CanStartContinueAndStopAConversation) {
  dispatch::startTalk("main1");
  ClientContext::get().update();
  EXPECT_EQ(getState().in2.conversationText, "The value of test is value.");

  ClientContext::get().update();
  EXPECT_TRUE(helpers::isSectionVisible(getState(), SectionType::CONVERSATION));
  EXPECT_NE(getState().in2.in2Ctx, nullptr);
  EXPECT_EQ(ClientContext::get().getDispatch().getPayloadPtrs().size(), 0);

  dispatch::continueTalk();
  dispatch::endTalk();
  ClientContext::get().update();

  EXPECT_FALSE(
      helpers::isSectionVisible(getState(), SectionType::CONVERSATION));
  EXPECT_EQ(getState().in2.in2Ctx, nullptr);
  EXPECT_EQ(ClientContext::get().getDispatch().getPayloadPtrs().size(), 0);
}
