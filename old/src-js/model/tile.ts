import {
  TERRAIN_DOOR_SPRITES,
  TERRAIN_SIGHT_BLOCKING_SPRITES,
  TERRAIN_WALL_SPRITES,
} from 'db/sprite-mapping';

export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;
export const SCALE = 2;

export const getTileSize = () => TILE_WIDTH;

// sprite, id, x, y, highlighted
export type Tile = [string, number, number, number, boolean];

export const tileGetId = (tile: Tile | null) => {
  return tile?.[1] || 0;
};

export const tileSetId = (tile: Tile | null, id: number) => {
  if (tile) {
    tile[0] = 'img/terrain1_' + id;
    tile[1] = id;
  }
};

export const tileIsPassable = (tile: Tile | null): boolean => {
  return !TERRAIN_WALL_SPRITES.includes(tileGetId(tile));
};

export const tileBlocksSight = (tile: Tile | null): boolean => {
  return TERRAIN_SIGHT_BLOCKING_SPRITES.includes(tileGetId(tile));
};

export const tileIsDoor = (tile: Tile | null): boolean => {
  return TERRAIN_DOOR_SPRITES.includes(tileGetId(tile));
};

export const tileOpenDoor = (tile: Tile | null) => {
  const id = tileGetId(tile);
  tileSetId(tile, id + 1);
};

export const tileCloseDoor = (tile: Tile | null) => {
  const id = tileGetId(tile);
  tileSetId(tile, id - 1);
};

export const tileIsHighlighted = (tile: Tile | null): boolean => {
  return !!tile?.[4];
};

export const tileSetHighlighted = (tile: Tile | null, v: boolean) => {
  if (tile) {
    tile[4] = v;
  }
};
