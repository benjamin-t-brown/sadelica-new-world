// #include <ctime>
// #include <functional>
// #include <iostream>
// #include <vector>

#include "sdl2wrapper/SDL2Wrapper.h"

#include "imgui/imgui.h"
#include "imgui/imgui_impl_sdl.h"
#include "imgui/imgui_sdl.h"

#include "ui/Ui.h"

void parseArgs(int argc, char* argv[], std::vector<std::string>& args) {
  for (int i = 0; i < argc; i++) {
    std::string arg = argv[i];
    if (arg.size() > 2 && arg.at(0) == '-' && arg.at(1) == '-') {
      arg = arg.substr(2);
      args.push_back(arg);
    }
  }
}

bool includes(const std::string& arg, const std::vector<std::string>& args) {
  if (std::find(args.begin(), args.end(), arg) != args.end()) {
    return true;
  } else {
    return false;
  }
}

SDL_Texture* createStaticColorTexture(
    int width, int height, Uint8 r, Uint8 g, Uint8 b, Uint8 a = 255) {
  SDL2Wrapper::Window& window = SDL2Wrapper::Window::getGlobalWindow();
  auto renderer = &window.getRenderer();
  SDL_Texture* texture = SDL_CreateTexture(renderer,
                                           SDL_PIXELFORMAT_RGBA32,
                                           SDL_TEXTUREACCESS_TARGET,
                                           width,
                                           height);

  SDL_SetRenderTarget(renderer, texture);
  SDL_SetRenderDrawColor(renderer, r, g, b, a);
  SDL_RenderClear(renderer);
  SDL_SetRenderTarget(renderer, nullptr);

  return texture;
}

int main(int argc, char* argv[]) {
  SDL2Wrapper::Logger() << "Program Begin." << std::endl;
  srand(time(NULL));

  std::vector<std::string> args;
  parseArgs(argc, argv, args);
  try {
    SDL2Wrapper::Window window("Sadelica: NW", 720, 1280, 25, 50);
    // SDL2Wrapper::Window window("Sadelica: NW", 576, 1024, 25, 50);
    // SDL2Wrapper::Window window("Sadelica: NW", 480, 854, 25, 50);
    SDL2Wrapper::Store::createFont("default", "assets/Chicago.ttf");
    window.setCurrentFont("default", 18);

    auto renderer = &window.getRenderer();
    auto sdlWindow = &window.getSDLWindow();

    ImGui::CreateContext();
    ImGuiSDL::Initialize(renderer, window.width, window.height);
    ImGui_ImplSDL2_InitForSDLRenderer(sdlWindow, renderer);

    ImGuiIO& io = ImGui::GetIO();
    // Enable Keyboard Controls
    // io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
    // Enable Gamepad Controls
    // io.ConfigFlags |= ImGuiConfigFlags_NavEnableGamepad;

    // ImGui_ImplSDL2_NewFrame();
    // io.Fonts->AddFontFromFileTTF("assets/Chicago.ttf", 24);
    // ImGui::NewFrame();
    // ImGui::Render();

    // ImGui::PushFont(font1);

    ui::Ui ui = ui::Ui();

    window.startRenderLoop([&]() {
      window.setBackgroundColor(window.makeColor(10, 10, 10));

      ImGuiIO& io = ImGui::GetIO();

      window.setCurrentFont("default", 24);
      window.drawTextCentered(
          "Hello there.", 256, 256, window.makeColor(255, 255, 255));

      ImGui_ImplSDL2_NewFrame();
      ImGui::NewFrame();

      ui.render();

      ImGui::ShowDemoWindow();

      ImGui::Render();
      ImGuiSDL::Render(ImGui::GetDrawData());

      return true;
    });

    SDL2Wrapper::Logger() << "Program End." << std::endl;
  } catch (const std::string& e) {
    SDL2Wrapper::Logger(SDL2Wrapper::ERROR) << e << std::endl;
  }

  ImGui_ImplSDL2_Shutdown();
  ImGui::DestroyContext();

  return 0;
}
