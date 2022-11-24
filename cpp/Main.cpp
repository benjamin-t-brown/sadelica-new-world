#include "game/cliContext.h"
#include "game/in2/in2.h"
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

void setupWindow(SDL2Wrapper::Window& window) {
  SDL2Wrapper::Store::createFont("Chicago", "assets/Chicago.ttf");
  window.setCurrentFont("Chicago", 18);
  auto events = &window.getEvents();
  events->setEventHandler([](SDL_Event e) { ImGui_ImplSDL2_ProcessEvent(&e); });
}

void setupImgui(SDL2Wrapper::Window& window) {
  auto renderer = &window.getRenderer();
  auto sdlWindow = &window.getSDLWindow();
  IMGUI_CHECKVERSION();
  ImGui::CreateContext();
  ImGui_ImplSDL2_InitForSDLRenderer(sdlWindow, renderer);
  ImGui_ImplSDLRenderer_Init(renderer);
  ImGui::StyleColorsDark();
}

// NOLINTNEXTLINE(cppcoreguidelines-avoid-c-arrays)
int main(int argc, char* argv[]) {
  logger::info("Program Begin.");
  srand(time(NULL));
  snw::in2::init("");

  std::vector<std::string> args;
  utils::parseArgs(argc, argv, args);
  try {
    // SDL2Wrapper::Window window("Sadelica: NW", 720, 1280, 25, 50);
    // SDL2Wrapper::Window window("Sadelica: NW", 576, 1024, 25, 50);
    SDL2Wrapper::Window window("Sadelica: NW", 480, 854, 25, 50);
    setupWindow(window);
    setupImgui(window);
    auto uiInstance = ui::Ui();
    uiInstance.loadFonts();

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
