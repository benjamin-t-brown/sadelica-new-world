import { SCALE, TILE_HEIGHT } from './tile';

export const ASPECT_RATIO = 9 / 16;
export const GAME_AREA_TILES_WIDE = 9 * TILE_HEIGHT * SCALE;
export const GAME_AREA_TILES_TALL = 12 * TILE_HEIGHT * SCALE;

export const DESIGN_WIDTH = 270;
export const DESIGN_HEIGHT = 480;

export const pxToPctWidth = (px: number) => (px * 100) / DESIGN_WIDTH + '%';
export const pxToPctHeight = (px: number) => (px * 100) / DESIGN_HEIGHT + '%';
