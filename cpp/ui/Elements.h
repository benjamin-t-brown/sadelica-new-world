#pragma once

#include "Ui.h"
#include <functional>
#include <string>

namespace ui {
namespace elements {

struct ButtonProps {
  std::string label = "Button";
  ImVec4 textColor = COLOR_WHITE;
  ImVec4 bgColor = COLOR_DARK_CYAN;
  ImVec4 bgColorHover = COLOR_BLACK;
  ImVec4 bgColorActive = COLOR_DARK_GREY;
  ImVec2 size = {80, 32};
  std::function<void()> onClick = []() {};
  std::vector<ImGuiKey> keyboardShortcuts = {};
};
void Button(const ButtonProps& props);

} // namespace elements
} // namespace ui