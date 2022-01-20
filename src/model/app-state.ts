import { Character } from './character';

export interface AppState {
  loading: boolean;
  bottomBar: AppStateBottomBar;
  sections: AppSection[];
  modal: AppStateModal;
  game: AppStateGame;
  dialog: AppStateDialog;
}

export enum BottomBarButtonType {
  INTERACT = 'INTERACT',
  LOOK = 'LOOK',
  LOCK_PICK = 'LOCK PICK',
  PICK_UP = 'PICK UP',
  STEAL = 'STEAL',
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
  selectedCh: Character | null;
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
  waitingForChoice: boolean;
  waitingForContinue: boolean;
  onChoice: (v: number) => void;
  onContinue: () => void;
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
      selectedCh: null,
    },
    dialog: {
      id: '',
      lines: [],
      choices: [],
      waitingForChoice: false,
      waitingForContinue: false,
      onChoice: () => void 0,
      onContinue: () => void 0,
    },
  };
};
