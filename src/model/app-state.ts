import { stringify } from 'querystring';
import { Actor } from './actor';
import { Sprite } from './canvas';

export interface AppState {
  loading: boolean;
  bottomBar: AppStateBottomBar;
  sections: AppSection[];
  modal: AppStateModal;
  game: AppStateGame;
  dialog: AppStateDialog;
  store: AppStateStore;
}

export enum BottomBarButtonType {
  INTERACT = 'INTERACT',
  LOOK = 'LOOK',
  PICK_UP = 'PICK UP',
  STEAL = 'STEAL',
  CAST = 'CAST',
  MENU = 'MENU',
}

export interface BottomBarButton {
  type: BottomBarButtonType;
}
export interface AppStateBottomBar {
  visible: boolean;
  buttons: BottomBarButton[];
}

export enum AppSection {
  START_MENU = 'START_MENU',
  MODAL = 'MODAL',
  GAME = 'GAME',
  GAME_MENU = 'GAME_MENU',
  STORE = 'STORE',
  DIALOG = 'DIALOG',
}

export interface AppStateModal {
  text: string;
  headerText: string;
  title: string;
  sprite: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export enum InventoryState {
  BARE = 'BARE',
  HALF = 'HALF',
  FULL = 'FULL',
}
export interface AppStateGame {
  inventoryState: InventoryState;
  selectedCh: Actor | null;
  worldName: string;
  interactables: Actor[];
}

export interface AppStateDialogLine {
  line: string;
  id: string;
  color?: string;
}
export interface AppStateDialog {
  id: string;
  lines: AppStateDialogLine[];
  choices: AppStateDialogLine[];
  actorName: string;
  portraitSprite: Sprite | null;
  borderSprite: Sprite | null;
  waitingForChoice: boolean;
  waitingForContinue: boolean;
  onChoice: (v: number) => void;
  onContinue: () => void;
}

export interface StoreItem {
  itemName: string;
  quantity: number;
  price: number;
}
export interface AppStateStore {
  name: string;
  sprite: string;
  items: StoreItem[];
}

export const createAppState = (): AppState => {
  return {
    loading: true,
    bottomBar: {
      visible: true,
      buttons: [],
    },
    sections: [],
    modal: {
      title: '',
      sprite: '',
      headerText: '',
      text: '',
      onConfirm: () => void 0,
      onCancel: () => void 0,
    },
    game: {
      inventoryState: InventoryState.BARE,
      worldName: '',
      selectedCh: null,
      interactables: [],
    },
    dialog: {
      id: '',
      lines: [],
      choices: [],
      actorName: '',
      portraitSprite: null,
      borderSprite: null,
      waitingForChoice: false,
      waitingForContinue: false,
      onChoice: () => void 0,
      onContinue: () => void 0,
    },
    store: {
      name: '',
      sprite: '',
      items: [],
    },
  };
};
