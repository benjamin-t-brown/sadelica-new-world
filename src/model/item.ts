import { Actor } from './actor';
import { DmgMinMax } from './generics';

export interface Item {
  name: string;
  spriteIndex: number;
  spriteSheet: 'misc1';
  stats: ItemStats;
  sellValue: number;
  equipState?: EquipState;
  description: string;
  stackable?: boolean;
}

type ItemStats = {
  getDmg?: (user: Actor) => DmgMinMax;
  onUse?: (user: Actor) => Promise<boolean>; // return true if the item was used, false if not
  onAcq?: () => boolean; // return true to keep item, false to discard
};

export enum EquipState {
  NONE = 'none',
  SWORD = 'sword',
  KNIFE = 'knife',
  SPEAR = 'spear',
  BOW = 'bow',
}

export const createItem = (template: Partial<Item>): Item => {
  const item: Item = {
    name: '',
    spriteSheet: 'misc1',
    stats: {},
    sellValue: 0,
    equipState: EquipState.NONE,
    description: '',
    stackable: false,
    spriteIndex: 0,
    ...template,
  };
  return item;
};

export const itemGetSprite = (item: Item) => {
  return item.spriteSheet + '_' + item.spriteIndex;
};

export const itemIsUsable = (item: Item): boolean => {
  return !!item.stats.onUse;
};

export const itemInvokeOnAcquire = (item: Item): boolean => {
  const meta = item.stats;
  const func = meta.onAcq;
  if (func) {
    return func();
  }
  return true;
};

export const itemCanBeEquipped = (item: Item): boolean => {
  return !!item.stats.getDmg;
};

export const itemGetDamage = (item: Item, user: Actor): DmgMinMax => {
  const meta = item.stats;
  if (meta.getDmg) {
    return meta.getDmg(user);
  } else {
    return [0, 0];
  }
};

export const itemGetEquipState = (item: Item): EquipState => {
  return item.equipState ?? EquipState.NONE;
};
