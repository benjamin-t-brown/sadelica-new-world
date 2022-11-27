#include "Ui.h"
#include "components/InGameCmpt.h"
#include "components/TalkCmpt.h"
#include "lib/sdl2wrapper/Store.h"
#include "logger.h"
#include <sstream>

using SDL2Wrapper::Logger;
using SDL2Wrapper::LogType;

namespace ui {

Ui::Ui() {}

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
    logger::debug("Loaded font: {}", key.c_str());

    imguiFonts[key] = font;
  }
}

ImFont* Ui::getFont(const std::string& fontName) {
  auto fontItr = imguiFonts.find(fontName);
  if (fontItr != imguiFonts.end()) {
    return fontItr->second;
  }
  throw std::runtime_error("Could not getFont from ImGui (was it loaded?): " +
                           fontName);
}

SDL2Wrapper::Color imVec4ToSDL2WrapperColor(const ImVec4& c) {
  return SDL2Wrapper::Color{static_cast<uint8_t>(c.x * 255.),
                            static_cast<uint8_t>(c.y * 255.),
                            static_cast<uint8_t>(c.z * 255.),
                            static_cast<uint8_t>(c.w * 255.)};
}

void textCentered(const std::string& text) {
  auto windowWidth = ImGui::GetWindowSize().x;
  auto textWidth = ImGui::CalcTextSize(text.c_str()).x;

  ImGui::SetCursorPosX((windowWidth - textWidth) * 0.5f);
  ImGui::Text("%s", text.c_str());
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

void Ui::render() {
  renderTalkCmpt(*this);
  // renderInGameCmpt(*this);
}

} // namespace ui