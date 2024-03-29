#include "InGameCmpt.h"
#include "ui/Ui.h"
#include <algorithm>
#include <sstream>
#include <string>

constexpr double IN_GAME_CMPT_HEADER_HEIGHT_PCT_VERT = .1;
constexpr double IN_GAME_CMPT_PARTY_MEMBER_STATS_HEIGHT_PCT_VERT = .175;
constexpr double IN_GAME_CMPT_STATUS_HEIGHT_PCT_VERT = .1;
constexpr double IN_GAME_CMPT_FOOTER_HEIGHT_PCT_VERT = .075;
constexpr double IN_GAME_CMPT_INVENTORY_LIST_HEIGHT_PCT_VERT =
    (1.0 - IN_GAME_CMPT_HEADER_HEIGHT_PCT_VERT -
     IN_GAME_CMPT_PARTY_MEMBER_STATS_HEIGHT_PCT_VERT -
     IN_GAME_CMPT_STATUS_HEIGHT_PCT_VERT - IN_GAME_CMPT_FOOTER_HEIGHT_PCT_VERT);

namespace ui_InGameCmpt {}
using namespace ui;
using namespace ui_InGameCmpt;

namespace ui_InGameCmpt {

void subRenderPartyMemberIcons(const Ui& ui) {}

void subRenderPartyMemberNamePlate(const Ui& ui) {}

void subRenderInventoryButton(const Ui& ui) {}

void renderHeader(const Ui& ui) {
  auto originalCursorPosition = ImGui::GetCursorPos();

  PCT_BOX(1.0f, IN_GAME_CMPT_HEADER_HEIGHT_PCT_VERT, ui.colors.BLACK);
  const float width = box.x;
  const float height = box.y;

  const float halfHeight = height / 2.f;

  const std::string partyMemberName = "Elmindreta";
  const int partyMemberMaxHp = 100;
  const int partyMemberHp = 100;
  const int partyMemberMaxMp = 45;
  const int partyMemberMp = 45;

  // Party member buttons
  ImGui::SetCursorPos(originalCursorPosition);
  {
    PCT_BOX(1.0f, IN_GAME_CMPT_HEADER_HEIGHT_PCT_VERT / 2, ui.colors.BLACK);
    const float widthIcons = box.x;
    const float heightIcons = box.y;

    const float iconSize = heightIcons - 4;

    float cursorX = originalCursorPosition.x + 2;
    const float cursorY = originalCursorPosition.y + 2;

    for (unsigned int i = 0; i < 6; i++) {
      ImGui::PushID(static_cast<int>(i));

      ImGui::PushStyleColor(ImGuiCol_Button,
                            i == 0 ? ui.colors.BLUE : ui.colors.DARK_CYAN);
      ImGui::PushStyleColor(ImGuiCol_Text, ui.colors.CYAN);
      ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ui.colors.DARK_GREY);
      ImGui::PushStyleColor(ImGuiCol_ButtonActive, ui.colors.GREY);

      ImGui::SetCursorPos(ImVec2(cursorX, cursorY));
      ImGui::Button("", ImVec2(iconSize, iconSize));

      ImGui::PopStyleColor(4);

      cursorX += (iconSize + 4);

      ImGui::PopID();
    }
  }

  // Nameplate
  ImGui::SetCursorPos(
      ImVec2(originalCursorPosition.x, originalCursorPosition.y + halfHeight));
  {
    PCT_BOX(1.0f, IN_GAME_CMPT_HEADER_HEIGHT_PCT_VERT / 2, ui.colors.DARK_BLUE);
    const float widthNamePlate = box.x;
    const float heightNamePlate = box.y;

    ImGui::PushID("nameplate");
    ImGui::PushStyleColor(ImGuiCol_Button, ui.colors.TRANSPARENT);
    ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ui.colors.TRANSPARENT);
    ImGui::PushStyleColor(ImGuiCol_ButtonActive, ui.colors.TRANSPARENT);
    ImGui::PushStyleColor(ImGuiCol_Text, ui.colors.WHITE);

    auto nameSize = ImGui::CalcTextSize(partyMemberName.c_str());
    ImGui::SetCursorPos(ImVec2(originalCursorPosition.x,
                               originalCursorPosition.y + halfHeight));
    ImGui::Button(partyMemberName.c_str(), ImVec2(nameSize.x + 2, halfHeight));

    ImGui::PushStyleColor(ImGuiCol_Text, ui.colors.RED);
    std::stringstream ssHp;
    ssHp << partyMemberHp << "/" << partyMemberMaxHp;
    auto hpSize = ImGui::CalcTextSize(ssHp.str().c_str());
    ImGui::SetCursorPos(ImVec2(originalCursorPosition.x + nameSize.x + 24,
                               originalCursorPosition.y + halfHeight));
    ImGui::Button(ssHp.str().c_str(), ImVec2(hpSize.x + 2, halfHeight));
    ImGui::PopStyleColor();

    ImGui::PushStyleColor(ImGuiCol_Text, ui.colors.BLUE);
    std::stringstream ssMp;
    ssMp << partyMemberMp << "/" << partyMemberMaxMp;
    auto mpSize = ImGui::CalcTextSize(ssMp.str().c_str());
    ImGui::SetCursorPos(
        ImVec2(originalCursorPosition.x + nameSize.x + 8 + hpSize.x + 24,
               originalCursorPosition.y + halfHeight));
    ImGui::Button(ssMp.str().c_str(), ImVec2(mpSize.x + 2, halfHeight));
    ImGui::PopStyleColor();

    ImGui::PopStyleColor(4);
    ImGui::PopID();
  }

  // Close button
  ImGui::SetCursorPos(ImVec2(originalCursorPosition.x + width - height,
                             originalCursorPosition.y));
  {
    static auto borderRectangle =
        SDL2Wrapper::Window::getGlobalWindow().getStaticColorTexture(
            height, height, imVec4ToSDL2WrapperColor(ui.colors.WHITE));
    ImGui::Image(borderRectangle, box);
    float buttonSize = height - 4;

    ImGui::PushID("close");
    ImGui::PushStyleColor(ImGuiCol_Button, ui.colors.GREEN);
    ImGui::PushStyleColor(ImGuiCol_Text, ui.colors.WHITE);
    ImGui::PushStyleColor(ImGuiCol_ButtonHovered, ui.colors.DARK_GREY);
    ImGui::PushStyleColor(ImGuiCol_ButtonActive, ui.colors.GREY);

    ImGui::SetCursorPos(ImVec2(originalCursorPosition.x + width - height + 2,
                               originalCursorPosition.y + 4));
    ImGui::Button("Inv", ImVec2(buttonSize, buttonSize - 2));

    ImGui::PopStyleColor(4);
    ImGui::PopID();
  }

  ImGui::SetCursorPos(
      ImVec2(originalCursorPosition.x, originalCursorPosition.y + height));
}

void renderPartyMemberStatsArea(const Ui& ui) {
  auto originalCursorPosition = ImGui::GetCursorPos();

  PCT_BOX(1.0f,
          IN_GAME_CMPT_PARTY_MEMBER_STATS_HEIGHT_PCT_VERT,
          ui.colors.DARK_GREY);
  const float width = box.x;
  const float height = box.y;

  const int dmgMin = 9;
  const int dmgMax = 19;
  const int armorHack = 3;
  const int armorPierce = 4;
  const int accuracy = 5;
  const int power = 2;
  const int crit = 5;

  const ImGuiTableFlags flags = 0;
  ImGui::PushStyleVar(ImGuiStyleVar_CellPadding, ImVec2(0, 10));
  ImGui::SetCursorPos(
      ImVec2(originalCursorPosition.x + 4, originalCursorPosition.y));
  ImGui::BeginTable("statsTable", 2, flags, ImVec2(width * 3. / 4., 0));

  {
    ImGui::TableNextColumn();
    ImGui::SetNextItemWidth(-FLT_MIN);
    std::stringstream ss;
    ImGui::PushID("dmg");
    ss << "Dmg: " << dmgMin << "-" << dmgMax;
    ImGui::Text(ss.str().c_str());
    ImGui::PopID();
  }

  {
    ImGui::TableNextColumn();
    ImGui::SetNextItemWidth(-FLT_MIN);
    std::stringstream ss;
    ImGui::PushID("acc");
    ss << "Acc: +" << accuracy;
    ImGui::Text(ss.str().c_str());
    ImGui::PopID();
  }

  {
    ImGui::TableNextColumn();
    ImGui::SetNextItemWidth(-FLT_MIN);
    std::stringstream ss;
    ImGui::PushID("armor");
    ss << "Armor: " << armorHack << ", " << armorPierce;
    ImGui::Text(ss.str().c_str());
    ImGui::PopID();
  }

  {
    ImGui::TableNextColumn();
    ImGui::SetNextItemWidth(-FLT_MIN);
    std::stringstream ss;
    ImGui::PushID("power");
    ss << "Pow: " << power;
    ImGui::Text(ss.str().c_str());
    ImGui::PopID();
  }

  {
    ImGui::TableNextColumn();
    ImGui::SetNextItemWidth(-FLT_MIN);
    ImGui::PushID("empty");
    ImGui::PopID();
  }

  {
    ImGui::TableNextColumn();
    ImGui::SetNextItemWidth(-FLT_MIN);
    std::stringstream ss;
    ImGui::PushID("crit");
    ss << "Crit: " << crit;
    ImGui::Text(ss.str().c_str());
    ImGui::PopID();
  }

  ImGui::EndTable();

  ImGui::PopStyleVar();

  ImGui::SetCursorPos(
      ImVec2(originalCursorPosition.x, originalCursorPosition.y + height));
}

void renderStatusArea(const Ui& ui) {
  PCT_BOX(1.0f, IN_GAME_CMPT_STATUS_HEIGHT_PCT_VERT, ui.colors.BLACK);
  const float width = box.x;
  const float height = box.y;
}

void subRenderInventoryItem(const Ui& ui) {}

void renderInventoryList(const Ui& ui) {
  PCT_BOX(
      1.0f, IN_GAME_CMPT_INVENTORY_LIST_HEIGHT_PCT_VERT, ui.colors.DARK_GREY);
  const float width = box.x;
  const float height = box.y;
}

void renderFooter(const Ui& ui) {
  PCT_BOX(1.0f, IN_GAME_CMPT_FOOTER_HEIGHT_PCT_VERT, ui.colors.BLACK);
  const float width = box.x;
  const float height = box.y;
}

} // namespace ui_InGameCmpt

namespace ui {

void renderInGameCmpt(const Ui& ui) {
  const ImGuiWindowFlags windowFlags =
      ImGuiWindowFlags_NoDecoration | ImGuiWindowFlags_NoScrollbar |
      ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize |
      ImGuiWindowFlags_NoNav | ImGuiWindowFlags_NoBringToFrontOnFocus;

  const SDL2Wrapper::Window& window = SDL2Wrapper::Window::getGlobalWindow();
  const ImGuiIO& io = ImGui::GetIO();

  prepareFullScreenWindow();

  ImGui::PushStyleVar(ImGuiStyleVar_WindowRounding, 0.0f);
  ImGui::PushStyleVar(ImGuiStyleVar_WindowPadding, ImVec2(0, 0));
  ImGui::PushStyleVar(ImGuiStyleVar_ItemSpacing, ImVec2(0, 0));
  ImGui::Begin("InGame", NULL, windowFlags);
  ImGui::SetWindowFontScale(2.);

  renderHeader(ui);
  renderPartyMemberStatsArea(ui);
  renderStatusArea(ui);
  renderInventoryList(ui);
  renderFooter(ui);

  ImGui::End();
  ImGui::PopStyleVar(3);
}

} // namespace ui