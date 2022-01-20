import { Character } from './character';

export interface Player {
  name: string;
  party: Character[];
  leader: Character;
}
