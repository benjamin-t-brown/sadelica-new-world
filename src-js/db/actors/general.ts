import { CHARACTER_SPRITES } from 'db/sprite-mapping';
import { ActorDefinition } from 'model/actor';

export const init = (exp: Record<string, ActorDefinition>) => {
  exp.CH_BARREL = {
    spriteIndex: CHARACTER_SPRITES.Barrel,
  };
  exp.CH_CRATE = {
    spriteIndex: CHARACTER_SPRITES.Crate,
  };
};
