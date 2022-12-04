#pragma once

#include "lib/imgui/imgui.h"
#include "lib/sdl2wrapper/Window.h"
#include <string>
#include <unordered_map>

using namespace ImGui;

// NOLINTNEXTLINE
#define PCT_BOX(w, h, color)                                                   \
  auto box = getBoxBasedOnScreenPct(w, h);                                     \
  static auto bgRectangle =                                                    \
      SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(            \
          box.x, box.y, imVec4ToSDL2WrapperColor(color));                      \
  ImGui::Image(bgRectangle, box);

#define COLOR_TRANSPARENT ImColor(255, 255, 255, 0);
#define COLOR_WHITE ImColor(255, 255, 255, 255);
#define COLOR_BLACK ImColor(0, 0, 0, 255);
#define COLOR_GREY ImColor(90, 83, 83, 255);
#define COLOR_LIGHT_GREY ImColor(188, 183, 197, 255);
#define COLOR_DARK_GREY ImColor(65, 60, 61, 255);
#define COLOR_BLUE ImColor(55, 202, 253, 255);
#define COLOR_DARK_BLUE ImColor(36, 63, 114, 255);
#define COLOR_CYAN ImColor(66, 202, 253, 255);
#define COLOR_DARK_CYAN ImColor(46, 55, 64, 255);
#define COLOR_PURPLE ImColor(67, 59, 85, 255);
#define COLOR_GREEN ImColor(0, 95, 27, 255);
#define COLOR_RED ImColor(255, 83, 74, 255);
#define COLOR_BROWN ImColor(122, 68, 74, 255);

namespace ui {
class Ui;

ImVec2 getBoxBasedOnScreenPct(const float pctWidth, const float pctHeight);
void prepareFullScreenWindow();
bool isKeyPressed(ImGuiKey key);
void renderFrame(SDL2Wrapper::Window& window,
                 ui::Ui& uiInstance,
                 bool renderSdl,
                 std::function<void()> cb);

SDL2Wrapper::Color imVec4ToSDL2WrapperColor(const ImVec4& c);

struct UiColors {
  ImVec4 TRANSPARENT = COLOR_TRANSPARENT;
  ImVec4 WHITE = COLOR_WHITE;
  ImVec4 BLACK = COLOR_BLACK;
  ImVec4 GREY = COLOR_GREY;
  ImVec4 LIGHT_GREY = COLOR_LIGHT_GREY;
  ImVec4 DARK_GREY = COLOR_DARK_GREY;
  ImVec4 BLUE = COLOR_BLUE;
  ImVec4 DARK_BLUE = COLOR_DARK_BLUE;
  ImVec4 CYAN = COLOR_CYAN;
  ImVec4 DARK_CYAN = COLOR_DARK_CYAN;
  ImVec4 PURPLE = COLOR_PURPLE;
  ImVec4 GREEN = COLOR_GREEN;
  ImVec4 RED = COLOR_RED;
  ImVec4 BROWN = COLOR_BROWN;
};

class Ui {
  // Track the loaded fonts here so they can be pushed/popped later
  // These fonts are owned by ImGui, so no need to clean them up
  std::unordered_map<std::string, ImFont*> imguiFonts;

public:
  UiColors colors;
  Ui();
  void init(SDL2Wrapper::Window& window);
  void loadFonts();
  ImFont* getFont(const std::string& fontName);
  void render();
};
} // namespace ui
