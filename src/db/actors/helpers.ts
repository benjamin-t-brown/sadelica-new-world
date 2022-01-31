import { showModal } from 'controller/ui-actions';
import { Behavior } from 'db/behaviors';
import {
  ACTORS_SPRITE_SHEET,
  CHARACTER_SPRITES,
  PORTRAIT_SPRITES,
} from 'db/sprite-mapping';
import { ActorType, Facing } from 'model/actor';

export const createSignTemplate = (args: {
  text: string;
  spriteIndex?: number;
}) => {
  return {
    spriteIndex: CHARACTER_SPRITES.Sign,
    templateName: '',
    ...args,
    name: 'Sign',
    type: ActorType.TRIGGER_VISIBLE,
    spriteSheet: ACTORS_SPRITE_SHEET,
    behavior: Behavior.NONE,
    talkPortrait: '',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.RIGHT,
    talkTrigger: () => {
      showModal({
        text: args.text,
        sprite: 'img/actors1_41',
        title: 'EXAMINE',
        headerText: 'Sign',
        // soundName: 'alertMinor',
      });
    },
  };
};
