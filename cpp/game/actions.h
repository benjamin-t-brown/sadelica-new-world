
#pragma once

// #include "lib/betterenum/enum.h"

#include <string>

namespace snw {
namespace state {

enum ActionCl { LOOPBACK_ONLY = 1, SEND_ONLY, BOTH };

enum DispatchActionType {
  NOOP_DISPATCH = 1,
  UI_SHOW_SECTION,
  UI_HIDE_SECTION,
  UI_SELECT_ACTIVE_CHARACTER,
  UI_CONFIRM_NOTIFICATION_MODAL,
  UI_CONFIRM_CHOICE_MODAL,
  UI_CANCEL_CHOICE_MODAL,

  TALK_START,
  TALK_SELECT_CHOICE,
  TALK_CONTINUE,
  TALK_END,

  LOAD_GAME,
  SAVE_GAME,

  CHARACTER_DECLARE_MOVE,
  CHARACTER_DECLARE_OPEN_DOOR,
  CHARACTER_DECLARE_CLOSE_DOOR,

  BATTLE_DECLARE_MELEE_ATTACK,
  BATTLE_DECLARE_RANGE_ATTACK,
  BATTLE_DECLARE_MAGIC_ATTACK,
  BATTLE_DECLARE_MELEE_SKILL,
  BATTLE_DECLARE_MAGIC_SKILL,

  CIVIL_DECLARE_STEAL,
  CIVIL_DECLARE_EXAMINE,

  CHARACTER_MISC_CHANGE_NAME,
  PARTY_MISC_CHANGE_CHARACTER_ORDER,

  INVENTORY_DECLARE_SORT,
  INVENTORY_DECLARE_USE_ITEM_WITH_TARGET,
  INVENTORY_DECLARE_USE_ITEM_WITH_CHARACTER_TARGET,
  INVENTORY_DECLARE_USE_ITEM_SELF,
  INVENTORY_DECLARE_DROP,
  INVENTORY_DECLARE_PICKUP,
  INVENTORY_DECLARE_EQUIP,
  INVENTORY_DECLARE_UNEQUIP
};

enum ResultActionType {
  NOOP_RESULT = 1,
  MAP_LOADED,
  MAP_CHARACTER_ADDED,
  MAP_CHARACTER_REMOVED,
  MAP_ITEM_ADDED,
  MAP_ITEM_REMOVED,
  MAP_BATTLE_STARTED,
  MAP_BATTLE_ENDED,
  MAP_DOOR_OPENED,
  MAP_DOOR_CLOSED,
  MAP_FIELD_CREATED,
  MAP_FIELD_REMOVED,
  MAP_TILE_CHANGED,

  CHARACTER_MOVED,
  CHARACTER_BATTLE_TURN_STARTED,
  CHARACTER_BATTLE_TURN_ENDED,
  CHARACTER_ATTACKED_MELEE,
  CHARACTER_ATTACKED_RANGE,
  CHARACTER_ATTACKED_MAGIC,
  CHARACTER_USED_MELEE_SKILL,
  CHARACTER_USED_MAGIC_SKILL,

  TALK_STARTED,
  TALK_ENDED,
  TALK_RESUMED,
  TALK_CHOICE_PICKED,

  CHARACTER_STARTED_STEAL,
  CHARACTER_ENDED_STEAL,
  CHARACTER_EXAMINED,

  CHARACTER_NAME_CHANGED,
  PARTY_MISC_ORDER_CHANGED,

  INVENTORY_SORTED,
  INVENTORY_USED_ITEM_WITH_TARGET,
  INVENTORY_USED_ITEM_WITH_CHARACTER_TARGET,
  INVENTORY_USED_ITEM_SELF,
  INVENTORY_DROPPED_ITEM,
  INVENTORY_PICKED_UP_ITEM,
  INVENTORY_EQUIPPED_ITEM,
  INVENTORY_UNEQUIPPED_ITEM,
  INVENTORY_RECEIVED_ITEM,

  PLAYER_TILES_WERE_REVEALED,
  PLAYER_TILES_WERE_UNREVEALED
};

// // NOLINTNEXTLINE
// BETTER_ENUM(ActionCl, int, LOOPBACK_ONLY = 1, SEND_ONLY, BOTH)

// // NOLINTNEXTLINE
// BETTER_ENUM(DispatchActionType,
//             int,
//             NOOP_DISPATCH = 1,
//             UI_SHOW_SECTION,
//             UI_HIDE_SECTION,
//             UI_SELECT_ACTIVE_CHARACTER,
//             UI_CONFIRM_NOTIFICATION_MODAL,
//             UI_CONFIRM_CHOICE_MODAL,
//             UI_CANCEL_CHOICE_MODAL,

//             TALK_START,
//             TALK_SELECT_CHOICE,
//             TALK_CONTINUE,
//             TALK_END,

//             LOAD_GAME,
//             SAVE_GAME,

//             CHARACTER_DECLARE_MOVE,
//             CHARACTER_DECLARE_OPEN_DOOR,
//             CHARACTER_DECLARE_CLOSE_DOOR,

//             BATTLE_DECLARE_MELEE_ATTACK,
//             BATTLE_DECLARE_RANGE_ATTACK,
//             BATTLE_DECLARE_MAGIC_ATTACK,
//             BATTLE_DECLARE_MELEE_SKILL,
//             BATTLE_DECLARE_MAGIC_SKILL,

//             CIVIL_DECLARE_STEAL,
//             CIVIL_DECLARE_EXAMINE,

//             CHARACTER_MISC_CHANGE_NAME,
//             PARTY_MISC_CHANGE_CHARACTER_ORDER,

//             INVENTORY_DECLARE_SORT,
//             INVENTORY_DECLARE_USE_ITEM_WITH_TARGET,
//             INVENTORY_DECLARE_USE_ITEM_WITH_CHARACTER_TARGET,
//             INVENTORY_DECLARE_USE_ITEM_SELF,
//             INVENTORY_DECLARE_DROP,
//             INVENTORY_DECLARE_PICKUP,
//             INVENTORY_DECLARE_EQUIP,
//             INVENTORY_DECLARE_UNEQUIP)

// // NOLINTNEXTLINE
// BETTER_ENUM(ResultActionType,
//             int,
//             NOOP_RESULT = 1,
//             MAP_LOADED,
//             MAP_CHARACTER_ADDED,
//             MAP_CHARACTER_REMOVED,
//             MAP_ITEM_ADDED,
//             MAP_ITEM_REMOVED,
//             MAP_BATTLE_STARTED,
//             MAP_BATTLE_ENDED,
//             MAP_DOOR_OPENED,
//             MAP_DOOR_CLOSED,
//             MAP_FIELD_CREATED,
//             MAP_FIELD_REMOVED,
//             MAP_TILE_CHANGED,

//             CHARACTER_MOVED,
//             CHARACTER_BATTLE_TURN_STARTED,
//             CHARACTER_BATTLE_TURN_ENDED,
//             CHARACTER_ATTACKED_MELEE,
//             CHARACTER_ATTACKED_RANGE,
//             CHARACTER_ATTACKED_MAGIC,
//             CHARACTER_USED_MELEE_SKILL,
//             CHARACTER_USED_MAGIC_SKILL,

//             TALK_STARTED,
//             TALK_ENDED,
//             TALK_RESUMED,
//             TALK_CHOICE_PICKED,

//             CHARACTER_STARTED_STEAL,
//             CHARACTER_ENDED_STEAL,
//             CHARACTER_EXAMINED,

//             CHARACTER_NAME_CHANGED,
//             PARTY_MISC_ORDER_CHANGED,

//             INVENTORY_SORTED,
//             INVENTORY_USED_ITEM_WITH_TARGET,
//             INVENTORY_USED_ITEM_WITH_CHARACTER_TARGET,
//             INVENTORY_USED_ITEM_SELF,
//             INVENTORY_DROPPED_ITEM,
//             INVENTORY_PICKED_UP_ITEM,
//             INVENTORY_EQUIPPED_ITEM,
//             INVENTORY_UNEQUIPPED_ITEM,
//             INVENTORY_RECEIVED_ITEM,

//             PLAYER_TILES_WERE_REVEALED,
//             PLAYER_TILES_WERE_UNREVEALED)

struct DispatchAction {
  ActionCl cl = ActionCl::LOOPBACK_ONLY;
  DispatchActionType type = DispatchActionType::NOOP_DISPATCH;
  void* jsonPayload = nullptr;
};

struct ResultAction {
  ResultActionType type = ResultActionType::NOOP_RESULT;
  void* jsonPayload = nullptr;
};

inline std::string dispatchActionString(DispatchActionType type) {
  switch (type) {
  case DispatchActionType::NOOP_DISPATCH:
    return "NOOP_DISPATCH";
  case DispatchActionType::TALK_START:
    return "TALK_START";
  case DispatchActionType::TALK_SELECT_CHOICE:
    return "TALK_SELECT_CHOICE";
  case DispatchActionType::TALK_CONTINUE:
    return "TALK_CONTINUE";
  case DispatchActionType::TALK_END:
    return "TALK_END";
  default:
    return std::to_string(static_cast<int>(type));
  }
}
inline std::string resultActionString(ResultActionType type) {
  switch (type) {
  case ResultActionType::NOOP_RESULT:
    return "NOOP_RESULT";
  default:
    return std::to_string(static_cast<int>(type));
  }
}

} // namespace state
} // namespace snw