#include "Ui.h"
#include "components/InGameCmpt.h"
#include "components/TalkCmpt.h"
#include "lib/imgui/imgui_impl_sdl.h"
#include "lib/imgui/imgui_impl_sdlrenderer.h"
#include "lib/sdl2wrapper/Store.h"
#include "logger.h"
#include <SDL2/SDL.h>
#include <sstream>

namespace ui {

void setupWindow(SDL2Wrapper::Window& window) {
  SDL2Wrapper::Store::createFont("Chicago", "assets/Chicago.ttf");
  window.setCurrentFont("Chicago", 18);
  auto events = &window.getEvents();
  events->setEventHandler([](SDL_Event e) { ImGui_ImplSDL2_ProcessEvent(&e); });
}

void setupImgui(SDL2Wrapper::Window& window) {
  auto renderer = window.getRenderer();
  auto sdlWindow = window.getSDLWindow();
  ImGui::CreateContext();
  ImGui_ImplSDL2_InitForSDLRenderer(sdlWindow, renderer);
  ImGui_ImplSDLRenderer_Init(renderer);
  ImGui::StyleColorsDark();
}

void renderFrame(SDL2Wrapper::Window& window,
                 ui::Ui& uiInstance,
                 bool renderSdl,
                 std::function<void()> cb) {
  ImGui_ImplSDLRenderer_NewFrame();
  ImGui_ImplSDL2_NewFrame();
  ImGui::NewFrame();
  ImGui::PushFont(uiInstance.getFont("Chicago20"));
  window.setBackgroundColor(window.makeColor(10, 10, 10));
  window.setCurrentFont("Chicago", 20);
  cb();
  ImGui::PopFont();
  ImGui::Render();
  ImGui_ImplSDLRenderer_RenderDrawData(ImGui::GetDrawData());
  if (renderSdl) {
    SDL_RenderPresent(window.getRenderer());
  }
}

Ui::Ui() {}

void Ui::init(SDL2Wrapper::Window& window) {
  setupWindow(window);
  setupImgui(window);
  loadFonts();
}

void Ui::loadFonts() {
  ImGuiIO& io = ImGui::GetIO();
  const std::vector<float> fontSizes = {13, 16, 18, 20, 24, 40};

  const std::string fontName = "Chicago";
  for (const float fontSize : fontSizes) {
    const std::string key =
        fontName + std::to_string(static_cast<int>(fontSize));
    auto font = io.Fonts->AddFontFromFileTTF("assets/Chicago.ttf", fontSize);
    if (font == NULL) {
      throw std::runtime_error("Failed to load font: " + key);
    }
    logger::debug("Loaded font: %s", key.c_str());

    imguiFonts[key] = font;
  }
}

ImFont* Ui::getFont(const std::string& fontName) {
  auto fontItr = imguiFonts.find(fontName);
  if (fontItr != imguiFonts.end()) {
    return fontItr->second;
  }
  throw std::runtime_error("Could not getFont from ImGui (was it loaded?): " +
                           std::string(fontName));
}

SDL2Wrapper::Color imVec4ToSDL2WrapperColor(const ImVec4& c) {
  return SDL2Wrapper::Color{static_cast<uint8_t>(c.x * 255.),
                            static_cast<uint8_t>(c.y * 255.),
                            static_cast<uint8_t>(c.z * 255.),
                            static_cast<uint8_t>(c.w * 255.)};
}

ImVec2 getBoxBasedOnScreenPct(const float pctWidth, const float pctHeight) {
  auto outerWindowSize = ImGui::GetWindowSize();
  auto width = outerWindowSize.x * pctWidth;
  auto height = outerWindowSize.y * pctHeight;
  auto box = ImVec2(width, height);
  return box;
}

void prepareFullScreenWindow() {
#ifdef IMGUI_HAS_VIEWPORT
  ImGuiViewport* viewport = ImGui::GetMainViewport();
  ImGui::SetNextWindowPos(viewport->GetWorkPos());
  ImGui::SetNextWindowSize(viewport->GetWorkSize());
  ImGui::SetNextWindowViewport(viewport->ID);
#else
  ImGui::SetNextWindowPos(ImVec2(0.0f, 0.0f));
  ImGui::SetNextWindowSize(ImGui::GetIO().DisplaySize);
#endif
}

bool isKeyPressed(ImGuiKey key) {
  return ImGui::IsKeyPressed(ImGui::GetKeyIndex(key), false);
}

void Ui::render() {

  renderTalkCmpt(*this);
  // renderInGameCmpt(*this);
}

} // namespace ui