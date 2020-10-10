/*
global
G_BEHAVIOR_NONE
G_createStats
G_FACING_LEFT
G_FACING_RIGHT
G_ACTOR_TYPE_CHARACTER
G_ACTOR_TYPE_BARREL
G_ACTOR_TYPE_TRIGGER
G_ACTOR_TYPE_TRIGGER_VISIBLE
G_PORTRAIT_SPRITES
G_CHARACTER_SPRITES
G_controller_showAlert
G_EQUIP_STATE_NONE
*/

// sprite index, spritesheet, Stats, inventory, behavior, talkTrigger, stepTrigger, dropLevel
type CharacterDefinition = [
  number, // spriteIndex
  string, // spriteSheet
  string, // name
  Stats, // stats
  Behavior, // behavior
  string | (() => void), // talkTrigger
  string | (() => void), // stepTrigger
  number, //dropLevel
  number, //facing
  string, // talkPortrait
  ActorType
];

interface ICreateCharacter {
  name: string;
  spriteIndex?: number;
  spriteSheet?: string;
  stats?: Stats;
  behavior?: Behavior;
  talkTrigger?: string | (() => void);
  talkPortrait?: string;
  stepTrigger?: string | (() => void);
  dropLevel?: number;
  facing?: number;
  actorType?: ActorType;
}

const CHARACTER_DEFAULTS: ICreateCharacter = {
  spriteIndex: 0,
  spriteSheet: 'actors1',
  name: 'Actor',
  stats: G_createStats(100),
  behavior: G_BEHAVIOR_NONE,
  talkTrigger: '',
  talkPortrait: '',
  stepTrigger: '',
  dropLevel: 0,
  facing: G_FACING_RIGHT,
  actorType: G_ACTOR_TYPE_CHARACTER,
};

function G_createCharacterTemplate(
  props: ICreateCharacter
): CharacterDefinition {
  const {
    spriteIndex,
    spriteSheet,
    name,
    stats,
    behavior,
    talkTrigger,
    stepTrigger,
    dropLevel,
    facing,
    talkPortrait,
    actorType,
  } = { ...CHARACTER_DEFAULTS, ...props };
  return [
    spriteIndex as number,
    spriteSheet as string,
    name,
    stats as Stats,
    behavior as Behavior,
    talkTrigger as string | (() => void),
    stepTrigger as string | (() => void),
    dropLevel as number,
    facing as number,
    talkPortrait as string,
    actorType as ActorType,
  ];
}

interface ICreateBarrel {
  spriteIndex?: number;
  talkTrigger?: string | (() => void);
}
function G_createBarrelTemplate(props: ICreateBarrel): CharacterDefinition {
  return G_createCharacterTemplate({
    ...props,
    name: '',
    spriteSheet: 'actors1',
    actorType: G_ACTOR_TYPE_BARREL,
  });
}

interface ICreateSign {
  text: string;
  spriteIndex?: number;
}

function G_createSignTemplate(props: ICreateSign): CharacterDefinition {
  return G_createCharacterTemplate({
    spriteIndex: G_CHARACTER_SPRITES.Sign,
    ...props,
    name: 'Sign',
    spriteSheet: 'actors1',
    actorType: G_ACTOR_TYPE_TRIGGER_VISIBLE,
    talkTrigger: () => {
      G_controller_showAlert({
        text: props.text,
        portrait: G_PORTRAIT_SPRITES.Sign,
        title: 'SIGN',
        soundName: 'alertMinor',
      });
    },
  });
}

interface ICreateItem {
  name: string;
  spriteIndex: number;
  dscr: string;
  meta?: object;
  sellAmount?: number;
  equipState?: EquipState;
}

const G_createItem = (props: ICreateItem): Item => {
  const { name, spriteIndex, meta, sellAmount, equipState, dscr } = props;
  return [
    spriteIndex,
    name,
    meta || {},
    sellAmount || 0,
    equipState || G_EQUIP_STATE_NONE,
    dscr,
  ];
};
