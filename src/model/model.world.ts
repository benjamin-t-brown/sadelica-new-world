/*
global
G_model_playerGetWorldPosition
G_model_getWorldSize
*/

interface World {
  rooms: Room[];
  player: Player;
  end: number[];
}

const G_model_worldGetCurrentRoom = (world: World): Room => {
  const player = world.player;
  const [wx, wy] = G_model_playerGetWorldPosition(player);
  const ws = G_model_getWorldSize();
  return world.rooms[wy * ws + wx];
};

const G_model_worldGetRoomAt = (
  wx: number,
  wy: number,
  world: World
): Room | null => {
  const worldSize = G_model_getWorldSize();
  if (wx < 0 || wy < 0 || wx >= worldSize || wy >= worldSize) {
    return null;
  }
  return world.rooms[wy * worldSize + wx] || null;
};
