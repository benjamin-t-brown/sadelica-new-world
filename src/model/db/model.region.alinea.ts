/*
global
G_createStats
G_BEHAVIOR_NONE
G_FACING_LEFT
G_FACING_RIGHT
G_CHARACTER_SPRITES
G_createCharacterTemplate
*/

const G_CH_ALINEA_DOCKMASTER_CLAIRE = G_createCharacterTemplate({
  spriteIndex: G_CHARACTER_SPRITES.Dockmaster,
  spriteSheet: 'actors1',
  name: 'Dock Master',
  stats: G_createStats(100),
  behavior: G_BEHAVIOR_NONE,
  talkTrigger: 'Alinea_CH_DockmasterClaire',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_RIGHT,
});
