#include "game/in2/in2.h"
#include "logger.h"
#include <fstream>
#include <gtest/gtest.h>

using namespace snw;

class In2Test : public testing::Test {
protected:
  // before all
  static void SetUpTestSuite() {
    Logger::disabled = true;
    in2::init(readIn2CompiledSrcMock());
  }
  // after all
  static void TearDownTestSuite() {}

  // before each
  void SetUp() override { Logger::disabled = true; }

  // after each
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

TEST_F(In2Test, CanBeConstructed) {
  auto ctx = in2::In2Context();

  EXPECT_GT(ctx.id, -1);
}

TEST_F(In2Test, CanExecuteABasicFileWithoutAnyChoices) {
  auto in2Ctx = in2::In2Context();
  in2Ctx.createNewCtx();
  in2Ctx.executeFile("main1");
  EXPECT_EQ(in2Ctx.waitingForResume, true);
  EXPECT_EQ(in2Ctx.getLines()[0], "The value of test is value.");
  in2Ctx.resumeExecution();
  EXPECT_EQ(in2Ctx.waitingForResume, true);
  in2Ctx.resumeExecution();
  EXPECT_EQ(in2Ctx.waitingForResume, false);
  EXPECT_EQ(in2Ctx.executionCompleted, true);
}

TEST_F(In2Test, CanExecuteABasicFileWithChoices) {
  auto in2Ctx = in2::In2Context();
  in2Ctx.createNewCtx();
  in2Ctx.setStorage("CHECK_CHOICES", "true");
  in2Ctx.executeFile("main1");
  in2Ctx.resumeExecution();
  in2Ctx.resumeExecution();
  EXPECT_EQ(in2Ctx.waitingForChoice, true);
  in2Ctx.chooseExecution("ghrlz0lnr");
  EXPECT_EQ(in2Ctx.getLines().back(), "You picked choice 1.");
  in2Ctx.resumeExecution();
  EXPECT_EQ(in2Ctx.waitingForResume, false);
  EXPECT_EQ(in2Ctx.waitingForChoice, false);
  EXPECT_EQ(in2Ctx.executionCompleted, true);
}

TEST_F(In2Test, ProperlyErrorsWhenAnInvalidFilenameIsGiven) {
  auto in2Ctx = in2::In2Context();
  in2Ctx.createNewCtx();
  in2Ctx.executeFile("nonExistantFile");
  EXPECT_TRUE(in2Ctx.executionErrored);
}
