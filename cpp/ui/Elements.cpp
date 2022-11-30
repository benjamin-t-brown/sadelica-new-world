#include "Elements.h"

namespace ui {
namespace elements {

void Button(const ButtonProps& props) {
  ImGui::PushStyleColor(ImGuiCol_Button, props.bgColor);
  ImGui::PushStyleColor(ImGuiCol_Text, props.textColor);
  ImGui::PushStyleColor(ImGuiCol_ButtonHovered, props.bgColorHover);
  ImGui::PushStyleColor(ImGuiCol_ButtonActive, props.bgColorActive);

  auto textSize =
      ImGui::CalcTextSize(props.label.c_str(), NULL, false, props.size.x);

  bool isKeyboardShortcutPressed = false;
  for (const auto& key : props.keyboardShortcuts) {
    if (isKeyPressed(key)) {
      isKeyboardShortcutPressed = true;
      break;
    }
  }

  if (ImGui::Button(props.label.c_str(),
                    ImVec2(props.size.x, props.size.y + textSize.y)) ||
      isKeyboardShortcutPressed) {
    props.onClick();
  }

  ImGui::PopStyleColor(4);
}

} // namespace elements
} // namespace ui