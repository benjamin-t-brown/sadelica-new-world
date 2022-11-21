#include "TalkCmpt.h"
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

namespace ui_TalkCmpt {}
using namespace ui;
using namespace ui_TalkCmpt;

namespace ui_TalkCmpt {
void renderHeader(const Ui& ui) {
  auto outerWindowSize = ImGui::GetWindowSize();
  const float width = outerWindowSize.x;
  const float height =
      static_cast<float>(outerWindowSize.y * TALK_CMPT_HEADER_HEIGHT_PCT_VERT);

  const float portraitWidth = std::max(height, 128.f);
  const float borderColumnsWidth = (width - portraitWidth) / 2.f;

  static auto columnRectangle =
      createStaticColorTexture(static_cast<int>(borderColumnsWidth),
                               static_cast<int>(height),
                               ui.colors.BLACK);
  static auto portraitRectangle =
      createStaticColorTexture(static_cast<int>(portraitWidth),
                               static_cast<int>(height),
                               ui.colors.BLUE);

  ImGui::SetCursorPos(ImVec2(0, 0));
  ImGui::Image(columnRectangle, ImVec2(borderColumnsWidth, height));

  ImGui::SetCursorPos(ImVec2(borderColumnsWidth + portraitWidth, 0));
  ImGui::Image(columnRectangle, ImVec2(borderColumnsWidth, height));

  ImGui::SetCursorPos(ImVec2(borderColumnsWidth, 0));
  ImGui::Image(portraitRectangle, ImVec2(portraitWidth, height));
}

void renderNameplate(const Ui& ui) {
  auto outerWindowSize = ImGui::GetWindowSize();
  const float width = outerWindowSize.x;
  const float height = static_cast<float>(outerWindowSize.y *
                                          TALK_CMPT_NAMEPLATE_HEIGHT_PCT_VERT);

  auto originalCursorPosition = ImGui::GetCursorPos();

  static auto borderRectangle = createStaticColorTexture(
      static_cast<int>(width), static_cast<int>(height), ui.colors.WHITE);
  static auto bgRectangle =
      createStaticColorTexture(static_cast<int>(width - 4),
                               static_cast<int>(height - 4),
                               ui.colors.PURPLE);

  const std::string name = "Radmilla Web";

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

void renderTextArea(const Ui& ui) {
  auto outerWindowSize = ImGui::GetWindowSize();
  const float spacing = 12;

  const float width = static_cast<float>(outerWindowSize.x) - spacing;
  const float height = static_cast<float>(outerWindowSize.y *
                                          TALK_CMPT_TEXT_AREA_HEIGHT_PCT_VERT);

  const auto originalCursorPosition = ImGui::GetCursorPos();

  static auto bgRectangle =
      createStaticColorTexture(static_cast<int>(width + spacing),
                               static_cast<int>(height),
                               ui.colors.DARK_GREY);
  ImGui::Image(bgRectangle, ImVec2(width + spacing, height));
  ImGui::SetCursorPos(originalCursorPosition);

  ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding,
                      ImVec2(spacing / 2.f, spacing / 2.f));
  ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing,
                      ImVec2(spacing / 2.f, spacing / 2.f));
  ImGui::SetCursorPosX(spacing);
  ImGui::BeginChild("TextArea", ImVec2(width, height));

  const std::vector<std::string> texts = {
      "Before you stands a woman of imposing stature.  Easily twice your "
      "height, her shadow engulfs you completely.  At first she does not "
      "notice you, but after an awkward moment she blinks and cocks an "
      "eyebrow.",
      "Before you stands a woman of imposing stature.  Easily twice your "
      "height, her shadow engulfs you completely.  At first she does not "
      "notice you, but after an awkward moment she blinks and cocks an "
      "eyebrow.",
      "Before you stands a woman of imposing stature.  Easily twice your "
      "height, her shadow engulfs you completely.  At first she does not "
      "notice you, but after an awkward moment she blinks and cocks an "
      "eyebrow.",
      "Before you stands a woman of imposing stature.  Easily twice your "
      "height, her shadow engulfs you completely.  At first she does not "
      "notice you, but after an awkward moment she blinks and cocks an "
      "eyebrow.",
      "Before you stands a woman of imposing stature.  Easily twice your "
      "height, her shadow engulfs you completely.  At first she does not "
      "notice you, but after an awkward moment she blinks and cocks an "
      "eyebrow.",
      "Before you stands a woman of imposing stature.  Easily twice your "
      "height, her shadow engulfs you completely.  At first she does not "
      "notice you, but after an awkward moment she blinks and cocks an "
      "eyebrow.",
      "Before you stands a woman of imposing stature.  Easily twice your "
      "height, her shadow engulfs you completely.  At first she does not "
      "notice you, but after an awkward moment she blinks and cocks an "
      "eyebrow.",
      "'I see you've returned in one piece.'",
      "No thanks to you.",
      "'It occurs to me that you do not know the meaning of the word "
      "'discretion'.  You should learn what that means and, more importantly, "
      "employ it.'"};

  const std::vector<std::string> choices = {
      "Don't worry, I know what I'm doing.",
      "I don't like your tone, woman.  Why don't you stuff it, huh?",
      "I understand.",
      "Actually, nevermind."};

  ImGui::Spacing();
  for (const std::string& text : texts) {
    ImGui::TextWrapped(text.c_str());
    ImGui::Spacing();
  }

  auto font = ImGui::GetFont();

  ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(2, 2));
  int ctr = 1;
  for (const std::string& choice : choices) {
    ImGui::PushID(ctr);

    ImGui::PushStyleColor(ImGuiCol_Button, ui.colors.DARK_CYAN);
    ImGui::PushStyleColor(ImGuiCol_Text, ui.colors.CYAN);
    ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ui.colors.DARK_GREY);
    ImGui::PushStyleColor(ImGuiCol_ButtonActive, ui.colors.GREY);

    std::stringstream ss;
    ss << ctr << ". " << choice;
    auto textSize = ImGui::CalcTextSize(ss.str().c_str(), NULL, false, width);
    textSize.y += 8;
    textSize.x += 4;

    auto buttonCursorPosition = ImGui::GetCursorPos();
    ImGui::Button("", ImVec2(width - spacing, textSize.y));
    ImGui::SetCursorPos(
        ImVec2(buttonCursorPosition.x + 2, buttonCursorPosition.y + 4));
    ImGui::TextWrapped(ss.str().c_str());
    ImGui::SetCursorPosY(buttonCursorPosition.y + textSize.y);

    ImGui::PopStyleColor(4);
    ImGui::Spacing();

    ImGui::PopID();
    ctr++;
  }
  ImGui::PopStyleVar(1);

  for (unsigned int i = 0; i < 25; i++) {
    ImGui::Text(" ");
  }

  ImGui::PopStyleVar(2);
  ImGui::EndChild();
}

void renderFooter(const Ui& ui) {
  auto outerWindowSize = ImGui::GetWindowSize();
  const float width = outerWindowSize.x;
  const float height =
      static_cast<float>(outerWindowSize.y * TALK_CMPT_FOOTER_HEIGHT_PCT_VERT);

  auto originalCursorPosition = ImGui::GetCursorPos();

  static auto bgRectangle = createStaticColorTexture(
      static_cast<int>(width), static_cast<int>(height), ui.colors.GREY);

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

void renderTalkCmpt(const Ui& ui) {
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
  ImGui::Begin("Talk", NULL, windowFlags);
  ImGui::SetWindowFontScale(2.);

  renderHeader(ui);
  renderNameplate(ui);
  renderTextArea(ui);
  renderFooter(ui);

  // ImGui::SetCursorPos(ImVec2(ImGui::GetWindowSize() - image_size));

  // ImGui::Text("HERE IS SOME RANDOM TEXT I SUPPOSEasdf.");

  ImGui::End();
  ImGui::PopStyleVar(3);
}

} // namespace ui