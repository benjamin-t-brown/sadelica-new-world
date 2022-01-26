import { Rect } from 'utils';
import { actorGetPosition } from './actor';
import { Player } from './player';
import { getRoomSize } from './room';
import { World } from './world';

let currentPlayer: Player | null = null;
export const getCurrentPlayer = (): Player => currentPlayer as Player;
export const setCurrentPlayer = (p: Player): void => {
  currentPlayer = p;
};

let currentWorld: World | null = null;
export const getCurrentWorld = (): World => currentWorld as World;
export const setCurrentWorld = (w: World) => (currentWorld = w);

export type DmgMinMax = [number, number];

export const getCamera = (world: World): Rect => {
  const player = getCurrentPlayer();
  const actor = player.leader;
  const cameraViewSize = 17;
  const roomSize = getRoomSize();
  const [x, y] = actorGetPosition(actor);
  const camera: Rect = [
    x - Math.floor(cameraViewSize / 2),
    y - Math.floor(cameraViewSize / 2),
    cameraViewSize,
    cameraViewSize,
  ];
  // if (camera[0] < 0) {
  //   camera[0] = 0;
  // } else if (camera[0] + camera[2] >= roomSize) {
  //   camera[0] = roomSize - camera[2];
  // }
  // if (camera[1] < 0) {
  //   camera[1] = 0;
  // } else if (camera[1] + camera[3] >= roomSize) {
  //   camera[1] = roomSize - camera[3];
  // }
  return camera;
};

let scale = 3;
export const getScale = () => scale;
export const setScale = (s: number) => (scale = s);

let inputDisabled = false;
export const isInputDisabled = () => inputDisabled;
export const setInputDisabled = (b: boolean) => (inputDisabled = b);
