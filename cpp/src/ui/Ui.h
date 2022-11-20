#pragma once

#include "imgui/imgui.h"
#include "sdl2wrapper/SDL2Wrapper.h"
#include "string"

#define PCT_BOX(w, h, color)                                                   \
  auto box = getBoxBasedOnScreenPct(w, h);                                     \
  static auto bgRectangle = createStaticColorTexture(box.x, box.y, color);     \
  ImGui::Image(bgRectangle, box);

namespace ui {
void textCentered(const std::string& text);
ImVec2 getBoxBasedOnScreenPct(const float pctWidth, const float pctHeight);
void prepareFullScreenWindow();
SDL_Texture*
createStaticColorTexture(int width, int height, const ImVec4& color);

struct UiColors {
  ImVec4 TRANSPARENT = ImColor(255, 255, 255, 0);
  ImVec4 WHITE = ImColor(255, 255, 255, 0);
  ImVec4 BLACK = (ImVec4)ImColor(0, 0, 0, 255);
  ImVec4 GREY = (ImVec4)ImColor(90, 83, 83, 255);
  ImVec4 LIGHT_GREY = (ImVec4)ImColor(188, 183, 197, 255);
  ImVec4 DARK_GREY = (ImVec4)ImColor(65, 60, 61, 255);
  ImVec4 BLUE = (ImVec4)ImColor(55, 202, 253, 255);
  ImVec4 DARK_BLUE = (ImVec4)ImColor(36, 63, 114, 255);
  ImVec4 CYAN = (ImVec4)ImColor(66, 202, 253, 255);
  ImVec4 DARK_CYAN = (ImVec4)ImColor(46, 55, 64, 255);
  ImVec4 PURPLE = (ImVec4)ImColor(57, 49, 75, 255);
  ImVec4 GREEN = (ImVec4)ImColor(0, 95, 27, 255);
  ImVec4 RED = (ImVec4)ImColor(255, 83, 74, 255);
  ImVec4 BROWN = (ImVec4)ImColor(122, 68, 74, 255);
};

class Ui {
public:
  UiColors colors;
  Ui();
  void render();
};
} // namespace ui
