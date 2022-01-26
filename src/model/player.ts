import { Actor } from './actor';

export interface Player {
  name: string;
  party: Actor[];
  leader: Actor;
  money: number;
  worldX: number;
  worldY: number;
}

// export const playerGetLeader =
