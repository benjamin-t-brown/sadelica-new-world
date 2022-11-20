import {
  Actor,
  actorGetAllegiance,
  actorGetPosition,
  actorSetPosition,
  Facing,
} from 'model/actor';
import { getCurrentPlayer } from 'model/generics';
import { Player } from 'model/player';
import { getRoomSize, roomGetActorAt, roomGetTileAt } from 'model/room';
import { tileIsDoor, tileIsPassable, tileOpenDoor } from 'model/tile';
import { World, worldGetCurrentRoom } from 'model/world';
import { playerInputComplete, renderCurrentWorldState } from './update';

export const UP = '8';
export const DOWN = '2';
export const LEFT = '4';
export const RIGHT = '6';
export const PAUSE = '5';
export const UP_LEFT = '7';
export const UP_RIGHT = '9';
export const DOWN_LEFT = '1';
export const DOWN_RIGHT = '3';

export type Direction =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '0';

export const changeRoomIfOOb = (player: Player): boolean => {
  const actor = player.leader;
  let [px, py] = actorGetPosition(actor);
  let { worldX: wx, worldY: wy } = player;
  const origWx = wx;
  const origWy = wy;
  const roomSize = getRoomSize();
  if (px < 0) {
    wx--;
    px = roomSize - 1;
  }
  if (py < 0) {
    wy--;
    py = roomSize - 1;
  }

  if (px >= roomSize) {
    wx++;
    px = 0;
  }
  if (py >= roomSize) {
    wy++;
    py = 0;
  }

  player.worldX = wx;
  player.worldY = wy;
  actorSetPosition(actor, px, py);
  if (origWx === wx && origWy === wy) {
    return false;
  } else {
    return true;
  }
};

export const blockIfOOb = (actor: Actor) => {
  let [px, py] = actorGetPosition(actor);
  const roomSize = getRoomSize();
  if (px < 0) {
    px = 0;
  }
  if (py < 0) {
    py = 0;
  }

  if (px >= roomSize) {
    px = roomSize - 1;
  }
  if (py >= roomSize) {
    py = roomSize - 1;
  }
  actorSetPosition(actor, px, py);
};

const getNextPosition = (
  actor: Actor,
  direction: Direction,
  world: World
): [number, number, number, number, boolean] => {
  let [px, py] = actorGetPosition(actor);
  const origPx = px;
  const origPy = py;

  switch (direction) {
    case UP:
      py--;
      break;
    case DOWN:
      py++;
      break;
    case LEFT:
      px--;
      break;
    case RIGHT:
      px++;
      break;
    case UP_LEFT:
      px--;
      py--;
      break;
    case UP_RIGHT:
      px++;
      py--;
      break;
    case DOWN_LEFT:
      px--;
      py++;
      break;
    case DOWN_RIGHT:
      px++;
      py++;
  }

  const origNextPx = px;
  const origNextPy = py;
  const origPos: [number, number, number, number, boolean] = [
    origPx,
    origPy,
    origNextPx,
    origNextPy,
    false,
  ];

  const room = worldGetCurrentRoom(world);
  if (room) {
    const tile = roomGetTileAt(room, px, py);
    if (tile && tileIsDoor(tile) && getCurrentPlayer().leader === actor) {
      tileOpenDoor(tile);
      // G_view_playSound('doorOpen');
      return origPos;
    }
    if (tile && !tileIsPassable(tile)) {
      return origPos;
    }
    const act = roomGetActorAt(room, px, py);
    if (act) {
      return origPos;
    }
  }

  return [px, py, origNextPx, origNextPy, true];
};

const setFacing = (actor: Actor, x: number, y: number) => {
  const [px, py] = actorGetPosition(actor);
  const dx = px - x;
  const dy = py - y;
  if (dx > 0) {
    actor.facing = Facing.LEFT;
  } else if (dx === 0) {
    if (dy > 0) {
      actor.facing = Facing.RIGHT;
    } else {
      actor.facing = Facing.LEFT;
    }
  } else {
    actor.facing = Facing.RIGHT;
  }
};

export const movePlayer = (
  player: Player,
  direction: Direction,
  world: World
) => {
  // const directionToCompass = {
  //   [UP]: 'n',
  //   [DOWN]: 's',
  //   [LEFT]: 'w',
  //   [RIGHT]: 'e',
  //   [UP_LEFT]: 'nw',
  //   [UP_RIGHT]: 'ne',
  //   [DOWN_LEFT]: 'sw',
  //   [DOWN_RIGHT]: 'se',
  //   [PAUSE]: 'wait',
  // };

  const actor = getCurrentPlayer().leader;
  // G_model_addLog(`Move: ${directionToCompass[direction]}`);
  moveActor(actor, direction, world, {
    intentToAttack: false,
    isPlayer: true,
  });
  if (changeRoomIfOOb(player)) {
    renderCurrentWorldState(world);
  } else {
    playerInputComplete();
  }
};

interface IMoveArgs {
  intentToAttack?: boolean;
  isPlayer?: boolean;
}

const DEFAULT_MOVE_ARGS = {
  intentToAttack: false,
  isPlayer: false,
};

// returns true if the actor moved or attacked, false if the action could not be done
export const moveActor = (
  actor: Actor,
  direction: Direction,
  world: World,
  args?: IMoveArgs
): boolean => {
  const { isPlayer, intentToAttack } = {
    ...(args || {}),
    ...DEFAULT_MOVE_ARGS,
  };
  const room = worldGetCurrentRoom(world);
  const [nextPx, nextPy, origNextPx, origNextPy, moved] = getNextPosition(
    actor,
    direction,
    world
  );
  setFacing(actor, origNextPx, origNextPy);
  if (!isPlayer) {
    blockIfOOb(actor);
  }
  actorSetPosition(actor, nextPx, nextPy);
  const otherActor = roomGetActorAt(room, origNextPx, origNextPy);
  const myAllegiance = actorGetAllegiance(actor);
  if (
    intentToAttack &&
    otherActor &&
    myAllegiance !== actorGetAllegiance(otherActor)
  ) {
    // G_controller_strikeActor(actor, otherActor, world);
    return true;
  }
  return moved;
};
