#include "game/in2/in2.h"
#include "game/stateClient/dispatch.h"
#include "game/stateClient/stateClient.h"
#include "game/stateServer/stateServer.h"
#include "lib/imgui/imgui.h"
#include "lib/imgui/imgui_impl_sdl.h"
#include "lib/imgui/imgui_impl_sdlrenderer.h"
#include "lib/net/config.h"
#include "lib/sdl2wrapper/Events.h"
#include "lib/sdl2wrapper/Gauge.h"
#include "lib/sdl2wrapper/Store.h"
#include "lib/sdl2wrapper/Window.h"
#include "logger.h"
#include "ui/Elements.h"
#include "ui/Ui.h"
#include "ui/components/TalkCmpt.h"
#include "utils/utils.h"
#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
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

  void handshakeConnection(SDL2Wrapper::Window& window, ui::Ui& uiInstance) {
    dispatch::establishConnection(utils::getRandomId());
    SDL2Wrapper::Gauge connectionGauge = SDL2Wrapper::Gauge(3000);
    // wait for connection
    window.startRenderLoop([&]() {
      bool looping = true;
      ui::renderFrame(window, uiInstance, true, [&]() {
        snw::state::getCliContext().update();
        renderPreConnectionScreen(uiInstance);
        connectionGauge.fill(window.getDeltaTime());
        if (connectionGauge.isFull()) {
          looping = false;
        }
      });

      if (snw::state::getCliState().client.isConnected) {
        looping = false;
      }

      return looping;
    });
  }

  void renderPreConnectionScreen(ui::Ui& ui) {
    const ImGuiWindowFlags windowFlags =
        ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoScrollbar |
        ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize |
        ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoBringToFrontOnFocus;

    ui::prepareFullScreenWindow();
    const ImGuiIO& io = ImGui::GetIO();

    ImGui::PushFont(ui.getFont("Chicago20"));
    ImGui::PushStyleVar(ImGuiStyleVar_WindowRounding, 0.0f);
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0, 0));
    ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(0, 0));
    ImGui::Begin("ui", NULL, windowFlags);

    auto outerWindowSize = ImGui::GetWindowSize();
    const float width = outerWindowSize.x;
    const float height = outerWindowSize.y;

    static auto rectangle =
        SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(
            static_cast<int>(width),
            static_cast<int>(height),
            ui::imVec4ToSDL2WrapperColor(ui.colors.DARK_GREY));

    ImGui::SetCursorPos(ImVec2(0, 0));
    ImGui::Image(rectangle, ImVec2(width, height));

    ImGui::SetCursorPos(ImVec2(0, height / 2));
    ui::elements::TextCentered("Connecting...");

    ImGui::End();
    ImGui::PopStyleVar(3);
    ImGui::PopFont();
  }

  void renderDialogChoiceScreen(ui::Ui& ui) {
    const ImGuiWindowFlags windowFlags =
        ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoScrollbar |
        ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize |
        ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoBringToFrontOnFocus;

    ui::prepareFullScreenWindow();
    const ImGuiIO& io = ImGui::GetIO();

    ImGui::PushFont(ui.getFont("Chicago20"));
    ImGui::PushStyleVar(ImGuiStyleVar_WindowRounding, 0.0f);
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0, 0));
    ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(0, 0));
    ImGui::Begin("ui", NULL, windowFlags);

    auto outerWindowSize = ImGui::GetWindowSize();
    const float width = outerWindowSize.x;
    const float height = outerWindowSize.y;

    static auto rectangle =
        SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(
            static_cast<int>(width),
            static_cast<int>(height),
            ui::imVec4ToSDL2WrapperColor(ui.colors.DARK_GREY));

    ImGui::SetCursorPos(ImVec2(0, 0));
    ImGui::Image(rectangle, ImVec2(width, height));

    const float spacing = 8.f;
    ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding,
                        ImVec2(spacing / 2.f, spacing / 2.f));
    ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing,
                        ImVec2(spacing / 2.f, spacing / 2.f));

    ImGui::SetCursorPos(ImVec2(0, height * 0.1f));
    ui::elements::TextCentered("Select Option");

    ImGui::SetCursorPos(ImVec2(spacing / 2.f, height * 0.2f));
    const std::vector<std::string> fileNames = {"main", "CPP_Test"};
    for (const std::string& fileName : fileNames) {
      ImGui::SetCursorPosX(spacing / 2.f);
      ui::elements::ButtonProps p;
      p.label = fileName;
      p.textColor = ui.colors.BLACK;
      p.bgColor = ui.colors.LIGHT_GREY;
      p.bgColorActive = ui.colors.DARK_GREY;
      p.bgColorHover = ui.colors.GREY;
      p.size = ImVec2(width - spacing, 24.f);
      p.onClick = [&]() { snw::state::dispatch::startTalk(fileName); };
      ui::elements::Button(p);
      ImGui::Spacing();
    }

    ImGui::PopStyleVar(2);

    ImGui::End();
    ImGui::PopStyleVar(3);
    ImGui::PopFont();
  }
};

TEST_F(ClientTalkTest, CanDisplayAConversation) {
  logger::info("Program Begin.");
  srand(time(NULL));
  net::Config::mockEnabled = false;

  auto uiInstance = ui::Ui();
  SDL2Wrapper::Window window("ClientTalkTest", 480, 854, 25, 50);
  uiInstance.init(window);

  ui::renderFrame(window, uiInstance, true, [&]() {
    renderPreConnectionScreen(uiInstance);
  });

  snw::in2::init("");

  // this blocks execution until UDP socket is established.
  snw::state::ClientContext::init();

  logger::info("Socket connection created, initiating handshake...");
  handshakeConnection(window, uiInstance);

  if (!snw::state::getCliState().client.isConnected) {
    logger::error("Could not establish connection to server.");
  }
  EXPECT_TRUE(snw::state::getCliState().client.isConnected);

  logger::info("Completed connection handshake.");

  try {
    window.startRenderLoop([&]() {
      bool looping = true;

      ui::renderFrame(window, uiInstance, false, [&]() {
        ClientContext::get().update();
        if (helpers::isSectionVisible(getCliState(),
                                      SectionType::CONVERSATION)) {
          renderTalkCmpt(uiInstance);
        } else {
          renderDialogChoiceScreen(uiInstance);
        }
      });

      if (!snw::state::getCliState().client.isConnected) {
        looping = false;
      }

      return true;
    });

    logger::info("Program End.");
  } catch (const std::string& e) {
    Logger().get(LogType::ERROR) << e << Logger::endl;
  }

  logger::info("Ending connection.");
  dispatch::unEstablishConnection();
  snw::state::getCliContext().update();
  snw::state::getCliContext().update();

  ImGui_ImplSDLRenderer_Shutdown();
  ImGui_ImplSDL2_Shutdown();
  ImGui::DestroyContext();

  EXPECT_EQ(1, 1);
}
