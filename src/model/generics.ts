import { Player } from './player';

let currentPlayer: Player | null = null;
export const getCurrentPlayer = (): Player => currentPlayer as Player;
export const setCurrentPlayer = (p: Player): void => {
  currentPlayer = p;
};
