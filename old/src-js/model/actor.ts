import { Behavior } from 'db/behaviors';
import { CHARACTER_SPRITES } from 'db/sprite-mapping';
import { DmgMinMax } from './generics';
import {
  createItem,
  EquipState,
  Item,
  itemGetDamage,
  itemGetEquipState,
} from './item';
import { getIfExists as getItem } from 'db/items';

export enum Facing {
  RIGHT = 'right',
  LEFT = 'left',
}

export interface Actor {
  type: ActorType;
  name: string;
  templateName: string;
  spriteIndex: number;
  spriteSheet: string;
  id: string;
  x: number;
  y: number;
  stats?: Stats;
  inventory: Item[];
  facing: Facing;
  behavior: Behavior;
  shouldUpdateThisRound: boolean;
  isAttacking: boolean;
  dropLvl: number;
  equippedItemIndex: number;
  allegiance: Allegiance;
  onDeath?: () => void;
  talkTrigger?: string | (() => void);
  stepTrigger?: string | (() => void);
  portrait?: string;
}

// type CharacterDefinition = [
//   number, // spriteIndex
//   string, // spriteSheet
//   string, // name
//   Stats, // stats
//   Behavior, // behavior
//   string | (() => void), // talkTrigger
//   string | (() => void), // stepTrigger
//   number, //dropLevel
//   number, //facing
//   string, // talkPortrait
//   ActorType
// ];

export interface ActorDefinition {
  name?: string;
  templateName?: string;
  text?: string;
  spriteIndex?: number;
  spriteSheet?: string;
  facing?: Facing;
  stats?: Stats;
  behavior?: Behavior;
  inventory?: string[];
  dropLevel?: number;
  talkTrigger?: string | (() => void);
  stepTrigger?: string | (() => void);
  talkPortrait?: string;
  talkBorder?: string;
  allegiance?: Allegiance;
  type?: ActorType;
}

export enum Allegiance {
  PLAYER = 'player',
  ENEMY = 'enemy',
  NEUTRAL = 'neutral',
}

export enum ActorType {
  CHARACTER = 'character',
  BARREL = 'barrel',
  TRIGGER = 'trigger',
  TRIGGER_VISIBLE = 'trigger-visible',
}

export const createStats = (n: number): Stats => {
  return {
    hp: n,
    maxHp: n,
  };
};

export const createActor = (name?: string) => {
  const ch: Actor = {
    type: ActorType.CHARACTER,
    name: name ?? '',
    templateName: '',
    spriteIndex: 0,
    spriteSheet: 'img/actors1',
    id: '',
    x: 0,
    y: 0,
    stats: createStats(10),
    inventory: [],
    facing: Facing.LEFT,
    behavior: Behavior.NONE,
    shouldUpdateThisRound: false,
    isAttacking: false,
    dropLvl: 0,
    equippedItemIndex: -1,
    onDeath: undefined,
    talkTrigger: undefined,
    stepTrigger: undefined,
    portrait: undefined,
    allegiance: Allegiance.NEUTRAL,
  };
  return ch;
};

export const createActorFromTemplate = (template: ActorDefinition) => {
  const actor = createActor(template.name);
  actor.name = template.name ?? '';
  actor.spriteIndex = template.spriteIndex ?? 0;
  actor.spriteSheet = template.spriteSheet ?? 'img/actors1';
  if (template.stats) {
    actor.stats = template.stats;
  }
  if (template.behavior) {
    actor.behavior = template.behavior;
  }
  if (template.inventory) {
    actor.inventory = template.inventory
      .map(itemName => {
        const itemTemplate = getItem(itemName);
        if (itemTemplate) {
          return createItem(itemTemplate);
        } else {
          console.error(
            `Cannot create item while creating actor ${template.name}, no item exists named: ${itemName}`
          );
          return undefined;
        }
      })
      .filter(Boolean) as Item[];
  }
  actor.facing = template.facing ?? Facing.LEFT;
  actor.talkTrigger = template.talkTrigger ?? undefined;
  actor.stepTrigger = template.stepTrigger ?? undefined;
  actor.portrait = template.talkPortrait ?? undefined;
  actor.type = template.type ?? ActorType.CHARACTER;
  actor.allegiance = template.allegiance ?? Allegiance.NEUTRAL;
  actor.templateName = template.templateName ?? '';

  return actor;
};

export const actorGetSprite = (actor: Actor) => {
  const BASE_SPRITE_INDEX_TO_EQUIP_STATE: Record<
    number,
    Record<EquipState, number>
  > = {
    0: {
      [EquipState.NONE]: CHARACTER_SPRITES.PlayerUnequipped,
      [EquipState.SWORD]: CHARACTER_SPRITES.Player,
      [EquipState.KNIFE]: CHARACTER_SPRITES.PlayerKnife,
      [EquipState.SPEAR]: CHARACTER_SPRITES.PlayerSpear,
      [EquipState.BOW]: CHARACTER_SPRITES.PlayerBow,
    },
  };

  let spriteIndex = actor.spriteIndex;
  const spriteMapping = BASE_SPRITE_INDEX_TO_EQUIP_STATE[spriteIndex];
  if (spriteMapping) {
    const item = actorGetEquippedItem(actor);
    if (item) {
      spriteIndex = spriteMapping[itemGetEquipState(item)];
    } else {
      spriteIndex = spriteMapping[EquipState.NONE];
    }
  }

  const facing = actor.facing;
  const spriteIndexOffset = actor.isAttacking ? 1 : 0;
  return (
    actor.spriteSheet +
    '_' +
    (spriteIndex + spriteIndexOffset) +
    (facing === Facing.LEFT ? '_f' : '')
  );
};

export const actorModInventory = (actor: Actor, item: Item, add: boolean) => {};
export const actorPushInventory = (actor: Actor, item: Item) => {
  actorModInventory(actor, item, true);
};
export const actorSubtractFromInventory = (actor: Actor, item: Item) => {
  actorModInventory(actor, item, false);
};
export const actorGetPosition = (actor: Actor): [number, number] => {
  return [actor.x, actor.y];
};
export const actorSetPosition = (actor: Actor, x: number, y: number) => {
  actor.x = x;
  actor.y = y;
};

export const actorGetEquippedItem = (actor: Actor): Item | undefined => {
  const inventory = actor.inventory;
  const item: Item | undefined = inventory[actor.equippedItemIndex];
  return item;
};

export const actorRoundReset = (actor: Actor) => {
  actor.isAttacking = false;
};

export const actorIsDead = (actor: Actor) => {
  return actor.type === ActorType.CHARACTER && (actor.stats?.hp ?? 0) <= 0;
};

export const actorGetAllegiance = (actor: Actor): Allegiance => {
  return actor.behavior === Behavior.NONE
    ? Allegiance.PLAYER
    : Allegiance.ENEMY;
};

export interface Stats {
  hp: number;
  maxHp: number;
}

export const statsSetHpMaxHp = (stats: Stats, hp: number) => {
  stats.hp = stats.maxHp = hp;
};
export const statsModifyHp = (stats: Stats, v: number) => {
  stats.hp += v;
  if (stats.hp < 0) {
    stats.hp = 0;
  } else if (stats.hp > stats.maxHp) {
    stats.hp = stats.maxHp;
  }
};

export const actorGetDamage = (actor: Actor): DmgMinMax => {
  const attackerItem = actorGetEquippedItem(actor);
  let [min, max]: DmgMinMax = [1, 3];
  if (attackerItem) {
    const [minMod, maxMod] = itemGetDamage(attackerItem, actor);
    min += minMod;
    max += maxMod;
  }
  return [min, max];
};
