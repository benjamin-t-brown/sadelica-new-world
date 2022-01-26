import { Behavior } from 'db/behaviors';
import {
  ACTORS_SPRITE_SHEET,
  CHARACTER_SPRITES,
  PORTRAIT_SPRITES,
} from 'db/sprite-mapping';
import { ActorDefinition, createStats, Facing } from 'model/actor';
import { createSignTemplate } from './helpers';

export const init = (exp: Record<string, ActorDefinition>) => {
  exp.CH_ALINEA_DOCKMASTER_CLAIRE = {
    spriteIndex: CHARACTER_SPRITES.Dockmaster,
    spriteSheet: ACTORS_SPRITE_SHEET,
    name: 'Dock Master',
    stats: createStats(100),
    behavior: Behavior.NONE,
    talkTrigger: 'Alinea_CH_DockmasterClaire',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.RIGHT,
    talkPortrait: '',
  };

  exp.CH_ALINEA_BARTOLO_CALDEBURN = {
    spriteIndex: CHARACTER_SPRITES.Bartolo,
    spriteSheet: ACTORS_SPRITE_SHEET,
    name: 'Noble',
    stats: createStats(100),
    behavior: Behavior.NONE,
    talkTrigger: 'Alinea_CH_BartoloCaldeburn',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.LEFT,
    talkPortrait: '',
  };
  exp.CH_ALINEA_ALDEBETH_BLACKROSE = {
    spriteIndex: CHARACTER_SPRITES.AldebethBlackrose,
    spriteSheet: ACTORS_SPRITE_SHEET,
    name: 'Noble',
    stats: createStats(100),
    behavior: Behavior.NONE,
    talkTrigger: 'Alinea_CH_AldebethBlackrose',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.LEFT,
    talkPortrait: '',
  };
  exp.CH_ALINEA_SOL = {
    spriteIndex: CHARACTER_SPRITES.Sol,
    spriteSheet: ACTORS_SPRITE_SHEET,
    name: 'Strange Man',
    stats: createStats(100),
    behavior: Behavior.NONE,
    talkTrigger: 'Alinea_CH_Sol',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.RIGHT,
    talkPortrait: PORTRAIT_SPRITES.Sol,
  };
  exp.CH_ALINEA_BARTENDER = {
    spriteIndex: CHARACTER_SPRITES.Townsman1,
    spriteSheet: ACTORS_SPRITE_SHEET,
    name: 'Bartender',
    stats: createStats(100),
    behavior: Behavior.NONE,
    talkTrigger: 'Alinea_CH_BartenderRus',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.LEFT,
    talkPortrait: '',
  };

  exp.CH_ALINEA_GUARD = {
    spriteIndex: CHARACTER_SPRITES.GuardRealm,
    spriteSheet: ACTORS_SPRITE_SHEET,
    name: 'Guard',
    stats: createStats(250),
    behavior: Behavior.RAND,
    talkTrigger: '',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.LEFT,
    talkPortrait: '',
  };

  exp.CH_ALINEA_GUARD_STATIONARY = {
    spriteIndex: CHARACTER_SPRITES.GuardRealm,
    spriteSheet: ACTORS_SPRITE_SHEET,
    name: 'Guard',
    stats: createStats(250),
    behavior: Behavior.NONE,
    talkTrigger: '',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.LEFT,
    talkPortrait: '',
  };

  exp.CH_ALINEA_GUARD_CAPTAIN_MULLEN = {
    spriteIndex: CHARACTER_SPRITES.Mullen,
    spriteSheet: ACTORS_SPRITE_SHEET,
    name: 'Realm Captain',
    stats: createStats(250),
    behavior: Behavior.NONE,
    talkTrigger: 'Alinea_CH_GuardCaptainMullen',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.RIGHT,
    talkPortrait: PORTRAIT_SPRITES.Mullen,
  };

  exp.CH_ALINEA_ELVYOSA = {
    spriteIndex: CHARACTER_SPRITES.Elvyosa,
    spriteSheet: ACTORS_SPRITE_SHEET,
    name: 'Ship Captain',
    stats: createStats(250),
    behavior: Behavior.NONE,
    talkTrigger: 'Alinea_CH_Elvyosa',
    stepTrigger: '',
    dropLevel: 0,
    facing: Facing.RIGHT,
    talkPortrait: '',
  };

  // Alinea_CH_GuardCaptainMullen

  exp.CH_ALINEA_SIGN_REALM_EMBASSY = createSignTemplate({
    text: 'REALM EMBASSY\n See Lieutenant Mullen for duties.',
  });
  exp.CH_ALINEA_SIGN_TAVERN = createSignTemplate({
    text: 'THE STONE BARREL\n Sweets and Craft Ale',
  });
  exp.CH_ALINEA_SIGN_DOCKS = createSignTemplate({
    text: `WELCOME TO ALINEA!
  On arrival, please report to Dockmaster Claire for a permit and warehouse options.
  (At the bottom of the sign is a hastily-written note.)
  "ATTENTION WORKERS... Be sure to tie your mooring lines tightly!  The Captain doesn't need any more fiascos like last week."`,
    spriteIndex: CHARACTER_SPRITES.SignPost,
  });
  exp.CH_ALINEA_SIGN_WAREHOUSE1 = createSignTemplate({
    text: 'WAREHOUSE 1.',
  });
  exp.CH_ALINEA_SIGN_WAREHOUSE2 = createSignTemplate({
    text: 'WAREHOUSE 2.',
  });
  exp.CH_ALINEA_SIGN_WAREHOUSE3 = createSignTemplate({
    text: 'WAREHOUSE 3.',
  });
  exp.CH_ALINEA_SIGN_WAREHOUSE4 = createSignTemplate({
    text: 'WAREHOUSE 4.',
  });
  exp.CH_ALINEA_SIGN_WAREHOUSE5 = createSignTemplate({
    text: 'WAREHOUSE 5.',
  });
  exp.CH_ALINEA_SIGN_WAREHOUSE6 = createSignTemplate({
    text: 'WAREHOUSE 6.',
  });
  exp.CH_ALINEA_SIGN_WAREHOUSE7 = createSignTemplate({
    text: 'WAREHOUSE 7.',
  });
  exp.CH_ALINEA_SIGN_WAREHOUSE9 = createSignTemplate({
    text: '(This sign is scratched and rusted, but you can make out a single character.) "9".',
  });
};
