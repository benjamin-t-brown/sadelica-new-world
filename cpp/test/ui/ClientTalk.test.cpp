#include "game/in2/in2.h"
#include "game/stateClient/cliContext.h"
#include "game/stateServer/srvContext.h"
#include "lib/imgui/imgui.h"
#include "lib/imgui/imgui_impl_sdl.h"
#include "lib/imgui/imgui_impl_sdlrenderer.h"
#include "lib/net/config.h"
#include "lib/sdl2wrapper/Events.h"
#include "lib/sdl2wrapper/Store.h"
#include "lib/sdl2wrapper/Window.h"
#include "logger.h"
#include "ui/Ui.h"
#include "ui/components/TalkCmpt.h"
#include "utils/utils.h"
#include <SDL2/SDL.h>
#include <fstream>
#include <gtest/gtest.h>

using namespace snw;
using namespace snw::state;
using ClientContext = snw::state::ClientContext;

class ClientTalkTest : public testing::Test {
protected:
  static const bool loggingEnabled = true;
  static void SetUpTestSuite() {
    Logger::disabled = !loggingEnabled;
    net::Config::mockEnabled = false;
  }
  static void TearDownTestSuite() { net::Config::mockEnabled = true; }
  void SetUp() override { Logger::disabled = !loggingEnabled; }
  void TearDown() override {}
};

TEST_F(ClientTalkTest, CanDisplayAConversation) {
  logger::info("Program Begin.");
  srand(time(NULL));
  snw::state::ClientContext::init();
  snw::in2::init("");
  auto uiInstance = ui::Ui();
  net::Config::mockEnabled = false;

  try {
    SDL2Wrapper::Window window("ClientTalkTest", 480, 854, 25, 50);

    uiInstance.init(window);

    dispatch::establishConnection("Player1");

    window.startRenderLoop([&]() {
      ImGui_ImplSDLRenderer_NewFrame();
      ImGui_ImplSDL2_NewFrame();
      ImGui::NewFrame();
      window.setBackgroundColor(window.makeColor(10, 10, 10));
      window.setCurrentFont("Chicago", 20);
      ImGui::PushFont(uiInstance.getFont("Chicago20"));

      ClientContext::get().update();

      ImGui::ShowDemoWindow();

      ImGui::PopFont();
      ImGui::Render();
      ImGui_ImplSDLRenderer_RenderDrawData(ImGui::GetDrawData());

      return true;
    });

    logger::info("Program End.");
  } catch (const std::string& e) {
    Logger().get(LogType::ERROR) << e << Logger::endl;
  }

  ImGui_ImplSDLRenderer_Shutdown();
  ImGui_ImplSDL2_Shutdown();
  ImGui::DestroyContext();

  EXPECT_EQ(1, 1);
}
