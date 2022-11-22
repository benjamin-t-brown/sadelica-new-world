#include "Ui.h"

#include <sstream>

#include "lib/sdl2wrapper/Logger.h"
#include "lib/sdl2wrapper/Store.h"
#include "components/InGameCmpt.h"
#include "components/TalkCmpt.h"

using SDL2Wrapper::Logger;
using SDL2Wrapper::LogType;

namespace ui {

Ui::Ui() {}

void textCentered(const std::string& text) {
  auto windowWidth = ImGui::GetWindowSize().x;
  auto textWidth = ImGui::CalcTextSize(text.c_str()).x;

  ImGui::SetCursorPosX((windowWidth - textWidth) * 0.5f);
  ImGui::Text(text.c_str());
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

SDL_Texture*
createStaticColorTexture(int width, int height, const ImVec4& color) {
  SDL2Wrapper::Window& window = SDL2Wrapper::Window::getGlobalWindow();
  auto renderer = &window.getRenderer();
  auto texture = SDL_CreateTexture(renderer,
                                   SDL_PIXELFORMAT_RGBA32,
                                   SDL_TEXTUREACCESS_TARGET,
                                   width,
                                   height);

  SDL_SetRenderTarget(renderer, texture);
  SDL_SetRenderDrawColor(renderer,
                         static_cast<Uint8>(color.x * 255.),
                         static_cast<Uint8>(color.y * 255.),
                         static_cast<Uint8>(color.z * 255.),
                         static_cast<Uint8>(color.w * 255.));
  SDL_RenderClear(renderer);
  SDL_SetRenderTarget(renderer, nullptr);

  std::stringstream ss;
  ss << width << "," << height << "," << color.x << "," << color.y << ","
     << color.z << "," << color.w << Logger::endl;
  // track texture in SDLWrapper Store so it can be deleted gracefully on
  // program end.
  SDL2Wrapper::Store::storeTextTexture(ss.str(), texture);

  return texture;
}

void Ui::render() {
  // renderTalkCmpt(*this);
  renderInGameCmpt(*this);
}

} // namespace ui