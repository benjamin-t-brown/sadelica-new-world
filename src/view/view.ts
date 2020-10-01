/*
global
G_model_getCtx
G_model_getCanvas
G_model_getSprite
G_model_getImage
G_model_getWorldSize
G_model_getRoomSize
G_model_getTileSize
G_model_playerGetWorldPosition
G_model_playerGetActor
G_model_actorGetPosition
G_model_actorGetSprite
G_model_roomGetActorAt
G_model_roomPosIsExplored
G_model_roomPosIsVisible
G_model_itemGetBaseItem
G_model_itemGetSprite
G_model_actorGetStats
G_model_statsGetHp
G_model_statsGetMaxHp
G_model_getCamera
G_model_actorGetName
G_model_actorGetTalkTrigger
G_model_roomGetSurroundingActorsAt
*/
interface DrawTextParams {
  font?: string;
  color?: string;
  size?: number;
  align?: 'left' | 'center' | 'right';
  strokeColor?: string;
}
const DEFAULT_TEXT_PARAMS = {
  font: 'monospace',
  color: '#fff',
  size: 14,
  align: 'center',
  strokeColor: '',
};

const G_view_clearScreen = () => {
  const canvas = G_model_getCanvas();
  G_view_drawRect(0, 0, canvas.width, canvas.height, 'black');
};

const G_view_setOpacity = (opacity: number, ctx?: CanvasRenderingContext2D) => {
  ctx = ctx || G_model_getCtx();
  ctx.globalAlpha = opacity;
};

const G_view_drawSprite = (
  sprite: string | Sprite,
  x: number,
  y: number,
  scale?: number,
  ctx?: CanvasRenderingContext2D
) => {
  scale = scale || 1;
  ctx = ctx || G_model_getCtx();
  const spriteObj =
    typeof sprite === 'string' ? G_model_getSprite(sprite) : sprite;
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

const G_view_drawRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  stroke?: boolean,
  ctx?: CanvasRenderingContext2D
) => {
  ctx = ctx || G_model_getCtx();
  ctx[stroke ? 'strokeStyle' : 'fillStyle'] = color;
  ctx[stroke ? 'strokeRect' : 'fillRect'](x, y, w, h);
};

const G_view_drawText = (
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
  ctx = ctx || G_model_getCtx();
  ctx.font = `${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align as CanvasTextAlign;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.5;
    ctx.strokeText(text, x, y);
  }
};

// const G_view_drawLine = (
//   x: number,
//   y: number,
//   x2: number,
//   y2: number,
//   color: string,
//   scale?: number,
//   ctx?: CanvasRenderingContext2D
// ) => {
//   scale = scale || 1;
//   ctx = ctx || G_model_getCtx();
//   ctx.strokeStyle = color;
//   ctx.beginPath();
//   ctx.moveTo(x, y);
//   ctx.lineTo(x2, y2);
//   ctx.stroke();
// };

const G_view_drawActor = (
  actor: Actor,
  camera: Rect,
  scale: number,
  xOff: number,
  yOff: number
) => {
  const [x, y] = G_model_actorGetPosition(actor);
  const [cameraX, cameraY] = camera;
  const sprite = G_model_actorGetSprite(actor);
  const tileSize = G_model_getTileSize();
  const tileSizeScaled = tileSize * scale;
  G_view_drawSprite(
    sprite,
    xOff + x * tileSizeScaled - cameraX * tileSizeScaled,
    yOff + y * tileSizeScaled - cameraY * tileSizeScaled,
    scale
  );

  // const px = xOff + x * tileSizeScaled;
  // const py = yOff + y * tileSizeScaled;
  // debug draw hp
  // {
  //   const stats = G_model_actorGetStats(actor);
  //   const text = `${G_model_statsGetHp(stats)}`;
  //   const ctx = G_model_getCtx();
  //   const halfSize = (tileSize * scale) / 2;
  //   ctx.font = '16px monospace';
  //   ctx.textBaseline = 'middle';
  //   ctx.fillStyle = '#FFF';
  //   const leftOffset = text.length === 2 ? 6 : 2;
  //   ctx.fillText(text, px + halfSize - leftOffset, py);
  // }

  // debug draw hit box
  // {
  //   const ctx = G_model_getCtx();
  //   ctx.strokeStyle = '#fff';
  //   ctx.lineWidth = scale;
  //   ctx.strokeRect(px, py, tileSize * scale, tileSize * scale);
  // }
};

const G_view_drawParticle = (
  particle: Particle,
  camera: Rect,
  scale: number,
  xOff: number,
  yOff: number
) => {
  scale = scale || 1;
  const [sprite, , , x, y, text] = particle;
  const tileSize = G_model_getTileSize();
  const halfSize = (tileSize * scale) / 2;
  const tileSizeScaled = tileSize * scale;
  const [cameraX, cameraY] = camera;
  const px = xOff + x * tileSizeScaled - cameraX * tileSizeScaled;
  const py = yOff + y * tileSizeScaled - cameraY * tileSizeScaled;
  if (sprite) {
    G_view_drawSprite(sprite, px, py, scale);
  }
  if (text) {
    const ctx = G_model_getCtx();
    ctx.font = '16px monospace';
    ctx.fillStyle = '#FFF';
    const leftOffset = text.length === 2 ? 9 : 5;
    ctx.fillText(text, px + halfSize - leftOffset, py + halfSize + 5);
  }
};

const G_view_drawItem = (
  item: Item,
  camera: Rect,
  x: number,
  y: number,
  scale: number,
  xOff: number,
  yOff: number
) => {
  const sprite = G_model_itemGetSprite(item);
  const [cameraX, cameraY] = camera;
  const tileSize = G_model_getTileSize() * scale;
  const px = xOff + x * tileSize - cameraX * tileSize;
  const py = yOff + y * tileSize - cameraY * tileSize;
  G_view_drawSprite(sprite, px + 8, py + 8, scale - 1);
};

const G_view_renderWorld = (world: World, scale: number) => {
  const worldSize = G_model_getWorldSize();
  const tileSize = G_model_getTileSize();
  const player = world.player;
  const [wx, wy] = G_model_playerGetWorldPosition(player);
  const tileSizeScaled = tileSize * scale;
  const currentRoom = world.rooms[wy * worldSize + wx];

  const actor = G_model_playerGetActor(player);
  const camera = G_model_getCamera(world);
  const [cameraX, cameraY, cameraW, cameraH] = camera;
  G_view_drawActor(actor, camera, scale, 0, 0);
  const surroundingActors = G_model_roomGetSurroundingActorsAt(
    currentRoom,
    actor
  );

  for (let i in currentRoom.tiles) {
    const [sprite, , tx, ty] = currentRoom.tiles[i];
    const x = tx * tileSizeScaled - cameraX * tileSizeScaled;
    const y = ty * tileSizeScaled - cameraY * tileSizeScaled;
    if (G_model_roomPosIsExplored(currentRoom, tx, ty)) {
      G_view_drawSprite(sprite, x, y, scale);
      if (!G_model_roomPosIsVisible(currentRoom, tx, ty)) {
        G_view_setOpacity(0.15);
        G_view_drawRect(x, y, tileSizeScaled, tileSizeScaled, 'black', false);
        G_view_setOpacity(1);
      }
    } else {
      G_view_drawRect(x, y, tileSizeScaled, tileSizeScaled, 'black', true);
    }
  }
  for (let i in currentRoom.items) {
    const [itemObj, x, y] = currentRoom.items[i];
    const item = G_model_itemGetBaseItem(itemObj);
    if (G_model_roomPosIsVisible(currentRoom, x, y)) {
      G_view_drawItem(item, camera, x, y, scale, 0, 0);
    }
  }
  for (let i in currentRoom.tiles) {
    const [, , tx, ty, highlighted] = currentRoom.tiles[i];
    const actor = G_model_roomGetActorAt(currentRoom, tx, ty);
    const x = tx * tileSizeScaled;
    const y = ty * tileSizeScaled;
    if (G_model_roomPosIsVisible(currentRoom, tx, ty)) {
      if (actor) {
        G_view_drawActor(actor, camera, scale, 0, 0);
        if (
          surroundingActors[0] === actor &&
          G_model_actorGetTalkTrigger(actor)
        ) {
          const textX = x - cameraX * tileSizeScaled + tileSizeScaled / 2;
          const textY = y - cameraY * tileSizeScaled - 8;
          G_view_drawText(G_model_actorGetName(actor), textX, textY);
        }
      }
    }
    if (highlighted) {
      G_view_drawRect(x, y, tileSizeScaled, tileSizeScaled, '#ccc', true);
    }
  }

  for (let i = 0; i < currentRoom.p.length; i++) {
    const particle = currentRoom.p[i];
    G_view_drawParticle(particle, camera, scale, 0, 0);
  }

  for (let i = 0; i < surroundingActors.length ? 1 : 0; i++) {
    const actor = surroundingActors[i];
    const [x, y] = G_model_actorGetPosition(actor);
    if (G_model_actorGetTalkTrigger(actor)) {
      const textX = x - cameraX * tileSizeScaled + tileSizeScaled / 2;
      const textY = y - cameraY * tileSizeScaled - 8;
      G_view_drawText(G_model_actorGetName(actor), textX, textY);
    }
  }

  // G_view_renderMap(world, 0.5, 0, 0);
};

// const G_view_renderMap = (
//   world: World,
//   scale: number,
//   xOff: number,
//   yOff: number
// ) => {
//   const tileSize = G_model_getTileSize();
//   const roomSize = G_model_getRoomSize();

//   const worldWidth = G_model_getWorldSize();
//   const worldHeight = worldWidth;

//   for (let wy = 0; wy < worldHeight; wy++) {
//     for (let wx = 0; wx < worldWidth; wx++) {
//       const currentRoom = world.rooms[wy * 4 + wx];
//       for (let i in currentRoom.tiles) {
//         const [sprite, , tx, ty] = currentRoom.tiles[i];
//         G_view_drawSprite(
//           sprite,
//           xOff + wx * tileSize * roomSize * scale + tx * tileSize * scale,
//           yOff + wy * tileSize * roomSize * scale + ty * tileSize * scale,
//           scale
//         );
//         const actor = G_model_roomGetActorAt(currentRoom, tx, ty);
//         if (actor) {
//           const [x, y] = G_model_actorGetPosition(actor);
//           const sprite = G_model_actorGetSprite(actor);
//           const tileSize = G_model_getTileSize();
//           G_view_drawSprite(
//             sprite,
//             xOff + wx * tileSize * roomSize * scale + x * tileSize * scale,
//             yOff + wy * tileSize * roomSize * scale + y * tileSize * scale,
//             scale
//           );
//         }
//       }
//     }
//   }

//   const actor = G_model_playerGetActor(world.player);
//   const [wx, wy] = G_model_playerGetWorldPosition(world.player);
//   G_view_drawActor(
//     actor,
//     scale,
//     wx * tileSize * roomSize * scale + xOff,
//     wy * tileSize * roomSize * scale + yOff
//   );
// };
