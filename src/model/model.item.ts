type ItemStats = {
  getDmg?: (user: Actor) => DmgMinMax;
  onUse?: (user: Actor) => Promise<boolean>; // return true if the item was used, false if not
  onAcq?: () => boolean; // return true to keep item, false to discard
};

type EquipState = 0 | 1 | 2 | 3 | 4;
const G_EQUIP_STATE_NONE = 0;
const G_EQUIP_STATE_SWORD = 1;
const G_EQUIP_STATE_KNIFE = 2;
const G_EQUIP_STATE_SPEAR = 3;
const G_EQUIP_STATE_BOW = 4;

// sprite_index 0, name 1, stats 2, sellAmount 3, equip_state 4
type Item = [number, string, ItemStats, number, EquipState | undefined];
type ItemWithAmount = [Item, number];
type GenericItem = Item | ItemWithAmount;

const G_model_itemGetName = (item: Item): string => {
  return item[1];
};
const G_model_itemGetSprite = (item: Item): string => {
  return 'misc1_' + item[0];
};

const G_model_itemGetBaseItem = (itemObj: GenericItem): Item => {
  if (itemObj.length === 2) {
    return itemObj[0];
  } else {
    return itemObj;
  }
};

const G_model_itemGetAmount = (itemObj: GenericItem): number => {
  if (itemObj.length === 2) {
    return itemObj[1];
  } else {
    return 1;
  }
};

const G_model_itemModifyAmount = (
  itemObj: GenericItem,
  mod: number
): GenericItem | null => {
  if (itemObj.length === 2) {
    let amt = itemObj[1] + mod;
    if (amt < 0) {
      amt = 0;
    }
    itemObj[1] = amt;
    return amt ? itemObj : null;
  } else {
    if (mod > 0) {
      return [itemObj as Item, 1 + mod];
    } else {
      return null;
    }
  }
};

const G_model_itemGetSellAmount = (itemObj: GenericItem): number => {
  const item = G_model_itemGetBaseItem(itemObj);
  return item[3];
};

const G_model_itemIsUsable = (itemObj: GenericItem): boolean => {
  return !!G_model_itemGetOnUse(itemObj);
};
const G_model_itemGetOnUse = (
  itemObj: GenericItem
): ((user: Actor) => Promise<boolean>) | undefined => {
  const item = G_model_itemGetBaseItem(itemObj);
  const meta = item[2];
  return meta.onUse;
};
const G_model_itemInvokeOnAcquire = (itemObj: GenericItem): boolean => {
  const item = G_model_itemGetBaseItem(itemObj);
  const meta = item[2];
  const func = meta.onAcq;
  if (func) {
    return func();
  }
  return true;
};

const G_model_itemCanBeEquipped = (itemObj: GenericItem): boolean => {
  const item = G_model_itemGetBaseItem(itemObj);
  const meta = item[2];
  return !!meta.getDmg;
};

const G_model_itemGetDamage = (item: Item, user: Actor): DmgMinMax => {
  const meta = item[2];
  if (meta.getDmg) {
    return meta.getDmg(user);
  } else {
    return [0, 0];
  }
};

const G_model_itemGetEquipState = (itemObj: GenericItem): EquipState => {
  const item = G_model_itemGetBaseItem(itemObj);
  return item[4] || G_EQUIP_STATE_NONE;
};
