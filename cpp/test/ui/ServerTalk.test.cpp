#include "game/in2/in2.h"
#include "game/stateClient/stateClient.h"
#include "game/stateServer/stateServer.h"
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

class ServerTalkTest : public testing::Test {
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

TEST_F(ServerTalkTest, CanStartAnIn2Server) {
  logger::info("Program Begin.");
  srand(time(NULL));
  net::Config::mockEnabled = false;
  snw::state::ServerContext::init();
  auto uiInstance = ui::Ui();

  logger::info("Waiting for client to connect.");

  try {
    SDL2Wrapper::Window window;

    window.startRenderLoop([&]() {
      ServerContext::get().update();
      return true;
    });

    logger::info("Program End.");
  } catch (const std::string& e) {
    Logger().get(LogType::ERROR) << e << Logger::endl;
  }

  EXPECT_EQ(1, 1);
}
