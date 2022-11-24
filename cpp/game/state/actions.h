#pragma once

#include "lib/betterenum/enum.h"

namespace SNW {
namespace State {

// NOLINTNEXTLINE
BETTER_ENUM(DispatchActionType,
            int,
            NOOP = 1,
            UI_SHOW_SECTION,
            UI_HIDE_SECTION,
            UI_SELECT_ACTIVE_CHARACTER,
            UI_CONFIRM_NOTIFICATION_MODAL,
            UI_CONFIRM_CHOICE_MODAL,
            UI_CANCEL_CHOICE_MODAL,

            CONVERSATION_SELECT_CHOICE,
            CONVERSATION_CONTINUE,

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

            CIVIL_DECLARE_TALK,
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
            INVENTORY_DECLARE_UNEQUIP)

// NOLINTNEXTLINE
BETTER_ENUM(ResultActionType,
            int,
            NOOP = 1,
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

            CHARACTER_STARTED_TALK,
            CHARACTER_ENDED_TALK,
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
            PLAYER_TILES_WERE_UNREVEALED)

struct DispatchAction {
  DispatchActionType type = DispatchActionType::NOOP;
  void* jsonPayload = nullptr;
};

struct ResultAction {
  ResultActionType type = ResultActionType::NOOP;
  void* jsonPayload = nullptr;
};

} // namespace State
} // namespace SNW