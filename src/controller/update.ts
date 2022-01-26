import { getBehaviorUpdateFunc } from 'db/behaviors';
import { actorGetPosition, actorIsDead } from 'model/actor';
import {
  getCurrentPlayer,
  getCurrentWorld,
  getScale,
  setInputDisabled,
} from 'model/generics';
import { World, worldGetCurrentRoom } from 'model/world';
import { clearScreen, drawWorld } from 'view/draw';
import { setVisibility } from './visibility';

const LOOP_MS = 32;

export const playerInputComplete = () => {
  setInputDisabled(true);
  const world = getCurrentWorld();
  const room = worldGetCurrentRoom(world);
  for (let i = 0; i < room.actors.length; i++) {
    const act = room.actors[i];
    act.shouldUpdateThisRound = true;
  }
  updateWorld();
};

export const renderCurrentWorldState = (world: World) => {
  const scale = getScale();

  const room = worldGetCurrentRoom(world);
  const playerActor = getCurrentPlayer().leader;
  const [x, y] = actorGetPosition(playerActor);
  setVisibility(x, y, room);

  clearScreen();
  drawWorld(world, scale);
};

export const updateWorld = () => {
  const world = getCurrentWorld();
  const room = worldGetCurrentRoom(world);
  if (room.particles.length) {
    // for (let i = 0; i < room.particles.length; i++) {
    //   const particle = room.particles[i];
    //   const [, startTime, duration] = particle;
    //   const now = +new Date();
    //   if (now - startTime >= duration) {
    //     room.p.splice(i, 1);
    //     i--;
    //   }
    // }
    // setTimeout(updateWorld, LOOP_MS);
    // render(world);
    return;
  }

  const playerActor = getCurrentPlayer().leader;
  // G_model_actorRoundReset(playerActor);
  playerActor.isAttacking = false;
  if (actorIsDead(playerActor)) {
    throw new Error('You are dead.');
    // G_view_playSound('lose');
    // setTimeout(() => {
    //   G_start();
    // }, 2000);
  }

  for (let i = 0; i < room.actors.length; i++) {
    const act = room.actors[i];
    if (actorIsDead(act)) {
      room.actors.splice(i, 1);
      i--;
      // dropItemActor(act, room);
      // G_view_playSound('dead');

      // onDead callback (boss only right now)
      // if (act[13]) {
      //   act[13]();
      // }
    } else if (act.shouldUpdateThisRound) {
      act.shouldUpdateThisRound = false;
      const behavior = act.behavior;
      const behaviorFunc = getBehaviorUpdateFunc(behavior);
      behaviorFunc(act, world);
      // setTimeout(updateWorld, 0);
      // return;
    } else {
      playerActor.isAttacking = false;
    }
  }

  renderCurrentWorldState(world);
  // G_view_renderUi();
  setTimeout(() => {
    setInputDisabled(false);
  }, LOOP_MS);
};
