import {
  Direction,
  DOWN,
  DOWN_LEFT,
  DOWN_RIGHT,
  PAUSE,
  LEFT,
  RIGHT,
  UP,
  UP_LEFT,
  UP_RIGHT,
  movePlayer,
} from 'controller/move';
import { Actor } from 'model/actor';
import { AppSection, InventoryState } from 'model/app-state';
import {
  getCurrentPlayer,
  getCurrentWorld,
  getScale,
  isInputDisabled,
} from 'model/generics';
import { roomGetInteractableActorsAt } from 'model/room';
import { getTileSize } from 'model/tile';
import { World, worldGetCurrentRoom } from 'model/world';
import {
  calculateDistance,
  getAngleTowards,
  getDirectionFromAngle,
} from 'utils';
import { clearScreen, drawWorld } from 'view/draw';
import { interactWithNearby } from './interact';
import { getUiInterface, setInteractables, showDialog } from './ui-actions';

let isRendering = false;
let renderAfter = false;
const debounceRender = (world: World) => {
  const scale = getScale();
  if (!isRendering) {
    isRendering = true;
    clearScreen();
    drawWorld(world, scale);
  } else {
    if (!renderAfter) {
      renderAfter = true;
      setTimeout(() => {
        isRendering = false;
        if (renderAfter) {
          renderAfter = false;
          debounceRender(world);
        }
      }, 16);
    }
  }
};

let isWaitingForInput = false;
let waitForInputCb: (() => void) | null = null;
const waitForInput = async () => {
  return new Promise<void>(resolve => {
    isWaitingForInput = true;
    waitForInputCb = () => {
      waitForInputCb = null;
      isWaitingForInput = false;
      resolve();
    };
  });
};

export const initEvents = () => {
  const KEY_MAP_TO_DIR = {
    40: DOWN,
    34: DOWN_RIGHT,
    35: DOWN_LEFT,
    37: LEFT,
    12: PAUSE,
    39: RIGHT,
    36: UP_LEFT,
    38: UP,
    33: UP_RIGHT,
    // 32: PAUSE, // space
    98: DOWN, // num lock on
    99: DOWN_RIGHT,
    97: DOWN_LEFT,
    100: LEFT,
    101: PAUSE,
    102: RIGHT,
    103: UP_LEFT,
    104: UP,
    105: UP_RIGHT,
    81: UP_LEFT,
    87: UP,
    69: UP_RIGHT,
    65: LEFT,
    83: PAUSE,
    68: RIGHT,
    90: DOWN_LEFT,
    88: DOWN,
    67: DOWN_RIGHT,
  };

  const _movePlayer = (direction: Direction) => {
    const world = getCurrentWorld();
    const player = getCurrentPlayer();
    const room = worldGetCurrentRoom(world);
    movePlayer(getCurrentPlayer(), direction, world);
    const actors = roomGetInteractableActorsAt(room, player.leader);
    setInteractables(actors);
  };

  window.addEventListener('keydown', ev => {
    console.log('which', ev.which);
    const world = getCurrentWorld();
    if (isInputDisabled()) {
      return;
    }
    if (
      !getUiInterface().appState.sections.includes(AppSection.GAME) ||
      getUiInterface().appState.sections.length > 1 ||
      getUiInterface().appState.game.inventoryState === InventoryState.FULL
    ) {
      return;
    }
    if (isWaitingForInput && waitForInputCb) {
      // if (G_model_getAlertProps().visible) {
      //   return;
      // }

      waitForInputCb();
      return;
    }

    const { which } = ev;
    const key = KEY_MAP_TO_DIR[which] || which;
    const actor = getCurrentPlayer().leader;
    const room = worldGetCurrentRoom(world);
    switch (true) {
      case ((k: number) => k >= 1 && k <= 9)(Number(key)): // isDirection
        ev.preventDefault();
        _movePlayer(key as Direction);
        break;
      case key === 27:
        // if (G_model_shouldDrawTargetingLine()) {
        //   G_model_addLog(` - cancel`);
        // }
        // G_controller_stopTargeting();
        debounceRender(world);
        break;
      case key === 192: // tilde
        // const nearbyItemsAt = G_model_roomGetSurroundingItemsAt(room, actor);
        // const [item, x, y] = nearbyItemsAt[0] || [];
        // if (item) {
        //   G_controller_acquireItem(item, actor, x, y, room);
        // }
        break;
      case key === 32: {
        ev.preventDefault();
        //space
        interactWithNearby();
      }
      default: {
        // // number keys not including 0
        // if (!ev.shiftKey && key > 48 && key <= 57) {
        //   const i = key - 49;
        //   const inventory = G_model_actorGetInventory(actor);
        //   const item = inventory[i];
        //   if (item) {
        //     const baseItem = G_model_itemGetBaseItem(item);
        //     if (G_model_itemIsUsable(item)) {
        //       G_model_setSelectedInventoryItemIndex(i);
        //       G_controller_useItem(baseItem, actor);
        //     } else if (G_model_itemCanBeEquipped(item)) {
        //       G_controller_equipItem(i, actor);
        //     }
        //   }
        // }
        // // letter keys !,@,#,$,%,^
        // if ((ev.shiftKey && key > 48 && key <= 57) || ev.which === 192) {
        //   const nearbyItemsAt = G_model_roomGetSurroundingItemsAt(room, actor);
        //   const i = key - 49;
        //   const [item, x, y] = nearbyItemsAt[i] || [];
        //   if (item) {
        //     G_controller_acquireItem(item, actor, x, y, room);
        //   }
        // }
      }
    }
  });

  // const canvas = G_model_getCanvas();
  // canvas.onmousemove = ev => {
  //   const world = G_model_getCurrentWorld();
  //   const scale = G_model_getScale();
  //   if (G_model_shouldDrawTargetingLine()) {
  //     const { offsetX, offsetY } = ev;
  //     const targetType = G_model_getTargetType();
  //     const actor = G_model_playerGetActor(world.player);
  //     const [x, y] = G_model_actorGetPosition(actor);
  //     const tileSize = G_model_getTileSize();
  //     const tileSizeScaled = tileSize * scale;
  //     const targetPx = x * tileSizeScaled + tileSizeScaled / 2;
  //     const targetPy = y * tileSizeScaled + tileSizeScaled / 2;
  //     const tx = Math.floor(offsetX / tileSizeScaled);
  //     const ty = Math.floor(offsetY / tileSizeScaled);
  //     G_view_showTargetingLine(targetPx, targetPy, offsetX, offsetY);
  //     G_model_setHighlightedTiles(
  //       G_utils_getTargets(tx, ty, targetType as TargetArea),
  //       G_model_worldGetCurrentRoom(world)
  //     );
  //     debounceRender(world);
  //   } else {
  //     G_view_hideTargetingLine();
  //   }
  // };

  window.addEventListener('touchstart', ev => {
    // const event = ev as any;
    const canv = (ev as any)?.target;
    if (canv?.id === 'canv') {
      const x = ev.touches[0].clientX;
      const y = ev.touches[0].clientY;

      const cx = window.innerWidth / 2;
      let cy = window.innerHeight / 2;

      cy += getTileSize() * getScale();
      const angle = getAngleTowards([cx, cy], [x, y]);
      const dir = getDirectionFromAngle(angle);
      _movePlayer(dir);

      // const screenWidth = canv.width;
      // const screenHeight = canv.height;
    }
    // console.log('TARGET', target, event, event.offsetX, event.offsetY);

    // const handleTargetSelected = G_model_getTargetSelectedCb();
    // if (handleTargetSelected) {
    //   const world = G_model_getCurrentWorld();
    //   const { offsetX, offsetY } = ev;
    //   const tileSize = G_model_getTileSize() * 2;
    //   handleTargetSelected(
    //     Math.floor(offsetX / tileSize),
    //     Math.floor(offsetY / tileSize)
    //   );
    //   debounceRender(world);
    // }
  });
};

// const G_controller_getTargetedPosition = async (
//   targetType: TargetArea
// ): Promise<[number, number] | null> => {
//   return new Promise(resolve => {
//     G_model_setDrawTargetingLine(true);
//     G_model_setTargetType(targetType);
//     G_model_setTargetSelectedCb((x, y) => {
//       if (x > -1 && y > -1) {
//         G_view_hideTargetingLine();
//         G_model_unsetSelectedInventoryItemIndex();
//         resolve([x, y]);
//       } else {
//         resolve(null);
//       }
//       G_model_setTargetSelectedCb(null);
//       G_controller_stopTargeting();
//     });
//   });
// };

// const G_controller_stopTargeting = () => {
//   G_view_hideTargetingLine();
//   G_model_unsetSelectedInventoryItemIndex();
//   G_model_unsetHighlightedTiles(
//     G_model_worldGetCurrentRoom(G_model_getCurrentWorld())
//   );
//   const handleTargetSelected = G_model_getTargetSelectedCb();
//   if (handleTargetSelected) {
//     handleTargetSelected(-1, -1);
//   }
// };
