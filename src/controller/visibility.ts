import { getRoomSize, Room, roomGetTileAt } from 'model/room';
import { tileBlocksSight } from 'model/tile';

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

export const setVisibility = (chx: number, chy: number, room: Room) => {
  const roomSize = getRoomSize();
  const visMap = createEmptyVisMap([roomSize, roomSize]);

  const blocksSight = (x: number, y: number) => {
    return tileBlocksSight(roomGetTileAt(room, x, y));
  };

  const castRay = (x1: number, y1: number, x2: number, y2: number) => {
    let visibility = 1;

    const dx = Math.abs(x2 - x1),
      sx = x1 < x2 ? 1 : -1;
    const dy = Math.abs(y2 - y1),
      sy = y1 < y2 ? 1 : -1;
    let err = (dx > dy ? dx : -dy) / 2;

    let ctr = 0;
    /*eslint-disable-line*/ while (1) {
      ctr++;
      if (ctr > 10) {
        break;
      }
      const checkX = x1;
      const checkY = y1;

      if (
        visMap[checkY] === undefined ||
        visMap[checkY][checkX] === undefined
      ) {
        const e2 = err;
        if (e2 > -dx) {
          err -= dy;
          x1 += sx;
        }
        if (e2 < dy) {
          err += dx;
          y1 += sy;
        }
        continue;
      }
      if (visMap[checkY][checkX] === 0 || visibility === 1) {
        visMap[checkY][checkX] = visibility;
      }

      if (blocksSight(checkX, checkY)) {
        visibility = 0;
      }
      if (x1 === x2 && y1 === y2) {
        break;
      }
      const e2 = err;
      if (e2 > -dx) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dy) {
        err += dx;
        y1 += sy;
      }
    }
  };

  const castRayInBox = (boxSize: number) => {
    for (let i = -boxSize; i <= boxSize; i++) {
      castRay(chx, chy, chx + i, chy + boxSize); // top side of box
      castRay(chx, chy, chx + i, chy - boxSize); // bottom side of box
      castRay(chx, chy, chx + boxSize, chy + i); // right side of box
      castRay(chx, chy, chx - boxSize, chy + i); // left side of box
    }
  };
  castRayInBox(8);
  castRayInBox(7);
  castRayInBox(6);
  castRayInBox(5);

  visMap[chy][chx] = 1;

  setExploredMap(room.explMap, visMap);
  room.visMap = visMap;
};
