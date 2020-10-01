/*
global
G_view_drawSprite
G_model_playerGetWorldPosition
G_model_actorGetPosition
G_model_playerGetActor
*/

let model_world: World | null = null;
let model_soundEnabled = true;
let model_inputDisabled = false;
let model_drawTargetingLine = false;
let model_selectedInventoryItemIndex = -1;
let model_handleTargetSelected: ((x: number, y: number) => void) | null = null;
let model_targetType: TargetArea | null = null;
let model_updateUiThisRound: boolean = false;
let model_isVictory = false;
let model_dialogVisible = false;
let model_dialogActor: Actor | null = null;
let model_dialogLines: { text: string; color?: string; cb?: () => void }[] = [];
let model_leftPaneOverlayVisible = false;
let model_rightPaneOverlayVisible = false;

const G_model_setLeftPaneOverlayVisible = (v: boolean) =>
  (model_leftPaneOverlayVisible = v);
const G_model_getLeftPaneOverlayVisible = () => model_leftPaneOverlayVisible;
const G_model_setRightPaneOverlayVisible = (v: boolean) =>
  (model_rightPaneOverlayVisible = v);
const G_model_getRightPaneOverlayVisible = () => model_rightPaneOverlayVisible;

const G_model_getScale = (): number => 2;
const G_model_setCurrentWorld = (world: World) => (model_world = world);
const G_model_getCurrentWorld = (): World => model_world as World;
const G_model_getRoomSize = () => 64;
const G_model_getWorldSize = () => 4;
const G_model_getTileSize = () => 16;
const G_model_getRoomAt = (
  wx: number,
  wy: number,
  world: World
): Room | null => {
  const worldSize = G_model_getWorldSize();
  if (wx < 0 || wy < 0 || wx >= worldSize || wy >= worldSize) {
    return null;
  }
  return world.rooms[wy * worldSize + wx] || null;
};
const G_model_getCurrentPlayer = () => G_model_getCurrentWorld().player;

const G_model_isInputDisabled = (): boolean => model_inputDisabled;
const G_model_setInputDisabled = (v: boolean) => (model_inputDisabled = v);

const G_model_setSoundEnabled = (v: boolean) => (model_soundEnabled = v);
const G_model_isSoundEnabled = () => model_soundEnabled;
const G_model_setTargetSelectedCb = (
  cb: null | ((x: number, y: number) => void)
) => (model_handleTargetSelected = cb);
const G_model_getTargetSelectedCb = ():
  | ((x: number, y: number) => void)
  | null => model_handleTargetSelected;
const G_model_setDrawTargetingLine = (v: boolean) =>
  (model_drawTargetingLine = v);
const G_model_shouldDrawTargetingLine = (): boolean => model_drawTargetingLine;
const G_model_setSelectedInventoryItemIndex = (n: number) =>
  (model_selectedInventoryItemIndex = n);
const G_model_getSelectedInventoryItemIndex = () =>
  model_selectedInventoryItemIndex;
const G_model_unsetSelectedInventoryItemIndex = () =>
  G_model_setSelectedInventoryItemIndex(-1);
const G_model_getTargetType = (): TargetArea | null => {
  return model_targetType;
};
const G_model_setTargetType = (v: TargetArea | null) => {
  model_targetType = v;
};

const G_model_getCamera = (world: World): Rect => {
  const player = world.player;
  const actor = G_model_playerGetActor(player);
  const cameraViewSize = 17;
  const roomSize = G_model_getRoomSize();
  const [x, y] = G_model_actorGetPosition(actor);
  const camera: Rect = [
    x - Math.floor(cameraViewSize / 2),
    y - Math.floor(cameraViewSize / 2),
    cameraViewSize,
    cameraViewSize,
  ];
  if (camera[0] < 0) {
    camera[0] = 0;
  } else if (camera[0] + camera[2] >= roomSize) {
    camera[0] = roomSize - camera[2];
  }
  if (camera[1] < 0) {
    camera[1] = 0;
  } else if (camera[1] + camera[3] >= roomSize) {
    camera[1] = roomSize - camera[3];
  }
  return camera;
};

// const G_model_addLog = (l: string) => {
//   model_logs.push(l);
//   if (model_logs.length > 999) {
//     model_logs.unshift();
//   }
// };
// const G_model_getLogs = () => {
//   return model_logs;
// };

const G_model_setUpdateUiThisRound = (v: boolean) =>
  (model_updateUiThisRound = v);
const G_model_getUpdateUiThisRound = (): boolean => model_updateUiThisRound;
const G_model_setIsVictory = (v: boolean) => (model_isVictory = v);
const G_model_getIsVictory = (): boolean => model_isVictory;

const G_model_getDialogLines = (): {
  text: string;
  color?: string;
  cb?: () => void;
}[] => model_dialogLines;
const G_model_getDialogVisible = (): boolean => model_dialogVisible;
const G_model_setDialogVisible = (v: boolean) => (model_dialogVisible = v);
const G_model_setDialogActor = (v: Actor | null) => {
  model_dialogActor = v;
};
const G_model_getDialogActor = () => model_dialogActor;
