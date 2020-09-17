/*
global
G_model_worldGetCurrentRoom
G_model_actorGetPosition
G_utils_pointRectCollides
*/

// wx, wy, actor, gold
// type Player = [number, number, Actor, number];
interface Player {
  wx: number;
  wy: number;
  actor: Actor;
  gold: number;
}

const G_model_playerGetActor = (player: Player): Actor => {
  return player.actor;
};

const G_model_playerGetWorldPosition = (player: Player): [number, number] => {
  return [player.wx, player.wy];
};

const G_model_playerGetGold = (player: Player): number => {
  return player.gold;
};

const G_model_playerModifyGold = (player: Player, gold: number) => {
  player.gold += gold;
};

const G_model_playerSetWorldPosition = (
  player: Player,
  wx: number,
  wy: number
) => {
  player.wx = wx;
  player.wy = wy;
};
