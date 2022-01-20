import { Item } from './item';

export enum Facing {
  RIGHT = 'right',
  LEFT = 'left',
}

export interface Character {
  name: string;
  sprite: string;
  facing: Facing;
  inventory: Item[];
}

export const createCharacter = (name: string) => {
  return {
    name,
    sprite: '',
    facing: Facing.LEFT,
    inventory: [],
  };
};
