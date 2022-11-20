import {
  Actor,
  actorGetPosition,
  actorGetSprite,
  ActorType,
} from 'model/actor';
import {
  createCanvas,
  getCanvas,
  getCtx,
  getSprite,
  Sprite,
} from 'model/canvas';
import { getCamera, getCurrentPlayer, getScale } from 'model/generics';
import { Item, itemGetSprite } from 'model/item';
import { roomPosIsExplored, roomPosIsVisible } from 'model/room';
import { getTileSize } from 'model/tile';
import { getWorldSize, World } from 'model/world';
import { Rect } from 'utils';
import { Animation } from 'model/animation';

export interface DrawTextParams {
  font?: string;
  color?: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
  strokeColor?: string;
}
export const DEFAULT_TEXT_PARAMS = {
  font: 'Chicago',
  color: '#fff',
  size: 1,
  align: 'center',
  strokeColor: 'black',
};

export type CanvasTextAlign = 'center' | 'end' | 'left' | 'right' | 'start';

export const clearScreen = () => {
  const canvas = getCanvas();
  drawRect(0, 0, canvas.width, canvas.height, 'black');
};

export const setOpacity = (opacity: number, ctx?: CanvasRenderingContext2D) => {
  ctx = ctx || getCtx();
  ctx.globalAlpha = opacity;
};

export const spriteToCanvas = (sprite: Sprite): HTMLCanvasElement => {
  const [, , , spriteWidth, spriteHeight] = sprite;
  const [canvas, ctx] = createCanvas(spriteWidth, spriteHeight);
  drawSprite(sprite, 0, 0, 1, ctx);
  return canvas;
};

export const extractActorSpriteFromScreen = (
  actor: Actor,
  camera: Rect
): Sprite => {
  const scale = getScale();
  const ctx = getCtx();

  const tileSize = getTileSize();
  const [x, y] = actorGetPosition(actor);
  const [cameraX, cameraY, cameraW, cameraH] = camera;
  const { width, height } = ctx.canvas;

  const xOffset = width / 2 - (cameraW * tileSize * scale) / 2;
  const yOffset = height / 2 - (cameraH * tileSize * scale) / 2;

  const tileSizeScaled = tileSize * scale;
  const xPx = x * tileSizeScaled - cameraX * tileSizeScaled;
  const yPx = y * tileSizeScaled - cameraY * tileSizeScaled;
  const w = tileSizeScaled * 5;
  const h = tileSizeScaled * 5;
  const ret: Sprite = [
    ctx.canvas,
    xOffset + xPx - w / 2 + tileSizeScaled / 2,
    yOffset + yPx - h / 2 + tileSizeScaled / 2,
    w,
    h,
  ];

  return ret;
};

export const drawRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  stroke?: boolean,
  ctx?: CanvasRenderingContext2D
) => {
  ctx = ctx || getCtx();
  ctx[stroke ? 'strokeStyle' : 'fillStyle'] = color;
  ctx[stroke ? 'strokeRect' : 'fillRect'](x, y, w, h);
};

export const drawSprite = (
  sprite: string | Sprite,
  x: number,
  y: number,
  scale?: number,
  ctx?: CanvasRenderingContext2D
) => {
  scale = scale || 1;
  ctx = ctx || getCtx();
  const spriteObj = typeof sprite === 'string' ? getSprite(sprite) : sprite;
  if (!spriteObj) {
    throw new Error(`Cannot find sprite with name: "${sprite}"`);
  }
  const [image, sprX, sprY, sprW, sprH] = spriteObj;

  ctx.drawImage(
    image,
    sprX,
    sprY,
    sprW,
    sprH,
    x,
    y,
    sprW * scale,
    sprH * scale
  );
};

export const drawAnimation = (
  anim: Animation,
  x: number,
  y: number,
  scale?: number,
  ctx?: CanvasRenderingContext2D
): void => {
  scale = scale || 1;
  ctx = ctx || getCtx();
  anim.update();
  const sprite = anim.getSprite();
  if (!sprite) {
    console.error(anim);
    throw new Error(`Cannot draw animation that did not provide a sprite.`);
  }
  try {
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    const [image, sprX, sprY, sprW, sprH] =
      typeof sprite === 'string' ? getSprite(sprite) : sprite;
    ctx.drawImage(
      image,
      sprX,
      sprY,
      sprW,
      sprH,
      Math.floor(x),
      Math.floor(y),
      sprW * scale,
      sprH * scale
    );
  } catch (e) {
    throw new Error(`Error attempting to draw animation sprite: "${sprite}"`);
  }
};

export const drawText = (
  text: string,
  x: number,
  y: number,
  textParams?: DrawTextParams,
  ctx?: CanvasRenderingContext2D
) => {
  const { font, size, color, align, strokeColor } = {
    ...DEFAULT_TEXT_PARAMS,
    ...(textParams || {}),
  };
  ctx = ctx || getCtx();
  ctx.font = `${size}rem ${font}`;
  ctx.textAlign = align as CanvasTextAlign;
  ctx.textBaseline = 'middle';
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 4;
    ctx.strokeText(text, x, y);
  }

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
};

export const drawActor = (
  actor: Actor,
  camera: Rect,
  scale: number,
  xOff: number,
  yOff: number
) => {
  const [x, y] = actorGetPosition(actor);
  const [cameraX, cameraY] = camera;
  const sprite = actorGetSprite(actor);
  const tileSize = getTileSize();
  const tileSizeScaled = tileSize * scale;
  drawSprite(
    sprite,
    xOff + x * tileSizeScaled - cameraX * tileSizeScaled,
    yOff + y * tileSizeScaled - cameraY * tileSizeScaled,
    scale
  );

  // const px = xOff + x * tileSizeScaled;
  // const py = yOff + y * tileSizeScaled;
  // debug draw hp
  // {
  //   const stats = actor.stats
  //   const text = `${stats.hp}`;
  //   const ctx = getCtx();
  //   const halfSize = (tileSize * scale) / 2;
  //   ctx.font = '16px monospace';
  //   ctx.textBaseline = 'middle';
  //   ctx.fillStyle = '#FFF';
  //   const leftOffset = text.length === 2 ? 6 : 2;
  //   ctx.fillText(text, px + halfSize - leftOffset, py);
  // }

  // debug draw hit box
  // {
  //   const ctx = getCtx();
  //   ctx.strokeStyle = '#fff';
  //   ctx.lineWidth = scale;
  //   ctx.strokeRect(px, py, tileSize * scale, tileSize * scale);
  // }
};

// export const drawParticle = (
//   particle: Particle,
//   camera: Rect,
//   scale: number,
//   xOff: number,
//   yOff: number
// ) => {
//   scale = scale || 1;
//   const [sprite, , , x, y, text] = particle;
//   const tileSize = getTileSize();
//   const halfSize = (tileSize * scale) / 2;
//   const tileSizeScaled = tileSize * scale;
//   const [cameraX, cameraY] = camera;
//   const px = xOff + x * tileSizeScaled - cameraX * tileSizeScaled;
//   const py = yOff + y * tileSizeScaled - cameraY * tileSizeScaled;
//   if (sprite) {
//     drawSprite(sprite, px, py, scale);
//   }
//   if (text) {
//     const ctx = getCtx();
//     ctx.font = '1rem Chicago';
//     ctx.fillStyle = '#FFF';
//     const leftOffset = text.length === 2 ? 9 : 5;
//     ctx.fillText(text, px + halfSize - leftOffset, py + halfSize + 5);
//   }
// };

export const drawItem = (
  item: Item,
  camera: Rect,
  x: number,
  y: number,
  scale: number,
  xOff: number,
  yOff: number
) => {
  const sprite = itemGetSprite(item);
  const [cameraX, cameraY] = camera;
  const tileSize = getTileSize() * scale;
  const px = xOff + x * tileSize - cameraX * tileSize;
  const py = yOff + y * tileSize - cameraY * tileSize;
  drawSprite(sprite, px + 8, py + 8, scale - 1);
};

export const drawWorld = (world: World, scale: number) => {
  const worldSize = getWorldSize();
  const tileSize = getTileSize();
  const player = getCurrentPlayer();
  const [wx, wy] = [player.worldX, player.worldY];
  const tileSizeScaled = tileSize * scale;
  const currentRoom = world.rooms[wy * worldSize + wx];

  const actor = player.leader;
  const camera = getCamera(world);
  const [cameraX, cameraY, cameraW, cameraH] = camera;

  console.log('draw room', wx, wy, currentRoom);

  const ctx = getCtx();
  const { width, height } = ctx.canvas;
  ctx.save();
  ctx.translate(
    width / 2 - (cameraW * tileSize * scale) / 2,
    height / 2 - (cameraH * tileSize * scale) / 2
  );

  for (let i = 0; i < cameraH; i++) {
    for (let j = 0; j < cameraW; j++) {
      const tileX = cameraX + j;
      const tileY = cameraY + i;
      const tile = currentRoom.tiles[tileY * 64 + tileX];
      if (!tile) {
        continue;
      }

      const [sprite, , tx, ty] = tile;
      const x = tx * tileSizeScaled - cameraX * tileSizeScaled;
      const y = ty * tileSizeScaled - cameraY * tileSizeScaled;
      if (roomPosIsExplored(currentRoom, tx, ty)) {
        drawSprite(sprite, x, y, scale);
        if (!roomPosIsVisible(currentRoom, tx, ty)) {
          setOpacity(0.15);
          drawRect(x, y, tileSizeScaled, tileSizeScaled, 'black', false);
          setOpacity(1);
        }
      } else {
        drawRect(x, y, tileSizeScaled, tileSizeScaled, 'black', true);
      }
    }
  }

  // for (let i in currentRoom.items) {
  //   const [itemObj, x, y] = currentRoom.items[i];
  //   const item = itemGetBaseItem(itemObj);
  //   if (roomPosIsVisible(currentRoom, x, y)) {
  //     drawItem(item, camera, x, y, scale, 0, 0);
  //   }
  // }
  for (const i in currentRoom.actors) {
    const actor = currentRoom.actors[i];
    const [tx, ty] = actorGetPosition(actor);
    if (roomPosIsExplored(currentRoom, tx, ty)) {
      if (
        actor.type !== ActorType.CHARACTER ||
        roomPosIsVisible(currentRoom, tx, ty)
      ) {
        drawActor(actor, camera, scale, 0, 0);
      }
    }
  }

  // player actor
  drawActor(actor, camera, scale, 0, 0);

  for (const i in currentRoom.tiles) {
    const [, , tx, ty, highlighted] = currentRoom.tiles[i];
    const x = tx * tileSizeScaled;
    const y = ty * tileSizeScaled;
    if (highlighted) {
      drawRect(x, y, tileSizeScaled, tileSizeScaled, '#ccc', true);
    }
  }

  // for (let i = 0; i < currentRoom.p.length; i++) {
  //   const particle = currentRoom.p[i];
  //   drawParticle(particle, camera, scale, 0, 0);
  // }

  // const surroundingActors = roomGetInteractableActorsAt(currentRoom, actor);
  // for (let i = 0; i < surroundingActors.length ? 1 : 0; i++) {
  //   const actor = surroundingActors[i];
  //   const [tx, ty] = actorGetPosition(actor);
  //   const x = tx * tileSizeScaled;
  //   const y = ty * tileSizeScaled;
  //   const actorName = actorGetName(actor);
  //   if (actorGetTalkTrigger(actor) || actorName) {
  //     const textX = x - cameraX * tileSizeScaled + tileSizeScaled / 2;
  //     const textY = y - cameraY * tileSizeScaled - 8;
  //     drawText(actorName, textX, textY, {
  //       color: i === 0 ? '#F7E26B' : 'white',
  //     });
  //   }
  // }

  // renderMap(world, 0.5, 0, 0);

  ctx.restore();
};

// const renderMap = (
//   world: World,
//   scale: number,
//   xOff: number,
//   yOff: number
// ) => {
//   const tileSize = getTileSize();
//   const roomSize = getRoomSize();

//   const worldWidth = getWorldSize();
//   const worldHeight = worldWidth;

//   for (let wy = 0; wy < worldHeight; wy++) {
//     for (let wx = 0; wx < worldWidth; wx++) {
//       const currentRoom = world.rooms[wy * 4 + wx];
//       for (let i in currentRoom.tiles) {
//         const [sprite, , tx, ty] = currentRoom.tiles[i];
//         drawSprite(
//           sprite,
//           xOff + wx * tileSize * roomSize * scale + tx * tileSize * scale,
//           yOff + wy * tileSize * roomSize * scale + ty * tileSize * scale,
//           scale
//         );
//         const actor = roomGetActorAt(currentRoom, tx, ty);
//         if (actor) {
//           const [x, y] = actorGetPosition(actor);
//           const sprite = actorGetSprite(actor);
//           const tileSize = getTileSize();
//           drawSprite(
//             sprite,
//             xOff + wx * tileSize * roomSize * scale + x * tileSize * scale,
//             yOff + wy * tileSize * roomSize * scale + y * tileSize * scale,
//             scale
//           );
//         }
//       }
//     }
//   }

//   const actor = playerGetActor(world.player);
//   const [wx, wy] = playerGetWorldPosition(world.player);
//   drawActor(
//     actor,
//     scale,
//     wx * tileSize * roomSize * scale + xOff,
//     wy * tileSize * roomSize * scale + yOff
//   );
// };
