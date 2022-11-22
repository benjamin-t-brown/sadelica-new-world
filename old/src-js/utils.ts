import {
  Direction,
  DOWN,
  DOWN_LEFT,
  DOWN_RIGHT,
  LEFT,
  RIGHT,
  UP,
  UP_LEFT,
  UP_RIGHT,
} from 'controller/move';

export enum TargetArea {
  SINGLE = '1x1',
  THREE_BY_THREE = '3x3',
}

export type Rect = [number, number, number, number];

export const getTargets = (
  x: number,
  y: number,
  type: TargetArea
): [number, number][] => {
  if (type === TargetArea.THREE_BY_THREE) {
    return [[x, y]];
  } else {
    const ret: [number, number][] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        ret.push([x + j, y + i]);
      }
    }
    return ret;
  }
};

export const randInRange = (n1: number, n2: number): number => {
  return Math.floor(Math.random() * (n2 - n1) + n1);
};
export const randInArr = (arr: any[]) => arr[randInRange(0, arr.length)];

export const cycleItemInArr = (i: number, arr: any[], dir: -1 | 1): number => {
  const nextI = i + dir;
  if (nextI < 0 || nextI >= arr.length) {
    return i;
  }
  const item = arr[i];
  arr[i] = arr[i + dir];
  arr[i + dir] = item;
  return i + dir;
};

export const pointRectCollides = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean => {
  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
};

export const waitMs = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

export const to4d = (xGlobal: number, yGlobal: number, innerSize: number) => {
  const xWorld = Math.floor(xGlobal / innerSize);
  const yWorld = Math.floor(yGlobal / innerSize);
  const xLocal = xGlobal % innerSize;
  const yLocal = (yGlobal % innerSize) - 1;
  return [xWorld, yWorld, xLocal, yLocal];
};

export const to2d = (i: number, width: number) => {
  return [i % width, Math.floor(i / width)];
};
export const to1d = (x: number, y: number, width: number) => {
  return y * width + x;
};

export const randomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const getAngleTowards = (
  point1: [number, number],
  point2: [number, number]
) => {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  const lenY = y2 - y1;
  const lenX = x2 - x1;
  const hyp = Math.sqrt(lenX * lenX + lenY * lenY);
  let ret = 0;
  if (y2 >= y1 && x2 >= x1) {
    ret = (Math.asin(lenY / hyp) * 180) / Math.PI + 90;
  } else if (y2 >= y1 && x2 < x1) {
    ret = (Math.asin(lenY / -hyp) * 180) / Math.PI - 90;
  } else if (y2 < y1 && x2 > x1) {
    ret = (Math.asin(lenY / hyp) * 180) / Math.PI + 90;
  } else {
    ret = (Math.asin(-lenY / hyp) * 180) / Math.PI - 90;
  }
  if (ret >= 360) {
    ret = 360 - ret;
  }
  if (ret < 0) {
    ret = 360 + ret;
  }
  return ret;
};

export const getDirectionFromAngle = (angle: number): Direction => {
  if (angle > 360 - 22.5 || angle < 22.5) {
    return UP;
  }

  const facings: Direction[] = [
    UP,
    UP_RIGHT,
    RIGHT,
    DOWN_RIGHT,
    DOWN,
    DOWN_LEFT,
    LEFT,
    UP_LEFT,
  ];

  for (let i = 1; i < 8; i++) {
    if (angle >= i * 45 - 22.5 && angle <= (i + 1) * 45 - 22.5) {
      return facings[i];
    }
  }

  return UP;
};

export const calculateDistance = (a: [number, number], b: [number, number]) => {
  const [x1, y1] = a;
  const [x2, y2] = b;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
