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
import { Actor, actorGetPosition } from 'model/actor';
import { getCurrentPlayer } from 'model/generics';
import { World } from 'model/world';
import { randInRange } from 'utils';

export enum Behavior {
  NONE = 'none',
  RAND = 'rand',
  BOSS = 'boss',
  SHOOT = 'shoot',
  ATTACK = 'attack',
}

type BehaviorUpdateFunc = (actor: Actor, world: World) => void;

const Behaviors: BehaviorUpdateFunc[] = [
  (actor: Actor, world: World) => {}, // none
  // rand
  (actor: Actor, world: World) => {
    // const dir = String(randInRange(0, 10)) as Direction;
    // moveActor(actor, dir, world, {
    //   intentToAttack: false,
    // });
  },
  // (actor: Actor, world: World) => {}, // attack
  // (actor: Actor, world: World) => {}, // shoot
  // rand
  (actor: Actor, world: World) => {
    const getDxDy = (actor1: Actor, actor2: Actor): [number, number] => {
      const [x, y] = actorGetPosition(actor1);
      const [oX, oY] = actorGetPosition(actor2);
      return [oX - x, oY - y];
    };

    const canSeeActor = (me: Actor, other: Actor): boolean => {
      const [dX, dY] = getDxDy(me, other);
      return Math.abs(dX) < 6 && Math.abs(dY) < 6;
    };

    const getDirectionTowards = (me: Actor, other: Actor): Direction[] => {
      const [dX, dY] = getDxDy(me, other);

      if (dY === 0) {
        return dX > 0 ? [RIGHT] : [LEFT];
      } else if (dX === 0) {
        return dY > 0 ? [DOWN] : [UP];
      } else {
        if (dX > 0 && dY > 0) {
          return [DOWN_RIGHT, DOWN, RIGHT];
        } else if (dX > 0 && dY < 0) {
          return [UP_RIGHT, UP, RIGHT];
        } else if (dX < 0 && dY > 0) {
          return [DOWN_LEFT, DOWN, LEFT];
        } else {
          return [UP_LEFT, UP, LEFT];
        }
      }
    };

    // const direction = `${utils_randInRage(0, 10)}` as Direction;
    // if (canSeeActor(actor, getCurrentPlayer().leader)) {
    //   const directions = getDirectionTowards(
    //     actor,
    //     playerGetActor(world.player)
    //   );
    //   for (let i in directions) {
    //     if (moveActor(actor, directions[i], world)) {
    //       break;
    //     }
    //   }
    // }
  },
];

export const getBehaviorUpdateFunc = (b: Behavior): BehaviorUpdateFunc => {
  return Behaviors[b] ?? (() => void 0);
};
