import { createEmptyVisMap } from 'controller/visibility';
import {
  TERRAIN_CAVE_SPRITES,
  TERRAIN_GRASS_SPRITES,
  TERRAIN_SPRITES,
} from 'db/sprite-mapping';
import { randInArr, to1d, to4d } from 'utils';
import { drawSprite } from 'view/draw';
import { createCanvas } from './canvas';
import { Particle } from './particle';
import { createRoom, getRoomSize, Room } from './room';
import { getTileSize, Tile } from './tile';
import { getIfExists as getActorTemplate } from 'db/actors';
import { getIfExists as getTiledMap } from 'db/map';
import { TiledLayerTilelayer, TiledLayerObjectgroup } from 'tiled-types';
import { actorSetPosition, createActorFromTemplate } from './actor';
import { getCurrentPlayer } from './generics';

export interface World {
  name: string;
  rooms: Room[];
  particles: Particle[];
  end: number[];
}

export const getWorldSize = () => 4;

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

const randMod = () => randInArr(['', '_r1', '_r2', '_r3', '_f']);

const getRow = (i: number, room: Room): Tile[] => {
  const roomSize = getRoomSize();
  const ind = i * roomSize;
  return room.tiles.slice(ind, ind + roomSize);
};
const getColumn = (j: number, room: Room): Tile[] => {
  const ret: Tile[] = [];
  const roomSize = getRoomSize();
  for (let i = 0; i < getRoomSize(); i++) {
    ret.push(room.tiles[j + i * roomSize]);
  }
  return ret;
};

const setTileId = (id: number, tile: Tile) => {
  tile[0] = 'terrain1_' + id;
  tile[1] = id;
};

export const worldGetCurrentRoom = (world: World): Room => {
  const player = getCurrentPlayer();
  const [wx, wy] = [player.worldX, player.worldY];
  const ws = getWorldSize();
  return world.rooms[wy * ws + wx];
};

export const worldGetRoomAt = (
  wx: number,
  wy: number,
  world: World
): Room | null => {
  const worldSize = getWorldSize();
  if (wx < 0 || wy < 0 || wx >= worldSize || wy >= worldSize) {
    return null;
  }
  return world.rooms[wy * worldSize + wx] || null;
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
//   const worldSize = getWorldSize();
//   const [x, y] = to2d(world.rooms.indexOf(room), worldSize);
//   return [
//     getRoomAt(x, y - 1, world),
//     getRoomAt(x, y + 1, world),
//     getRoomAt(x - 1, y, world),
//     getRoomAt(x + 1, y, world),
//   ] as Room[];
// };

const colors = {};
for (let i = 0; i < 256; i++) {
  colors[`${i}${i}${i}`] = i;
}

export const createWorld = (mapName: string): World => {
  // create world and player
  // const playerActor: Actor = [
  //   'player',
  //   'actors1',
  //   0, // spriteId
  //   0, // x
  //   0, // y
  //   createStats(100),
  //   [
  //     ITEM_RUSTY_KNIFE,
  //     ITEM_RUSTY_SWORD,
  //     ITEM_RUSTY_BOW,
  //     ITEM_RUSTY_SPEAR,
  //     ITEM_POTION_USS,
  //     // ITEM_SWORD,
  //     // ITEM_MAGIC_SWORD,
  //     // [ITEM_ARROW, 10],
  //     [ITEM_POTION_HEALTH, 3],
  //     // ITEM_SCROLL_FLAME,
  //     // ITEM_BOW,
  //     // ITEM_SCROLL_FIREBALL,
  //     // ITEM_FINE_SWORD,
  //     // ITEM_KEY,
  //   ] as GenericItem[],
  //   0,
  //   0,
  //   true,
  //   false,
  //   0,
  //   0,
  //   0,
  //   '',
  //   '',
  //   '',
  //   0,
  // ];
  // const player: Player = {
  //   wx: 0,
  //   wy: 0,
  //   actor: playerActor,
  //   gold: 0,
  // };

  // const [worldX, worldY, localX, localY] = to4d(87, 226, getRoomSize());
  // playerSetWorldPosition(player, worldX, worldY);
  // actorSetPosition(playerActor, localX, localY);

  const world = {
    name: '',
    rooms: [] as Room[],
    particles: [] as Particle[],
    end: [] as number[],
  };

  // setup sizes
  const roomSize = getRoomSize();
  const numRooms = 16;

  // create initial rooms
  for (let i = 0; i < numRooms; i++) {
    const room = createRoom(i);
    world.rooms.push(room);
  }

  // create starting room and ending room
  const startingRoom = world.rooms[0];
  startingRoom.lvl = 1;

  const tiledMap = getTiledMap(mapName);
  if (!tiledMap) {
    throw new Error(
      'Cannot create world, no tiled map exists with name: ' + mapName
    );
  }

  const getRoomSlice = (data: number[], worldX: number, worldY: number) => {
    const worldSize = getWorldSize(); // 16
    const roomSize = getRoomSize(); // 64
    const subData: number[] = [];
    for (let i = 0; i < roomSize; i++) {
      if (i === 0) {
        console.log(
          'push',
          worldX * roomSize +
            worldY * roomSize * roomSize * worldSize +
            roomSize * worldSize * i
        );
      }
      for (let j = 0; j < roomSize; j++) {
        subData.push(
          data[
            worldX * roomSize +
              worldY * roomSize * roomSize * worldSize +
              roomSize * worldSize * i +
              j
          ]
        );
      }
    }
    return subData;
  };

  for (let i = 0; i < 16; i++) {
    const { tiles } = world.rooms[i];
    const worldX = i % 4;
    const worldY = Math.floor(i / 4);

    const map: TiledLayerTilelayer = tiledMap.layers[0] as any;

    const data = getRoomSlice(map.data as number[], worldX, worldY);
    console.log('get room slice', data, worldX, worldY);
    let ctr = 0;
    for (let j = 0; j < data.length; j++) {
      let ind = data[j] - 1;
      const tx = ctr % roomSize;
      const ty = Math.floor(ctr / roomSize);
      const tInd = to1d(tx, ty, roomSize);

      if (ind === TERRAIN_SPRITES.Grass) {
        ind = randInArr(TERRAIN_GRASS_SPRITES);
      } else if (ind === TERRAIN_SPRITES.CaveFloor) {
        ind = randInArr(TERRAIN_CAVE_SPRITES);
      }
      tiles[tInd] = ['terrain1_' + ind, ind, tx, ty, false];
      ctr++;
    }
  }

  const objectLayer: TiledLayerObjectgroup = tiledMap.layers[1] as any;
  for (let j = 0; j < objectLayer.objects.length; j++) {
    const obj = objectLayer.objects[j];
    const actorTemplate = getActorTemplate(obj.name);
    if (actorTemplate) {
      const actor = createActorFromTemplate(actorTemplate);
      const [worldX, worldY, x, y] = to4d(
        obj.x / getTileSize(),
        obj.y / getTileSize(),
        64
      );
      console.log(
        'put actor in room',
        obj.name,
        obj.x / getTileSize(),
        obj.y / getTileSize(),
        x,
        y,
        worldX,
        worldY
      );
      const { actors } = world.rooms[worldY * getWorldSize() + worldX];
      actorSetPosition(actor, x, y);
      actors.push(actor);
    } else {
      console.error('No actor template exists with name: ' + obj.name, obj);
    }
  }

  return world;
};
