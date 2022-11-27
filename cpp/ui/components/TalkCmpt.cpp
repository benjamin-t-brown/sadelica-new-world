#include "TalkCmpt.h"
#include "game/stateClient/cliContext.h"
#include "ui/Ui.h"
#include <algorithm>
#include <sstream>
#include <string>
#include <vector>

constexpr double TALK_CMPT_HEADER_HEIGHT_PCT_VERT = .2;
constexpr double TALK_CMPT_NAMEPLATE_HEIGHT_PCT_VERT = .05;
constexpr double TALK_CMPT_FOOTER_HEIGHT_PCT_VERT = .075;
constexpr double TALK_CMPT_TEXT_AREA_HEIGHT_PCT_VERT =
    (1.0 - TALK_CMPT_HEADER_HEIGHT_PCT_VERT -
     TALK_CMPT_NAMEPLATE_HEIGHT_PCT_VERT - TALK_CMPT_FOOTER_HEIGHT_PCT_VERT);

using ClientContext = snw::state::ClientContext;

namespace ui_TalkCmpt {}
using namespace ui;
using namespace ui_TalkCmpt;

namespace ui_TalkCmpt {
void renderHeader(Ui& ui) {
  auto outerWindowSize = ImGui::GetWindowSize();
  const float width = outerWindowSize.x;
  const float height =
      static_cast<float>(outerWindowSize.y * TALK_CMPT_HEADER_HEIGHT_PCT_VERT);

  const float portraitWidth = std::max(height, 128.f);
  const float borderColumnsWidth = (width - portraitWidth) / 2.f;

  static auto columnRectangle =
      SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(
          static_cast<int>(borderColumnsWidth),
          static_cast<int>(height),
          imVec4ToSDL2WrapperColor(ui.colors.BLACK));
  static auto portraitRectangle =
      SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(
          static_cast<int>(portraitWidth),
          static_cast<int>(height),
          imVec4ToSDL2WrapperColor(ui.colors.BLUE));

  ImGui::SetCursorPos(ImVec2(0, 0));
  ImGui::Image(columnRectangle, ImVec2(borderColumnsWidth, height));

  ImGui::SetCursorPos(ImVec2(borderColumnsWidth + portraitWidth, 0));
  ImGui::Image(columnRectangle, ImVec2(borderColumnsWidth, height));

  ImGui::SetCursorPos(ImVec2(borderColumnsWidth, 0));
  ImGui::Image(portraitRectangle, ImVec2(portraitWidth, height));
}

void renderNameplate(Ui& ui) {
  auto outerWindowSize = ImGui::GetWindowSize();
  const float width = outerWindowSize.x;
  const float height = static_cast<float>(outerWindowSize.y *
                                          TALK_CMPT_NAMEPLATE_HEIGHT_PCT_VERT);

  auto originalCursorPosition = ImGui::GetCursorPos();

  static auto borderRectangle =
      SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(
          static_cast<int>(width),
          static_cast<int>(height),
          imVec4ToSDL2WrapperColor(ui.colors.WHITE));
  static auto bgRectangle =
      SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(
          static_cast<int>(width - 4),
          static_cast<int>(height - 4),
          imVec4ToSDL2WrapperColor(ui.colors.PURPLE));

  const std::string name = "<not defined yet>";

  ImGui::Image(borderRectangle, ImVec2(width, height));
  ImGui::SetCursorPos(
      ImVec2(originalCursorPosition.x + 2, originalCursorPosition.y + 2));
  ImGui::Image(bgRectangle, ImVec2(width - 4, height + -4));

  ImGui::SetCursorPos(originalCursorPosition);
  ImGui::SetCursorPosX(static_cast<float>(originalCursorPosition.x) +
                       width / 4.f);
  ImGui::PushStyleColor(ImGuiCol_Button, (ImVec4)ImColor(0, 0, 0, 0));
  ImGui::PushStyleColor(ImGuiCol_ButtonHovered, (ImVec4)ImColor(0, 0, 0, 0));
  ImGui::PushStyleColor(ImGuiCol_ButtonActive, (ImVec4)ImColor(0, 0, 0, 0));
  ImGui::Button(name.c_str(), ImVec2(width / 2.f, height));
  ImGui::PopStyleColor(3);

  ImGui::SetCursorPosY(originalCursorPosition.y + height);
}

void renderTextArea(Ui& ui) {

  auto outerWindowSize = ImGui::GetWindowSize();
  // horizontal spacing
  const float spacing = 16;

  const float width = static_cast<float>(outerWindowSize.x) - spacing;
  const float height = static_cast<float>(outerWindowSize.y *
                                          TALK_CMPT_TEXT_AREA_HEIGHT_PCT_VERT);

  const auto originalCursorPosition = ImGui::GetCursorPos();

  static auto bgRectangle =
      SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(
          static_cast<int>(width + spacing),
          static_cast<int>(height),
          imVec4ToSDL2WrapperColor(ui.colors.DARK_GREY));
  ImGui::Image(bgRectangle, ImVec2(width + spacing, height));
  ImGui::SetCursorPos(originalCursorPosition);

  ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding,
                      ImVec2(spacing / 2.f, spacing / 2.f));
  ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing,
                      ImVec2(spacing / 2.f, spacing / 2.f));
  ImGui::SetCursorPosX(spacing);
  ImGui::BeginChild("in2_TextArea", ImVec2(width, height), false);

  auto& state = ClientContext::get().getState();
  const std::string& text = state.in2.conversationText;

  if (state.in2.in2Ctx == nullptr || state.in2.in2Ctx->isExecutionErrored) {
    return;
  }

  ImGui::Spacing();
  ImGui::Spacing();
  ImGui::Spacing();
  ImGui::TextWrapped("%s", text.c_str());
  ImGui::Spacing();

  ImGui::PushFont(ui.getFont("Chicago20"));
  if (state.in2.in2Ctx->waitingForResume) {
    ImGui::PushStyleColor(ImGuiCol_Button, ui.colors.PURPLE);
    ImGui::PushStyleColor(ImGuiCol_Text, ui.colors.WHITE);
    ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ui.colors.BLACK);
    ImGui::PushStyleColor(ImGuiCol_ButtonActive, ui.colors.DARK_GREY);
    ImGui::Spacing();
    std::stringstream ss;
    ss << "Continue.";
    auto textSize = ImGui::CalcTextSize(ss.str().c_str(), NULL, false, width);
    textSize.y += 24;
    if (ImGui::Button(ss.str().c_str(), ImVec2(width - spacing, textSize.y))) {
      snw::state::dispatch::continueTalk();
    }
    ImGui::Spacing();
    ImGui::PopStyleColor(4);
  } else if (state.in2.in2Ctx->waitingForChoice) {
    const auto& choices = state.in2.choices;
    ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(2, 2));
    int ctr = 1;
    for (const std::string& choice : choices) {
      ImGui::PushID(ctr);
      std::stringstream ss;

      if (state.in2.in2Ctx->hasChosenChoice(ctr - 1)) {
        ImGui::PushStyleColor(ImGuiCol_Button, ui.colors.DARK_CYAN);
        ImGui::PushStyleColor(ImGuiCol_Text, ui.colors.WHITE);
        ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ui.colors.BLACK);
        ImGui::PushStyleColor(ImGuiCol_ButtonActive, ui.colors.DARK_GREY);
      } else {
        ImGui::PushStyleColor(ImGuiCol_Button, ui.colors.DARK_CYAN);
        ImGui::PushStyleColor(ImGuiCol_Text, ui.colors.CYAN);
        ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ui.colors.BLACK);
        ImGui::PushStyleColor(ImGuiCol_ButtonActive, ui.colors.DARK_GREY);
      }

      ss << ctr << ". " << choice;
      auto textSize = ImGui::CalcTextSize(ss.str().c_str(), NULL, false, width);
      textSize.y += 24;
      textSize.x += 4;

      auto buttonCursorPosition = ImGui::GetCursorPos();
      if (ImGui::Button("", ImVec2(width - spacing, textSize.y))) {
        snw::state::dispatch::chooseTalk(ctr - 1);
      }
      ImGui::SetCursorPos(
          ImVec2(buttonCursorPosition.x + 2, buttonCursorPosition.y + 12));
      ImGui::TextWrapped("%s", ss.str().c_str());
      ImGui::SetCursorPosY(buttonCursorPosition.y + textSize.y);

      ImGui::PopStyleColor(4);
      ImGui::Spacing();

      ImGui::PopID();
      ctr++;
    }
    ImGui::PopStyleVar(1);
  }
  ImGui::PopFont();

  for (unsigned int i = 0; i < 15; i++) {
    ImGui::Text(" ");
  }

  ImGui::PopStyleVar(2);
  ImGui::EndChild();
}

void renderFooter(Ui& ui) {
  auto outerWindowSize = ImGui::GetWindowSize();
  const float width = outerWindowSize.x;
  const float height =
      static_cast<float>(outerWindowSize.y * TALK_CMPT_FOOTER_HEIGHT_PCT_VERT);

  auto originalCursorPosition = ImGui::GetCursorPos();

  static auto bgRectangle =
      SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(
          static_cast<int>(width),
          static_cast<int>(height),
          imVec4ToSDL2WrapperColor(ui.colors.GREY));

  ImGui::Image(bgRectangle, ImVec2(width, height));

  ImGui::SetCursorPos(originalCursorPosition);
  ImGui::SetCursorPosX(width - 120);

  ImGui::PushStyleColor(ImGuiCol_Button, ui.colors.GREY);
  ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ui.colors.DARK_GREY);
  ImGui::PushStyleColor(ImGuiCol_ButtonActive, ui.colors.GREY);
  ImGui::Button("Options", ImVec2(120, height));
  ImGui::PopStyleColor(3);
}
} // namespace ui_TalkCmpt

namespace ui {

void renderTalkCmpt(Ui& ui) {
  const ImGuiWindowFlags windowFlags =
      ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoScrollbar |
      ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize |
      ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoBringToFrontOnFocus;

  const SDL2Wrapper::Window& window = SDL2Wrapper::Window::getGlobalWindow();
  const ImGuiIO& io = ImGui::GetIO();

  prepareFullScreenWindow();

  // prepareStaticColorTexture();

  ImGui::PushStyleVar(ImGuiStyleVar_WindowRounding, 0.0f);
  ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0, 0));
  ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(0, 0));
  ImGui::PushFont(ui.getFont("Chicago20"));
  ImGui::Begin("Talk", NULL, windowFlags);
  // ImGui::SetWindowFontScale(2.);
  // ImGui::SetWindowFo

  renderHeader(ui);
  renderNameplate(ui);
  renderTextArea(ui);
  renderFooter(ui);

  // ImGui::SetCursorPos(ImVec2(ImGui::GetWindowSize() - image_size));

  // ImGui::Text("HERE IS SOME RANDOM TEXT I SUPPOSEasdf.");

  ImGui::End();
  ImGui::PopStyleVar(3);
  ImGui::PopFont();
}

} // namespace ui