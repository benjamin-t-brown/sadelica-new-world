/*
global
G_view_drawSprite
G_controller_createEmptyVisMap
G_model_createCanvas
G_model_getWorldSize
G_model_getRoomSize
G_model_getRoomAt
G_model_actorGetStats
G_model_actorSetPosition
G_model_createActorFromChTemplate
G_model_playerSetWorldPosition
G_model_roomGetTileAt
G_model_roomGetActorAt
G_model_tileIsPassable
G_utils_randInRange
G_utils_randInArr
G_utils_to4d
G_SPAWN_LVL1
G_SPAWN_LVL2
G_SPAWN_LVL3
G_ITEM_RUSTY_KNIFE
G_ITEM_RUSTY_SWORD
G_ITEM_RUSTY_BOW
G_ITEM_RUSTY_SPEAR
G_ITEM_POTION_HEALTH
G_BEHAVIOR_NONE
G_ITEM_POTION
G_ACTORS_MAP
G_TERRAIN_SPRITES
G_TERRAIN_GRASS_SPRITES
G_TERRAIN_CAVE_SPRITES
G_createStats
G_controller_dropItem
*/

//game start sound?
// with (new AudioContext())
//   [3, 4, 6, 7, 10, 15, 22].map((v, i) => {
//     with (createOscillator())
//       v &&
//         start(
//           (e = [7, 6, 5, 4, 3, 2, 1][i] / 10),
//           connect(destination),
//           (frequency.value = 988 / 1.06 ** v),type="triangle"
//         ) + stop(e + 0.12);
//   });
const to2d = (i: number, width: number) => {
  return [i % width, Math.floor(i / width)];
};
const to1d = (x: number, y: number, width: number) => {
  return y * width + x;
};

const randMod = () => G_utils_randInArr(['', '_r1', '_r2', '_r3', '_f']);

const getRow = (i: number, room: Room): Tile[] => {
  const roomSize = G_model_getRoomSize();
  const ind = i * roomSize;
  return room.tiles.slice(ind, ind + roomSize);
};
const getColumn = (j: number, room: Room): Tile[] => {
  const ret: Tile[] = [];
  const roomSize = G_model_getRoomSize();
  for (let i = 0; i < G_model_getRoomSize(); i++) {
    ret.push(room.tiles[j + i * roomSize]);
  }
  return ret;
};

const setTileId = (id: number, tile: Tile) => {
  tile[0] = 'terrain1_' + id;
  tile[1] = id;
};

// const getAllRoomsOfLvl = (lvl: number, world: World): Room[] => {
//   return world.rooms.filter(r => r.lvl === lvl);
// };

// const getAllAdjacentRooms = (room: Room, world: World, lvl: number): Room[] => {
//   const adjacentRooms: Room[] = [];
//   const roomsToCheck: Room[] = [room];
//   const roomsChecked: Room[] = [];

//   const checkRoom = (r: Room | null) => {
//     if (r) {
//       if (r.lvl === lvl && !adjacentRooms.includes(r)) {
//         adjacentRooms.push(r);
//       } else if (r.lvl === room.lvl && !roomsChecked.includes(r)) {
//         roomsToCheck.push(r);
//       }
//     }
//   };

//   do {
//     const r = roomsToCheck.shift() as Room;
//     roomsChecked.push(r);
//     getAdjacentRooms(r, world).forEach(checkRoom);
//   } while (roomsToCheck.length);

//   return adjacentRooms;
// };

// const getAdjacentRooms = (room: Room, world: World): Room[] => {
//   const worldSize = G_model_getWorldSize();
//   const [x, y] = to2d(world.rooms.indexOf(room), worldSize);
//   return [
//     G_model_getRoomAt(x, y - 1, world),
//     G_model_getRoomAt(x, y + 1, world),
//     G_model_getRoomAt(x - 1, y, world),
//     G_model_getRoomAt(x + 1, y, world),
//   ] as Room[];
// };

const colors = {};
for (let i = 0; i < 256; i++) {
  colors[`${i}${i}${i}`] = i;
}

const G_model_createWorld = (spritePrefix: string): World => {
  // create world and player
  const playerActor: Actor = [
    'player',
    'actors1',
    0, // spriteId
    0, // x
    0, // y
    G_createStats(100),
    [
      G_ITEM_RUSTY_KNIFE,
      G_ITEM_RUSTY_SWORD,
      G_ITEM_RUSTY_BOW,
      G_ITEM_RUSTY_SPEAR,
      // G_ITEM_SWORD,
      // G_ITEM_MAGIC_SWORD,
      // [G_ITEM_ARROW, 10],
      [G_ITEM_POTION_HEALTH, 3],
      // G_ITEM_SCROLL_FLAME,
      // G_ITEM_BOW,
      // G_ITEM_SCROLL_FIREBALL,
      // G_ITEM_FINE_SWORD,
      // G_ITEM_KEY,
    ] as GenericItem[],
    0,
    0,
    true,
    false,
    0,
    0,
    0,
    '',
    '',
    '',
    0,
  ];
  const player: Player = {
    wx: 0,
    wy: 0,
    actor: playerActor,
    gold: 0,
  };

  const [worldX, worldY, localX, localY] = G_utils_to4d(
    87,
    226,
    G_model_getRoomSize()
  );
  // const [worldX, worldY, localX, localY] = G_utils_to4d(
  //   10,
  //   10,
  //   G_model_getRoomSize()
  // );
  G_model_playerSetWorldPosition(player, worldX, worldY);
  G_model_actorSetPosition(playerActor, localX, localY);

  const world = {
    rooms: [] as Room[],
    p: [] as Particle[],
    player,
    end: [] as number[],
  };

  // setup sizes
  const roomSize = G_model_getRoomSize();
  const numRooms = 16;

  // create initial rooms
  for (let i = 0; i < numRooms; i++) {
    const room: Room = {
      lvl: 0,
      id: i,
      tiles: [] as Tile[],
      p: [] as Particle[],
      visMap: G_controller_createEmptyVisMap([roomSize, roomSize]),
      explMap: G_controller_createEmptyVisMap([roomSize, roomSize]),
      items: [] as ItemAt[],
      actors: [] as Actor[],
      mod: '',
    };
    world.rooms.push(room);
  }

  // create starting room and ending room
  const startingRoom = world.rooms[0];
  startingRoom.lvl = 1;
  // startingRoom.mod = randMod();

  // read room data from image sprites and set the tiles accordingly
  const pngSize = 64; // size of a room in pixels
  for (let i = 0; i < 16; i++) {
    const { tiles, mod, actors } = world.rooms[i];
    const [, ctx] = G_model_createCanvas(pngSize, pngSize);
    const worldX = i % 4;
    const worldY = Math.floor(i / 4);

    const sprite = spritePrefix + '_' + i + mod;
    G_view_drawSprite(sprite, 0, 0, 1, ctx);
    const { data } = ctx.getImageData(0, 0, pngSize, pngSize);
    let ctr = 0;
    for (let j = 0; j < data.length; j += 4) {
      const colorKey = `${data[j + 0]}${data[j + 1]}${data[j + 2]}`;
      let ind = colors[colorKey] || 0;
      const tx = ctr % pngSize;
      const ty = Math.floor(ctr / pngSize);
      const tInd = to1d(tx, ty, roomSize);

      if (ind === G_TERRAIN_SPRITES.Grass) {
        ind = G_utils_randInArr(G_TERRAIN_GRASS_SPRITES);
      } else if (ind === G_TERRAIN_SPRITES.CaveFloor) {
        ind = G_utils_randInArr(G_TERRAIN_CAVE_SPRITES);
      }
      tiles[tInd] = ['terrain1_' + ind, ind, tx, ty, false];
      const key = [worldX, worldY, tx, ty].join(',');
      const chTemplates = G_ACTORS_MAP[key];
      // console.log('check key', chTemplate, key);
      if (chTemplates) {
        chTemplates.forEach((chTemplate: CharacterDefinition) => {
          const act = G_model_createActorFromChTemplate(tx, ty, chTemplate);
          actors.push(act);
        });
      }
      ctr++;
    }
  }

  return world;
};
