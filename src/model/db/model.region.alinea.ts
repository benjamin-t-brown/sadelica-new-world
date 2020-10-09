/*
global
G_createStats
G_ACTORS_SPRITE_SHEET
G_BEHAVIOR_NONE
G_BEHAVIOR_RAND
G_FACING_LEFT
G_FACING_RIGHT
G_CHARACTER_SPRITES
G_PORTRAIT_SPRITES
G_createSignTemplate
G_createCharacterTemplate
*/
const G_CH_ALINEA_DOCKMASTER_CLAIRE = G_createCharacterTemplate({
  spriteIndex: G_CHARACTER_SPRITES.Dockmaster,
  spriteSheet: G_ACTORS_SPRITE_SHEET,
  name: 'Dock Master',
  stats: G_createStats(100),
  behavior: G_BEHAVIOR_NONE,
  talkTrigger: 'Alinea_CH_DockmasterClaire',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_RIGHT,
  talkPortrait: '',
});
const G_CH_ALINEA_BARTOLO_CALDEBURN = G_createCharacterTemplate({
  spriteIndex: G_CHARACTER_SPRITES.Bartolo,
  spriteSheet: G_ACTORS_SPRITE_SHEET,
  name: 'Noble',
  stats: G_createStats(100),
  behavior: G_BEHAVIOR_NONE,
  talkTrigger: 'Alinea_CH_BartoloCaldeburn',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_LEFT,
  talkPortrait: '',
});
const G_CH_ALINEA_ALDEBETH_BLACKROSE = G_createCharacterTemplate({
  spriteIndex: G_CHARACTER_SPRITES.AldebethBlackrose,
  spriteSheet: G_ACTORS_SPRITE_SHEET,
  name: 'Noble',
  stats: G_createStats(100),
  behavior: G_BEHAVIOR_NONE,
  talkTrigger: 'Alinea_CH_AldebethBlackrose',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_LEFT,
  talkPortrait: '',
});
const G_CH_ALINEA_SOL = G_createCharacterTemplate({
  spriteIndex: G_CHARACTER_SPRITES.Sol,
  spriteSheet: G_ACTORS_SPRITE_SHEET,
  name: 'Strange Man',
  stats: G_createStats(100),
  behavior: G_BEHAVIOR_NONE,
  talkTrigger: 'Alinea_CH_Sol',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_RIGHT,
  talkPortrait: G_PORTRAIT_SPRITES.Sol,
});
const G_CH_ALINEA_BARTENDER = G_createCharacterTemplate({
  spriteIndex: G_CHARACTER_SPRITES.Townsman1,
  spriteSheet: G_ACTORS_SPRITE_SHEET,
  name: 'Bartender',
  stats: G_createStats(100),
  behavior: G_BEHAVIOR_NONE,
  talkTrigger: 'Alinea_CH_BartenderRus',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_LEFT,
  talkPortrait: '',
});

const G_CH_ALINEA_GUARD = G_createCharacterTemplate({
  spriteIndex: G_CHARACTER_SPRITES.GuardRealm,
  spriteSheet: G_ACTORS_SPRITE_SHEET,
  name: 'Guard',
  stats: G_createStats(250),
  behavior: G_BEHAVIOR_RAND,
  talkTrigger: '',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_LEFT,
  talkPortrait: '',
});

const G_CH_ALINEA_GUARD_STATIONARY = G_createCharacterTemplate({
  spriteIndex: G_CHARACTER_SPRITES.GuardRealm,
  spriteSheet: G_ACTORS_SPRITE_SHEET,
  name: 'Guard',
  stats: G_createStats(250),
  behavior: G_BEHAVIOR_NONE,
  talkTrigger: '',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_LEFT,
  talkPortrait: '',
});

const G_CH_ALINEA_GUARD_CAPTAIN_MULLEN = G_createCharacterTemplate({
  spriteIndex: G_CHARACTER_SPRITES.Mullen,
  spriteSheet: G_ACTORS_SPRITE_SHEET,
  name: 'Realm Captain',
  stats: G_createStats(250),
  behavior: G_BEHAVIOR_NONE,
  talkTrigger: 'Alinea_CH_GuardCaptainMullen',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_RIGHT,
  talkPortrait: G_PORTRAIT_SPRITES.Mullen,
});

// Alinea_CH_GuardCaptainMullen

const G_CH_ALINEA_SIGN_REALM_EMBASSY = G_createSignTemplate({
  text: 'REALM EMBASSY\n See Lieutenant Mullen for duties.',
});
const G_CH_ALINEA_SIGN_TAVERN = G_createSignTemplate({
  text: 'THE STONE BARREL\n Sweets and Craft Ale',
});
const G_CH_ALINEA_SIGN_DOCKS = G_createSignTemplate({
  text: `WELCOME TO ALINEA!
On arrival, please report to Dockmaster Claire for a permit and warehouse options.
(At the bottom of the sign is a hastily-written note.)
"Guys... Be sure to tie your mooring lines tightly!  We don't need any more fiascos like last week."`,
  spriteIndex: G_CHARACTER_SPRITES.SignPost,
});
const G_CH_ALINEA_SIGN_WAREHOUSE1 = G_createSignTemplate({
  text: 'WAREHOUSE 1.',
});
const G_CH_ALINEA_SIGN_WAREHOUSE2 = G_createSignTemplate({
  text: 'WAREHOUSE 2.',
});
const G_CH_ALINEA_SIGN_WAREHOUSE3 = G_createSignTemplate({
  text: 'WAREHOUSE 3.',
});
const G_CH_ALINEA_SIGN_WAREHOUSE4 = G_createSignTemplate({
  text: 'WAREHOUSE 4.',
});
const G_CH_ALINEA_SIGN_WAREHOUSE5 = G_createSignTemplate({
  text: 'WAREHOUSE 5.',
});
const G_CH_ALINEA_SIGN_WAREHOUSE6 = G_createSignTemplate({
  text: 'WAREHOUSE 6.',
});
const G_CH_ALINEA_SIGN_WAREHOUSE7 = G_createSignTemplate({
  text: 'WAREHOUSE 7.',
});
const G_CH_ALINEA_SIGN_WAREHOUSE9 = G_createSignTemplate({
  text:
    '(This sign is scratched and rusted, but you can make out a single character.) "9".',
});
