#include "./logger.h"
#include "game/in2/in2.h"
#include "game/stateClient/cliContext.h"
#include "lib/imgui/imgui.h"
#include "lib/imgui/imgui_impl_sdl.h"
#include "lib/imgui/imgui_impl_sdlrenderer.h"
#include "lib/sdl2wrapper/Events.h"
#include "lib/sdl2wrapper/Store.h"
#include "lib/sdl2wrapper/Window.h"
#include "ui/Ui.h"
#include "utils/utils.h"
#include <SDL2/SDL.h>

#if !SDL_VERSION_ATLEAST(2, 0, 17)
#error This backend requires SDL 2.0.17+ because of SDL_RenderGeometry() function
#endif
// ImGui_ImplSDL2_ProcessEvent(&e);
// Enable Keyboard Controls
// io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
// Enable Gamepad Controls
// io.ConfigFlags |= ImGuiConfigFlags_NavEnableGamepad;

// ImGui_ImplSDL2_NewFrame();
// io.Fonts->AddFontFromFileTTF("assets/Chicago.ttf", 24);
// ImGui::NewFrame();
// ImGui::Render();
// ImGui::PushFont(font1);

// NOLINTNEXTLINE(cppcoreguidelines-avoid-c-arrays)
int main(int argc, char* argv[]) {
  logger::info("Program Begin.");
  srand(time(NULL));
  IMGUI_CHECKVERSION();
  snw::in2::init("");

  std::vector<std::string> args;
  utils::parseArgs(argc, argv, args);
  try {
    // SDL2Wrapper::Window window("Sadelica: NW", 720, 1280, 25, 50);
    // SDL2Wrapper::Window window("Sadelica: NW", 576, 1024, 25, 50);
    SDL2Wrapper::Window window("Sadelica: NW", 480, 854, 25, 50);
    auto uiInstance = ui::Ui();
    uiInstance.init(window);

    window.startRenderLoop([&]() {
      ImGui_ImplSDLRenderer_NewFrame();
      ImGui_ImplSDL2_NewFrame();
      ImGui::NewFrame();
      window.setBackgroundColor(window.makeColor(10, 10, 10));
      window.setCurrentFont("Chicago", 20);
      ImGui::PushFont(uiInstance.getFont("Chicago20"));

      uiInstance.render();

      ImGui::ShowDemoWindow();

      ImGui::PopFont();
      ImGui::Render();
      ImGui_ImplSDLRenderer_RenderDrawData(ImGui::GetDrawData());
      return true;
    });

    logger::info("Program End.");
  } catch (const std::string& e) {
    Logger(LogType::ERROR) << e << Logger::endl;
  }

  ImGui_ImplSDLRenderer_Shutdown();
  ImGui_ImplSDL2_Shutdown();
  ImGui::DestroyContext();

  return 0;
}
