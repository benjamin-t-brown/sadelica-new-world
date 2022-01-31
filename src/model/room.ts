import { Actor, actorGetPosition } from './actor';
import { getCurrentPlayer } from './generics';
import { Item } from './item';
import { Particle } from './particle';
import { Tile, tileSetHighlighted, tileSetId } from './tile';

// sprite, id, x, y, highlighted
export type ItemAt = [Item | [Item, number], number, number];

export interface Room {
  tiles: Tile[];
  visMap: number[][];
  explMap: number[][];
  particles: Particle[];
  actors: Actor[];
  items: ItemAt[];
  lvl: number;
  id: number;
  mod: string;
}

export const getRoomSize = () => 64;

export const createRoom = (id: number): Room => {
  const roomSize = getRoomSize();

  const room: Room = {
    lvl: 0,
    id,
    tiles: [] as Tile[],
    particles: [] as Particle[],
    visMap: createEmptyVisMap([roomSize, roomSize]),
    explMap: createEmptyVisMap([roomSize, roomSize]),
    items: [] as ItemAt[],
    actors: [] as Actor[],
    mod: '',
  };

  return room;
};

export const roomGetActorByName = (room: Room, name: string) => {
  for (let i = 0; i < room.actors.length; i++) {
    const act = room.actors[i];
    if (act.name === name) {
      return act;
    }
  }
  return null;
};

export const roomGetActorAt = (
  room: Room,
  x: number,
  y: number
): Actor | null => {
  for (let i = 0; i < room.actors.length; i++) {
    const actor = room.actors[i];
    const [x2, y2] = actorGetPosition(actor);
    if (x2 === x && y2 === y) {
      return actor;
    }
  }
  const player = getCurrentPlayer();
  if (player) {
    const leader = player.leader;
    const [x2, y2] = actorGetPosition(leader);
    if (x2 === x && y2 === y) {
      return leader;
    }
  }
  return null;
};

export const roomAddParticle = (room: Room, particle: Particle) => {
  room.particles.push(particle);
};

export const roomGetTileAt = (
  room: Room,
  x: number,
  y: number
): Tile | null => {
  const sz = getRoomSize();
  if (x < 0 || x >= sz) {
    return null;
  }
  if (y < 0 || y >= sz) {
    return null;
  }
  return room.tiles[y * getRoomSize() + x];
};
export const roomSetTileAt = (room: Room, x: number, y: number, id: number) => {
  const tile = roomGetTileAt(room, x, y);
  tileSetId(tile, id);
};

export const roomAddItemAt = (room: Room, item: Item, x: number, y: number) => {
  room.items.push([item, x, y]);
};
export const roomGetItemsAt = (room: Room, x: number, y: number): ItemAt[] => {
  const ret: ItemAt[] = [];
  for (let i = 0; i < room.items.length; i++) {
    const [, xi, yi] = room.items[i];
    if (x === xi && y === yi) {
      ret.push(room.items[i]);
    }
  }
  return ret;
};
export const roomRemoveItemAt = (
  room: Room,
  itemName: string,
  x: number,
  y: number
): boolean => {
  const { items } = room;
  for (let i = 0; i < items.length; i++) {
    const [item, iX, iY] = items[i];
    if (
      x === iX &&
      y === iY &&
      itemName === ((item as Item).name ?? item[0].name)
    ) {
      items.splice(i, 1);
      return true;
    }
  }
  return false;
};

export const roomGetSurroundingItemsAt = (
  room: Room,
  actor: Actor
): ItemAt[] => {
  let ret: ItemAt[] = [];
  const [x, y] = actorGetPosition(actor);

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      ret = ret.concat(roomGetItemsAt(room, x + j, y + i));
    }
  }
  return ret;
};

export const roomGetSurroundingActorsAt = (
  room: Room,
  actor: Actor
): Actor[] => {
  let ret: Actor[] = [];
  const [x, y] = actorGetPosition(actor);

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const act = roomGetActorAt(room, x + j, y + i);
      if (act && act !== actor) {
        ret = ret.concat([act]);
      }
    }
  }
  return ret;
};

export const roomGetInteractableActorsAt = (room: Room, actor: Actor) => {
  const actors = roomGetSurroundingActorsAt(room, actor);
  const [x, y] = actorGetPosition(actor);
  [
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
  ].forEach(([xOff, yOff]) => {
    const act = roomGetActorAt(room, x + xOff, y + yOff);
    if (act && act !== actor) {
      actors.push(act);
    }
  });
  return actors;
};

export const roomPosIsVisible = (room: Room, x: number, y: number): boolean => {
  return !!room.visMap[y][x];
};
export const roomPosIsExplored = (
  room: Room,
  x: number,
  y: number
): boolean => {
  return !!room.explMap[y][x];
};

export const setHighlightedTiles = (
  tilePositions: [number, number][],
  room: Room
) => {
  unsetHighlightedTiles(room);
  for (let i = 0; i < tilePositions.length; i++) {
    const [x, y] = tilePositions[i];
    tileSetHighlighted(roomGetTileAt(room, x, y), true);
  }
};

export const unsetHighlightedTiles = (room: Room) => {
  for (let i = 0; i < room.tiles.length; i++) {
    tileSetHighlighted(room.tiles[i], false);
  }
};

export const createEmptyVisMap = (dimensions: number[]): number[][] => {
  const array: number[][] = [];
  for (let i = 0; i < dimensions[0]; ++i) {
    array.push(
      dimensions.length === 1
        ? 0
        : (createEmptyVisMap(dimensions.slice(1)) as any)
    );
  }
  return array;
};

export const setExploredMap = (
  origExploredMap: number[][],
  visMap: number[][]
) => {
  for (let i = 0; i < visMap.length; i++) {
    for (let j = 0; j < visMap[0].length; j++) {
      origExploredMap[i][j] = origExploredMap[i][j] || visMap[i][j];
    }
  }
};
