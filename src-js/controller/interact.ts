import { Actor } from 'model/actor';
import { getCurrentPlayer, getCurrentWorld } from 'model/generics';
import { roomGetInteractableActorsAt } from 'model/room';
import { worldGetCurrentRoom } from 'model/world';
import { showDialog } from './ui-actions';

export const interactWithNearby = (actor?: Actor) => {
  const player = getCurrentPlayer();
  const world = getCurrentWorld();
  const room = worldGetCurrentRoom(world);
  const actors = roomGetInteractableActorsAt(room, player.leader);
  const act: Actor | null = actor ?? (actors || [])[0];
  if (act) {
    const talkTrigger = act.talkTrigger;
    if (typeof talkTrigger === 'string' && talkTrigger !== '') {
      showDialog(talkTrigger, act.templateName ?? act.name);
    } else if (typeof talkTrigger === 'function') {
      talkTrigger();
    }
  }
};
