import { getCadence } from './canvas';

export type CadenceTemplate = [
  number, //middleFrameMinimumMS
  number, //middleFrameMaximumMS
  number, //maxFrameMinimumMS
  number, //maxFrameMaximumMS
  number[] //timestamps of each open point
];

export default class Cadence {
  openPoints: { timestamp: number }[];
  middleFrameMinimumMS = 50;
  middleFrameMaximumMS = 60;
  maxFrameMinimumMS = 40;
  maxFrameMaximumMS = 90;

  constructor(json: CadenceTemplate) {
    this.openPoints = [];

    this.middleFrameMinimumMS = 50;
    this.middleFrameMaximumMS = 60;
    this.maxFrameMinimumMS = 40;
    this.maxFrameMaximumMS = 90;

    this.fromJson(json);
  }

  fromJson(json: CadenceTemplate) {
    this.middleFrameMinimumMS = json[0];
    this.middleFrameMaximumMS = json[1];
    this.maxFrameMinimumMS = json[2];
    this.maxFrameMaximumMS = json[3];
    this.openPoints = json[4].map(timestamp => ({
      timestamp,
    }));
  }

  isAtThreshold(timestampA: number, timestampB: number, offsetMS: number) {
    timestampA *= 1000;
    timestampB *= 1000;
    const d = timestampB - timestampA;
    if (d > 0 && d < offsetMS) {
      return true;
    }
    return false;
  }

  getAnimIndex(timestampInSound: number) {
    let lastIndex = 0;

    let leftI = 0;
    let rightI = this.openPoints.length - 1;
    while (leftI <= rightI) {
      const midI = leftI + Math.floor((rightI - leftI) / 2);
      const { timestamp: timestampOpenPoint } = this.openPoints[midI];
      if (
        this.isAtThreshold(
          timestampOpenPoint,
          timestampInSound,
          this.maxFrameMinimumMS
        )
      ) {
        lastIndex = 2;
      } else if (
        this.isAtThreshold(
          timestampInSound,
          timestampOpenPoint,
          this.middleFrameMinimumMS
        )
      ) {
        lastIndex = 1;
      } else if (
        this.isAtThreshold(
          timestampOpenPoint,
          timestampInSound,
          this.maxFrameMaximumMS
        )
      ) {
        lastIndex = 2;
      } else if (
        this.isAtThreshold(
          timestampInSound,
          timestampOpenPoint,
          this.middleFrameMaximumMS
        )
      ) {
        lastIndex = 1;
      }

      if (timestampInSound > timestampOpenPoint) {
        leftI = midI + 1;
      } else {
        rightI = midI - 1;
      }
    }
    return lastIndex;
  }
}

export const getCadenceSprites = (
  spriteBase: string,
  animationState: 'reg' | 'blink'
) => {
  let cadenceBase = spriteBase;
  cadenceBase = spriteBase + '_' + animationState + '_cad';
  cadenceBase += '_cad';
  const desiredSprites = getCadence(cadenceBase);
  if (desiredSprites) {
    return desiredSprites;
  }
};
