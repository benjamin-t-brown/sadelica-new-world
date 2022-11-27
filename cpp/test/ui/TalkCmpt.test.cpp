#include "ui/components/TalkCmpt.h"
#include "game/in2/in2.h"
#include "game/stateClient/cliContext.h"
#include "lib/imgui/imgui.h"
#include "lib/imgui/imgui_impl_sdl.h"
#include "lib/imgui/imgui_impl_sdlrenderer.h"
#include "lib/sdl2wrapper/Events.h"
#include "lib/sdl2wrapper/Store.h"
#include "lib/sdl2wrapper/Window.h"
#include "logger.h"
#include "ui/Ui.h"
#include "utils/utils.h"
#include <SDL2/SDL.h>
#include <fstream>
#include <gtest/gtest.h>

using namespace snw;
using namespace snw::state;
using ClientContext = snw::state::ClientContext;

class TalkCmptTest : public testing::Test {
protected:
  static const bool loggingEnabled = true;
  static void SetUpTestSuite() {
    Logger::disabled = !loggingEnabled;
    in2::init("");
    ClientContext::init();
  }
  static void TearDownTestSuite() {}
  void SetUp() override { Logger::disabled = !loggingEnabled; }
  void TearDown() override {}

  static const ClientState& getState() {
    return ClientContext::get().getState();
  }
};

TEST_F(TalkCmptTest, CanDisplayAConversation) {
  logger::info("Program Begin.");
  srand(time(NULL));
  snw::in2::init("");
  try {
    SDL2Wrapper::Window window("TestTalkCmpt", 480, 854, 25, 50);
    auto uiInstance = ui::Ui();
    uiInstance.init(window);

    dispatch::startTalk("CPP_Test");

    window.startRenderLoop([&]() {
      ImGui_ImplSDLRenderer_NewFrame();
      ImGui_ImplSDL2_NewFrame();
      ImGui::NewFrame();
      window.setBackgroundColor(window.makeColor(10, 10, 10));
      window.setCurrentFont("Chicago", 20);
      ImGui::PushFont(uiInstance.getFont("Chicago20"));

      ClientContext::get().update();
      renderTalkCmpt(uiInstance);

      ImGui::PopFont();
      ImGui::Render();
      ImGui_ImplSDLRenderer_RenderDrawData(ImGui::GetDrawData());

      if (getState().in2.in2Ctx->isExecutionCompleted) {
        return false;
      }

      return true;
    });

    logger::info("Program End.");
  } catch (const std::string& e) {
    Logger(LogType::ERROR) << e << Logger::endl;
  }

  ImGui_ImplSDLRenderer_Shutdown();
  ImGui_ImplSDL2_Shutdown();
  ImGui::DestroyContext();

  EXPECT_EQ(1, 1);
}

int main(int argc, char** argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
