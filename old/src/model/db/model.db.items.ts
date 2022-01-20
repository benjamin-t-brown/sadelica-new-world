/*
global
G_model_actorGetStats
G_model_statsModifyHp
G_model_getCurrentWorld
G_model_roomGetActorAt
G_model_worldGetCurrentRoom
G_model_actorGetInventory
G_model_actorGetPosition
G_model_itemGetBaseItem
G_model_addLog
G_model_playerModifyGold
G_model_roomGetTileAt
G_model_tileGetId
G_model_roomSetTileAt
G_model_setCutsceneLine
G_controller_render
G_view_playSound
G_controller_damageScroll
G_controller_getTargetedPosition
G_controller_playerInputComplete
G_controller_dropItem
G_utils_getTargets
G_utils_randInRange
G_BEHAVIOR_RAND
G_BEHAVIOR_NONE
G_TARGETING_SINGLE
G_TARGETING_3X3
G_TILE_CHEST
G_TILE_GATE
G_TILE_GRASS
G_createStats
G_EQUIP_STATE_NONE
G_EQUIP_STATE_KNIFE
G_EQUIP_STATE_SWORD
G_EQUIP_STATE_SPEAR
G_EQUIP_STATE_BOW
G_createItem
*/

type TargetingType = 0 | 1;
const TARGETING_SCROLL = 0;
// const TARGETING_BOW = 1;

const useTargeting = async (
  type: TargetingType,
  user: Actor,
  targetArea: TargetArea,
  dmg: DmgMinMax,
  sound: string,
  pos?: [number, number] | null
): Promise<boolean> => {
  pos = pos || (await G_controller_getTargetedPosition(targetArea));
  if (pos) {
    const world = G_model_getCurrentWorld();
    const [x, y] = pos;
    const targets = G_utils_getTargets(x, y, targetArea);
    let targetFound = false;
    for (let i = 0; i < targets.length; i++) {
      const [tx, ty] = targets[i];
      const actor = G_model_roomGetActorAt(
        G_model_worldGetCurrentRoom(world),
        tx,
        ty
      );
      if (actor) {
        if (type === TARGETING_SCROLL) {
          G_controller_damageScroll(
            user,
            actor,
            dmg,
            targetFound ? '' : sound,
            world
          );
          targetFound = true;
        }
        //  else if (type === TARGETING_BOW) {
        //   G_controller_damageScroll(
        //     user,
        //     actor,
        //     dmg,
        //     targetFound ? '' : sound,
        //     world
        //   );
        //   targetFound = true;
        // }
      }
    }
    if (targetFound) {
      G_controller_playerInputComplete();
      return true;
    } else {
      G_view_playSound('cancel');
      return false;
      // G_model_addLog(` - cancel`);
    }
  }
  return false;
};

const onGetRandomGold = (min: number, max: number) => (): boolean => {
  G_view_playSound('gold');
  G_model_playerModifyGold(
    G_model_getCurrentWorld().player,
    G_utils_randInRange(min, max)
  );
  return false;
};

const G_ITEM_GOLD_SM = G_createItem({
  name: 'Gold S',
  spriteIndex: 13,
  meta: {
    onAcq: onGetRandomGold(1, 5),
  },
  sellAmount: 1,
  dscr: '',
});

const G_ITEM_GOLD_MD = G_createItem({
  name: 'Gold S',
  spriteIndex: 13,
  meta: {
    onAcq: onGetRandomGold(1, 5),
  },
  sellAmount: 1,
  dscr: '',
});

const G_ITEM_GOLD_LG = G_createItem({
  name: 'Gold S',
  spriteIndex: 13,
  meta: {
    onAcq: onGetRandomGold(5, 10),
  },
  sellAmount: 1,
  dscr: '',
});

const G_ITEM_RUSTY_KNIFE = G_createItem({
  name: 'Rusty Knife',
  spriteIndex: 2,
  meta: {
    getDmg: () => [4, 8],
  },
  sellAmount: 1,
  equipState: G_EQUIP_STATE_KNIFE,
  dscr:
    'A small knife that might be useful for cutting mooring lines, but not much else.',
});

const G_ITEM_RUSTY_SWORD = G_createItem({
  name: 'Rusty Sword',
  spriteIndex: 2,
  meta: {
    getDmg: () => [8, 16],
  },
  sellAmount: 1,
  equipState: G_EQUIP_STATE_SWORD,
  dscr:
    'This sword is rusting around the hilt and rather uncomfortable to hold.',
});

const G_ITEM_RUSTY_SPEAR = G_createItem({
  name: 'Rusty Spear',
  spriteIndex: 2,
  meta: {
    getDmg: () => [12, 14],
  },
  sellAmount: 1,
  equipState: G_EQUIP_STATE_SPEAR,
  dscr:
    'A hunk of metal is attached at the end of this spear.  It is not sharp, but with enough force it could be considered deadly.',
});

const G_ITEM_RUSTY_BOW = G_createItem({
  name: 'Rusty Bow',
  spriteIndex: 7,
  meta: {
    getDmg: () => [1, 2],
    onUse: async (user: Actor) => {
      return useTargeting(
        TARGETING_SCROLL,
        user,
        G_TARGETING_SINGLE,
        [13, 20],
        'flame'
      );
    },
  },
  sellAmount: 1,
  equipState: G_EQUIP_STATE_BOW,
  dscr:
    'Somehow this wooden bow appears to be rusting around the handle.  It must contain iron flakes or something.',
});

const G_ITEM_WOOD_TIP_ARROW = G_createItem({
  name: 'Wood-tipped Arrow',
  spriteIndex: 1,
  meta: {
    onUse: async (user: Actor) => {
      return useTargeting(
        TARGETING_SCROLL,
        user,
        G_TARGETING_SINGLE,
        [13, 20],
        'flame'
      );
    },
  },
  sellAmount: 1,
  dscr: 'Wooden arrows are the standard projectile for most bows.',
});

const G_ITEM_SCROLL_FLAME = G_createItem({
  name: 'Scroll: Flame',
  spriteIndex: 6,
  meta: {
    onUse: async (user: Actor) => {
      return useTargeting(
        TARGETING_SCROLL,
        user,
        G_TARGETING_SINGLE,
        [13, 20],
        'flame'
      );
    },
  },
  sellAmount: 50,
  dscr: 'A scroll capable of invoking a fireball at a targeted location.',
});

const G_ITEM_POTION_HEALTH = G_createItem({
  name: 'Potion: Health',
  spriteIndex: 9,
  meta: {
    onUse: async (user: Actor) => {
      G_model_statsModifyHp(
        G_model_actorGetStats(user),
        G_utils_randInRange(5, 15)
      );
      return true;
    },
  },
  sellAmount: 50,
  dscr: 'This potion miraculously heals you immediately upon imbibing.',
});

const G_ITEM_POTION_USS = G_createItem({
  name: 'Potion: Unbelievable Sort Of Strength',
  spriteIndex: 9,
  meta: {
    onUse: async (user: Actor) => {
      G_model_statsModifyHp(
        G_model_actorGetStats(user),
        G_utils_randInRange(100, 100)
      );
      return true;
    },
  },
  sellAmount: 500,
  dscr: 'This potion is an unbelievable potion of strength.',
});
