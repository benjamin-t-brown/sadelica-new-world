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
G_SPAWN_LVL1
G_SPAWN_LVL2
G_SPAWN_LVL3
G_ITEM_KNIFE
G_ITEM_CLUB
G_BEHAVIOR_NONE
G_ITEM_POTION
G_ACTORS_MAP
hp
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

const colors = {
  5011569: 0,
  634050: 1,
  255255255: 2,
  25523198: 3,
  256163: 4,
  357193: 5,
  '000': 6,
  79103129: 7,
  606060: 8,
  803030: 9,
  18411180: 10,
  4132209: 11,
  2295968: 12,
  44232244: 13,
  25114643: 14,
  175191210: 15,
};

const G_model_createWorld = (spritePrefix: string): World => {
  // create world and player
  const playerActor: Actor = [
    'player',
    'actors1',
    0, // id
    23, // x
    50, // y
    hp(100),
    [
      G_ITEM_KNIFE,
      // G_ITEM_SWORD,
      // G_ITEM_MAGIC_SWORD,
      // [G_ITEM_ARROW, 10],
      [G_ITEM_POTION, 3],
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
  ];
  const player: Player = {
    wx: 0,
    wy: 0,
    actor: playerActor,
    gold: 0,
  };
  const world = {
    rooms: [] as Room[],
    p: [] as Particle[],
    player,
    end: [] as number[],
  };

  // setup sizes
  const worldSize = G_model_getWorldSize();
  const roomSize = G_model_getRoomSize();
  const numRooms = worldSize * worldSize;

  // create initial rooms
  for (let i = 0; i < numRooms; i++) {
    const room = {
      lvl: 0,
      id: i,
      tiles: [] as Tile[],
      p: [] as Particle[],
      visMap: G_controller_createEmptyVisMap([roomSize, roomSize]),
      explMap: G_controller_createEmptyVisMap([roomSize, roomSize]),
      items: [] as ItemAt[],
      a: [] as Actor[],
      mod: '',
    };
    world.rooms.push(room);
  }

  // create starting room and ending room
  const startingRoom = world.rooms[0];
  startingRoom.lvl = 1;
  // startingRoom.mod = randMod();
  G_model_playerSetWorldPosition(player, 0, 0);

  // read room data from image sprites and set the tiles accordingly
  const pngSize = 64;
  for (let i = 0; i < 1; i++) {
    const { tiles, mod } = world.rooms[i];
    const [, ctx] = G_model_createCanvas(pngSize, pngSize);
    const worldX = i % 8;
    const worldY = Math.floor(i / 8);
    const characters: Actor[] = [];

    const sprite = spritePrefix + '_' + i + mod;
    console.log('draw map sprite', sprite);
    G_view_drawSprite(sprite, 0, 0, 1, ctx);
    const { data } = ctx.getImageData(0, 0, pngSize, pngSize);
    let ctr = 0;
    for (let j = 0; j < data.length; j += 4) {
      const colorKey = `${data[j + 0]}${data[j + 1]}${data[j + 2]}`;
      const ind = colors[colorKey] || 0;
      const tx = ctr % pngSize;
      const ty = Math.floor(ctr / pngSize);
      const tInd = to1d(tx, ty, roomSize);
      tiles[tInd] = ['terrain1_' + ind, ind, tx, ty, false];
      const chTemplate = G_ACTORS_MAP[[worldX, worldY, tx, ty].join(',')];
      if (chTemplate) {
        characters.push(G_model_createActorFromChTemplate(tx, ty, chTemplate));
      }
      ctr++;
    }
  }

  return world;
};

// const colorKey = `${data[j + 0]}${data[j + 1]}${data[j + 2]}`;
// let ind = colors[colorKey] || 0;
// const tx = ctr % pngSize;
// const ty = Math.floor(ctr / pngSize);

// let ch: Character | null = null;

// const chTemplate = G_ACTORS_MAP[[worldX, worldY, tx, ty].join(',')];
// if (chTemplate) {
//   ch = G_model_createCharacterFromTemplate(chTemplate);
// }
