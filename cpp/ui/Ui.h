#pragma once

#include "lib/imgui/imgui.h"
#include "lib/sdl2wrapper/Window.h"
#include <string>

using namespace ImGui;

// NOLINTNEXTLINE
#define PCT_BOX(w, h, color)                                                   \
  auto box = getBoxBasedOnScreenPct(w, h);                                     \
  static auto bgRectangle =                                                    \
      SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(            \
          box.x, box.y, imVec4ToSDL2WrapperColor(color));                      \
  ImGui::Image(bgRectangle, box);

// constexpr auto PCT_BOX(double w, double h, const ImColor& color) {
//   auto box = getBoxBasedOnScreenPct(w, h);
//   static auto bgRectangle = createStaticColorTexture(box.x, box.y, color);
//   ImGui::Image(bgRectangle, box);
// }

namespace ui {
void textCentered(const std::string& text);
ImVec2 getBoxBasedOnScreenPct(const float pctWidth, const float pctHeight);
void prepareFullScreenWindow();

SDL2Wrapper::Color imVec4ToSDL2WrapperColor(const ImVec4& c);
// SDL_Color

struct UiColors {
  ImVec4 TRANSPARENT = ImColor(255, 255, 255, 0);
  ImVec4 WHITE = ImColor(255, 255, 255, 0);
  ImVec4 BLACK = ImColor(0, 0, 0, 255);
  ImVec4 GREY = ImColor(90, 83, 83, 255);
  ImVec4 LIGHT_GREY = ImColor(188, 183, 197, 255);
  ImVec4 DARK_GREY = ImColor(65, 60, 61, 255);
  ImVec4 BLUE = ImColor(55, 202, 253, 255);
  ImVec4 DARK_BLUE = ImColor(36, 63, 114, 255);
  ImVec4 CYAN = ImColor(66, 202, 253, 255);
  ImVec4 DARK_CYAN = ImColor(46, 55, 64, 255);
  ImVec4 PURPLE = ImColor(57, 49, 75, 255);
  ImVec4 GREEN = ImColor(0, 95, 27, 255);
  ImVec4 RED = ImColor(255, 83, 74, 255);
  ImVec4 BROWN = ImColor(122, 68, 74, 255);
};

class Ui {
public:
  UiColors colors;
  Ui();
  void render();
};
} // namespace ui
