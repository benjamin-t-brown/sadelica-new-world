import { Item } from 'model/item';

const exp: Record<string, Partial<Item>> = {};

export const getIfExists = (name: string) => {
  const def = exp[name];
  if (def) {
    return def;
  }
};

export const init = () => {};
