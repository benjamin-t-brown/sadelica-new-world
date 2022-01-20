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
*/

// const G_DROPS_LVL1 = [
//   G_ITEM_KNIFE,
//   G_ITEM_SWORD,
//   // G_ITEM_ARROW,
//   G_ITEM_GOLD_SM,
//   G_ITEM_SCROLL_FLAME,
//   G_ITEM_SCROLL_COMBUST,
//   // G_ITEM_SCROLL_FLY,
//   G_ITEM_POTION,
//   G_ITEM_KEY,
// ];
// const G_CHEST_LVL1 = [
//   // G_ITEM_BOW,
//   [G_ITEM_POTION, 3],
//   [G_ITEM_SCROLL_FLAME, 3],
//   [G_ITEM_SCROLL_COMBUST, 2],
//   [G_ITEM_SCROLL_FIREBALL, 2],
//   // G_ITEM_SCROLL_TELEPORT,
//   // [G_ITEM_ARROW, 5],
// ];
// const G_DROPS_LVL2 = [
//   G_ITEM_SWORD,
//   // [G_ITEM_ARROW, 3],
//   G_ITEM_GOLD_SM,
//   G_ITEM_GOLD_MD,
//   G_ITEM_SCROLL_FLAME,
//   G_ITEM_SCROLL_COMBUST,
//   G_ITEM_FINE_SWORD,
//   G_ITEM_POTION,
//   // G_ITEM_SCROLL_FLY,
// ];
// const G_CHEST_LVL2 = [
//   // [G_ITEM_FINE_ARROW, 5],
//   [G_ITEM_SCROLL_FIREBALL, 2],
//   [G_ITEM_SCROLL_FLAME, 5],
//   [G_ITEM_POTION, 5],
//   // [G_ITEM_ARROW, 10],
// ];

// const G_DROPS_LVL3 = [
//   G_ITEM_GOLD_MD,
//   G_ITEM_GOLD_LG,
//   G_ITEM_FINE_SWORD,
//   G_ITEM_SCROLL_FLAME,
//   G_ITEM_POTION,
//   // [G_ITEM_SCROLL_HASTE, 2],
//   // [G_ITEM_FINE_ARROW, 3],
//   [G_ITEM_POTION, 2],
//   // [G_ITEM_ARROW, 10],
//   G_ITEM_KEY,
// ];
// const G_CHEST_LVL3 = [G_ITEM_MAGIC_SWORD, [G_ITEM_SCROLL_EVISCERATE, 3]];

// const hp = G_createStats;

// // sprite index, lvl, name, Stats, behavior
// type EnemyDefinition = [number, number, string, Stats, Behavior];
// const G_ENEMY_MINOR_GOLEM: EnemyDefinition = [
//   2,
//   1,
//   'mG',
//   hp(6),
//   G_BEHAVIOR_RAND,
// ];
// const G_ENEMY_GOLEM: EnemyDefinition = [4, 1, 'g', hp(14), G_BEHAVIOR_RAND];
// const G_ENEMY_CASTER: EnemyDefinition = [6, 1, 'C', hp(17), G_BEHAVIOR_RAND];
// // const G_ENEMY_ARCHER: EnemyDefinition = [
// //   8,
// //   1,
// //   'Archer',
// //   hp(21),
// //   G_BEHAVIOR_RAND,
// // ];
// const G_ENEMY_MAJOR_GOLEM: EnemyDefinition = [
//   10,
//   1,
//   'G',
//   hp(32),
//   G_BEHAVIOR_RAND,
// ];
// // const G_ENEMY_MERCHANT: EnemyDefinition = [
// //   12,
// //   1,
// //   'Merchant',
// //   hp(10),
// //   G_BEHAVIOR_RAND,
// // ];
// // const G_ENEMY_LORD: EnemyDefinition = [12, 1, 'Lord', hp(100), G_BEHAVIOR_RAND];

// // enemy, min amount, max amount, spawn area rect size (in tiles)
// type SpawnDefinition = [EnemyDefinition, number, number, number, Item];
// const G_SPAWN_LVL1: SpawnDefinition[] = [
//   [G_ENEMY_MINOR_GOLEM, 4, 6, 12, G_ITEM_KNIFE],
//   [G_ENEMY_GOLEM, 4, 6, 10, G_ITEM_KNIFE],
// ];
// const G_SPAWN_LVL2: SpawnDefinition[] = [
//   [G_ENEMY_MINOR_GOLEM, 0, 2, 12, G_ITEM_SWORD],
//   [G_ENEMY_GOLEM, 2, 6, 10, G_ITEM_KNIFE],
//   [G_ENEMY_CASTER, 1, 4, 4, G_ITEM_FINE_SWORD],
//   // [G_ENEMY_ARCHER, 1, 4, 12, G_ITEM_FINE_SWORD],
//   [G_ENEMY_MAJOR_GOLEM, 1, 2, 10, G_ITEM_SWORD],
// ];
// const G_SPAWN_LVL3: SpawnDefinition[] = [
//   [G_ENEMY_GOLEM, 0, 2, 12, G_ITEM_SWORD],
//   [G_ENEMY_CASTER, 2, 5, 10, G_ITEM_FINE_SWORD],
//   // [G_ENEMY_ARCHER, 2, 5, 12, G_ITEM_FINE_SWORD],
//   [G_ENEMY_MAJOR_GOLEM, 8, 10, 10, G_ITEM_SWORD],
// ];

// // const G_SPAWN_BOSS: SpawnDefinition[] = [
// //   [G_ENEMY_LORD, 0, 2, 12, G_ITEM_FINE_SWORD],
// // ];
