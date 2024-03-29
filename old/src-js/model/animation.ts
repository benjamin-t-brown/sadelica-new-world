import { getNow } from 'model/generics';
import { getSprite } from 'model/canvas';

export interface AnimSprite {
  name: string;
  duration: number;
  durationUpToNow: number;
  timestampBegin?: number;
  timestampEnd?: number;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  hasPlayedSound: boolean;
}

export class Animation {
  name: string;
  loop: boolean;
  sprites: AnimSprite[];
  done: boolean;
  totalDurationMs: number;
  currentSpriteIndex: number;
  timestampStart: number;
  awaits: any[];
  isPaused: boolean;
  soundsEnabled: boolean;
  timestampPause: number;
  // meta: AnimationMetadata | null;
  subLoopAnim: Animation | null;
  useSubLoopAnim: boolean;
  static globalSoundsEnabled = true;

  constructor(loop: boolean) {
    this.loop = loop || false;
    this.sprites = [];
    this.done = false;
    this.isPaused = false;
    this.soundsEnabled = true;
    this.timestampPause = 0;
    this.totalDurationMs = 0;
    this.currentSpriteIndex = 0;
    this.timestampStart = 0;
    this.name = ''; // set when constructed from a builder
    this.useSubLoopAnim = false;
    this.awaits = [];
  }

  reset(fromLoop?: boolean): void {
    this.done = false;
    this.currentSpriteIndex = 0;
    if (fromLoop) {
      this.useSubLoopAnim = true;
      if (this.subLoopAnim) {
        this.subLoopAnim.reset(fromLoop);
      } else {
        this.sprites.forEach(s => {
          s.hasPlayedSound = false;
        });
      }
    } else {
      this.useSubLoopAnim = false;
      if (this.subLoopAnim) {
        this.subLoopAnim.reset();
      }
      this.sprites.forEach(s => {
        s.hasPlayedSound = false;
      });
    }
  }

  start(): void {
    this.timestampStart = getNow();
    if (this.useSubLoopAnim && this.subLoopAnim) {
      this.subLoopAnim.start();
    }
  }

  pause(): void {
    if (!this.isPaused) {
      this.isPaused = true;
      this.timestampPause = getNow();
      if (this.subLoopAnim) {
        this.subLoopAnim.pause();
      }
    }
  }

  unpause(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.timestampStart += getNow() - this.timestampPause;
      this.currentSpriteIndex = 0;
      this.update();

      if (this.subLoopAnim) {
        this.subLoopAnim.unpause();
      }
    }
  }

  disableSounds() {
    this.soundsEnabled = false;
  }

  enableSounds() {
    this.soundsEnabled = true;
  }

  static enableSoundsGlobally() {
    Animation.globalSoundsEnabled = true;
  }

  static disableSoundsGlobally() {
    Animation.globalSoundsEnabled = false;
  }

  getDurationMs(): number {
    return this.totalDurationMs;
  }

  getLongestFrameMs(): number {
    return this.sprites.reduce((ms: number, sprite: AnimSprite) => {
      return sprite.duration > ms ? sprite.duration : ms;
    }, 0);
  }

  getLongestFrameIndex(): number {
    let ms = 0;
    return this.sprites.reduce((ind: number, sprite: AnimSprite, i: number) => {
      if (sprite.duration > ms) {
        ms = sprite.duration;
        return i;
      } else {
        return ind;
      }
    }, 0);
  }

  getDurationToIndex(i: number): number {
    if (i >= this.sprites.length) {
      return this.totalDurationMs;
    } else {
      return this.sprites[i].durationUpToNow;
    }
  }

  addSprite({
    name,
    duration,
    offsetX,
    offsetY,
    opacity,
  }: Partial<AnimSprite>): void {
    this.sprites.push({
      name: name || '',
      timestampBegin: this.totalDurationMs,
      timestampEnd: this.totalDurationMs + (duration ?? 0),
      duration: duration ?? 0,
      durationUpToNow: this.totalDurationMs,
      offsetX: offsetX || 0,
      offsetY: offsetY || 0,
      opacity,
      hasPlayedSound: false,
    });
    this.totalDurationMs += duration ?? 0;
  }

  getAnimIndex(timestampNow: number): number {
    if (this.useSubLoopAnim && this.subLoopAnim) {
      return this.subLoopAnim.getAnimIndex(timestampNow);
    }

    let lastIndex = 0;
    let leftI = this.currentSpriteIndex;
    let rightI = this.sprites.length - 1;
    while (leftI <= rightI) {
      const midI = leftI + Math.floor((rightI - leftI) / 2);
      lastIndex = midI;
      const { timestampEnd, timestampBegin } = this.sprites[midI];

      const beginTime = (timestampBegin || 0) + this.timestampStart;
      const endTime = (timestampEnd || 0) + this.timestampStart;

      if (timestampNow < endTime && timestampNow > beginTime) {
        return midI;
      }

      if (timestampNow >= endTime) {
        leftI = midI + 1;
      } else {
        rightI = midI - 1;
      }
    }
    return lastIndex;
  }

  update(): void {
    if (this.useSubLoopAnim && this.subLoopAnim) {
      this.subLoopAnim.update();
      return;
    }

    const now = getNow();
    if (this.currentSpriteIndex === this.sprites.length - 1) {
      if (this.loop && now - this.timestampStart > this.totalDurationMs) {
        const newStart = this.timestampStart + this.totalDurationMs;
        this.reset(true);
        this.start();
        if (now - newStart < this.totalDurationMs) {
          this.timestampStart = newStart;
        }
      }
    }
    this.currentSpriteIndex = this.getAnimIndex(now);
    if (!this.loop) {
      if (now - this.timestampStart >= this.totalDurationMs) {
        this.done = true;
        this.awaits.forEach(r => r());
        this.awaits = [];
      }
    }

    // if (this.meta) {
    //   const sounds = this.meta.sounds;
    //   if (sounds) {
    //     sounds.forEach((sound, i) => {
    //       const sprite = this.sprites[i];
    //       if (
    //         this.currentSpriteIndex >= sound.frame &&
    //         !sprite.hasPlayedSound
    //       ) {
    //         if (this.soundsEnabled && Animation.globalSoundsEnabled) {
    //           playSoundName(sound.soundName);
    //         }
    //         sprite.hasPlayedSound = true;
    //       }
    //     });
    //   }
    // }
  }

  onCompletion(): Promise<void> {
    return new Promise(resolve => {
      if (this.isDone() || this.loop) {
        return;
      }
      this.awaits.push(resolve);
    });
  }

  getSprite(): string {
    if (this.useSubLoopAnim && this.subLoopAnim) {
      return this.subLoopAnim.getSprite();
    }
    return this.sprites[this.currentSpriteIndex]?.name;
  }

  getSpriteSize(i?: number): [number, number] {
    const now = getNow();
    i = i ?? this.getAnimIndex(now);
    const { name } = this.sprites[i];
    const [, , , width, height] = getSprite(name);
    return [width, height];
  }

  isDone(): boolean {
    return this.done;
  }
}

type AnimationBuilder = () => Animation;
const animationBuilders: {
  [key: string]: AnimationBuilder;
} = ((window as any).animations = {});
export const createAnimationBuilder = (
  name: string,
  builder: () => Animation
): void => {
  animationBuilders[name] = builder;
};

export const hasAnimation = (animName: string): boolean => {
  if (animationBuilders[animName]) {
    return true;
  } else {
    return false;
  }
};

export const createAnimation = (animName: string): Animation => {
  const builder = animationBuilders[animName];
  if (builder) {
    const anim = builder();
    anim.name = animName;
    // anim.meta = getAnimMeta(animName);
    // const loopFromFrame = anim?.meta?.loopFromFrame;
    // if (loopFromFrame !== undefined) {
    //   const subAnim = new Animation(true);
    //   for (let i = loopFromFrame; i < anim.sprites.length; i++) {
    //     const spr = anim.sprites[i];
    //     subAnim.addSprite({
    //       name: spr.name,
    //       duration: spr.duration,
    //     });
    //   }
    //   anim.subLoopAnim = subAnim;
    // }
    return anim;
  } else {
    throw new Error(`No animation exists which is named '${animName}'`);
  }
};
