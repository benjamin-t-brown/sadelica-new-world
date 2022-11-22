// sprite, startTime, ms duration, x, y, text
// export type Particle = [string, number, number, number, number, string];

export interface Particle {
  sprite: string;
  startTime: number;
  durationMs: number;
  x: number;
  y: number;
  text?: string;
}

export const particleCreate = (
  spriteIndex: number,
  x: number,
  y: number,
  text?: string
): Particle => {
  return {
    sprite: 'misc_' + spriteIndex,
    startTime: +new Date(),
    durationMs: 500,
    x,
    y,
    text,
  };
};
