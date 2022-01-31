import { spriteToCanvas } from 'view/draw';
import { getCamera, getCurrentWorld, getScale } from './generics';
import { getTileSize } from './tile';

type ImageCollection = Record<string, HTMLImageElement>;
export type Sprite = [
  HTMLCanvasElement | HTMLImageElement,
  number,
  number,
  number,
  number
];
type SpriteCollection = Record<string, Sprite>;

let canvas: HTMLCanvasElement | null = null;
const images: ImageCollection | null = ((window as any).images = {});
const sprites: SpriteCollection | null = ((window as any).sprites = {});
const cadenceSprites: Record<string, [string, string, string]> = ((
  window as any
).cadenceSprites = {});

const createRotatedImg = (
  inputCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const [canvas, ctx, width, height] = createCanvas(
    inputCanvas.width,
    inputCanvas.height
  );
  const x = width / 2;
  const y = height / 2;
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(inputCanvas, -x, -y);
  return canvas;
};

const createFlippedImg = (
  inputCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const [canvas, ctx, width] = createCanvas(
    inputCanvas.width,
    inputCanvas.height
  );
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(inputCanvas, 0, 0);
  return canvas;
};

const loadSpritesheets = (
  spriteMap: SpriteCollection,
  image: HTMLImageElement,
  spritePrefixes: string[],
  spriteWidth: number,
  spriteHeight: number,
  subWidth: number,
  subHeight: number
) => {
  const createSprite = (
    name: string,
    image: HTMLImageElement | HTMLCanvasElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    return (spriteMap[name] = [image, x, y, w, h]);
  };

  const addRotated = (
    sprite: HTMLCanvasElement,
    baseSpriteName: string,
    n: number
  ) => {
    let rotated: HTMLCanvasElement = sprite;
    for (let i = 0; i < n; i++) {
      rotated = createRotatedImg(rotated);
    }
    createSprite(
      `${baseSpriteName}_r${n}`,
      rotated,
      0,
      0,
      spriteWidth,
      spriteHeight
    );
  };

  const numColumns = image.width / spriteWidth;
  const numRows = image.height / spriteHeight;
  const numColumnsPerSubsection = numColumns / subWidth;
  const numRowsPerSubsection = numRows / subHeight;

  for (let subY = 0; subY < subHeight; subY++) {
    for (let subX = 0; subX < subWidth; subX++) {
      const spritePrefix = spritePrefixes[subY * subWidth + subX];
      let ctr = 0;
      for (let i = 0; i < numRowsPerSubsection; i++) {
        for (let j = 0; j < numColumnsPerSubsection; j++) {
          const baseSpriteName = `${spritePrefix}_${ctr}`;
          const sprite = createSprite(
            `${spritePrefix}_${ctr}`,
            image,
            subX * spriteWidth * numColumnsPerSubsection + j * spriteWidth,
            subY * spriteHeight * numRowsPerSubsection + i * spriteHeight,
            spriteWidth,
            spriteHeight
          );

          // addRotated(spriteToCanvas(sprite), baseSpriteName, 1);
          // addRotated(spriteToCanvas(sprite), baseSpriteName, 2);
          // addRotated(spriteToCanvas(sprite), baseSpriteName, 3);
          const flipped = createFlippedImg(spriteToCanvas(sprite));
          createSprite(
            `${baseSpriteName}_f`,
            flipped,
            0,
            0,
            spriteWidth,
            spriteHeight
          );
          ctr++;
        }
      }
    }
  }
};

export const loadImagesAndSprites = async (localImages: any[]) => {
  const imageMap: ImageCollection = {};
  const spriteMap = {};
  await Promise.all(
    localImages.map(
      ([
        imageName,
        imagePath,
        spriteWidth,
        spriteHeight,
        subWidth,
        subHeight,
        spritePrefixes,
      ]) => {
        return new Promise<void>(resolve => {
          const img = new Image();
          img.onload = () => {
            imageMap[imageName] = img;
            loadSpritesheets(
              spriteMap,
              img,
              spritePrefixes,
              spriteWidth,
              spriteHeight,
              subWidth,
              subHeight
            );
            resolve();
          };
          img.src = imagePath;
        });
      }
    )
  );

  Object.assign(images, imageMap);
  Object.assign(sprites, spriteMap);

  return { imageMap, spriteMap };
};

export const addCadence = function (
  name: string,
  spriteName1: string,
  spriteName2: string,
  spriteName3: string
) {
  cadenceSprites[name] = [spriteName1, spriteName2, spriteName3];
};

export const getCadence = function (name: string) {
  const sprites = cadenceSprites[name];
  if (sprites) {
    return sprites as [string, string, string];
  } else {
    console.error('Could not get cadence sprites for:', name);
    return null;
  }
};

export const createCanvas = (
  width: number,
  height: number
): [HTMLCanvasElement, CanvasRenderingContext2D, number, number] => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;
  return [canvas, ctx, width, height];
};

export const getCanvas = (): HTMLCanvasElement => {
  if (canvas) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;
    return canvas as HTMLCanvasElement;
  } else {
    const c = document.getElementById('main-canvas') as HTMLCanvasElement;
    const ctx = c.getContext('2d') as CanvasRenderingContext2D;
    c.id = 'canv';
    ctx.lineWidth = 2;
    canvas = c;
    return canvas;
  }
};

export const getCtx = (): CanvasRenderingContext2D => {
  return getCanvas().getContext('2d') as CanvasRenderingContext2D;
};

export const getImage = (imageName: string): HTMLImageElement =>
  (images as ImageCollection)[imageName];
export const getSprite = (spriteName: string): Sprite =>
  (sprites as SpriteCollection)[spriteName];

export const canvasCoordsToScreenCoords = (x: number, y: number) => {
  const scale = getScale();

  const canvas: HTMLCanvasElement | null = document.getElementById(
    'canv'
  ) as any;
  if (!canvas) {
    return [0, 0];
  }

  const boundingRectCanvas = canvas.getBoundingClientRect();
  const boundingRectParent = (
    canvas.parentElement as HTMLElement
  ).getBoundingClientRect();

  const boundingXOffset = boundingRectParent.x - boundingRectCanvas.x;
  const boundingYOffset = boundingRectParent.y - boundingRectCanvas.y;

  const tileSize = getTileSize();
  const [cameraX, cameraY, cameraW, cameraH] = getCamera(getCurrentWorld());
  const { width, height } = canvas;

  const xOffset =
    width / 2 - (cameraW * tileSize * scale) / 2 - boundingXOffset;
  const yOffset =
    height / 2 - (cameraH * tileSize * scale) / 2 - boundingYOffset;

  const tileSizeScaled = tileSize * scale;
  const xPx = x * tileSizeScaled - cameraX * tileSizeScaled;
  const yPx = y * tileSizeScaled - cameraY * tileSizeScaled;

  return [xPx + xOffset, yPx + yOffset];
};
