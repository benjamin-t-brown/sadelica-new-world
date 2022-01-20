import {
  AppState,
  AppSection,
  InventoryState,
  BottomBarButton,
  AppStateModal,
  BottomBarButtonType,
  AppStateDialog,
  AppStateDialogLine,
} from 'model/app-state';
import { Character } from 'model/character';
import { Player } from 'model/player';
import { colors } from 'view/style';
import { executeDialog } from 'in2';
import { getCurrentPlayer } from 'model/generics';

export interface UIInterface {
  appState: AppState;
  render: () => void;
  dispatch: (...args: any) => void;
}

export let uiInterface: UIInterface | null = null;
export const getUiInterface = () => uiInterface as UIInterface;
export const setUiInterface = (iFace: any) => (uiInterface = iFace);

export interface ReducerAction<T> {
  action: string;
  payload: T;
}

type MutationFunction = (
  newState: AppState,
  payload?: any,
  oldState?: AppState
) => void;

const resolvers: { [key: string]: MutationFunction } = {
  hideSections: (newState: AppState) => {
    newState.sections = [];
  },
  showSection: (newState: AppState, payload: { section: AppSection }) => {
    newState.loading = false;
    if (!newState.sections.includes(payload.section)) {
      newState.sections.push(payload.section);
    }
  },
  hideSection: (newState: AppState, payload: { section: AppSection }) => {
    const sections = newState.sections.filter(
      section => section !== payload.section
    );
    newState.sections = sections;
  },
  setBottomButtons: (
    newState: AppState,
    payload: { buttons: BottomBarButton[] }
  ) => {
    newState.bottomBar.buttons = payload.buttons.slice();
  },
  setGameInventoryState: (
    newState: AppState,
    payload: { inventoryState: InventoryState }
  ) => {
    newState.game.inventoryState = payload.inventoryState;
  },
  setGameSelectedCharacter: (
    newState: AppState,
    payload: { ch: Character | null }
  ) => {
    newState.game.selectedCh = payload.ch;
  },
  setModalSection: (newState: AppState, payload: Partial<AppStateModal>) => {
    newState.modal = {
      ...newState.modal,
      ...payload,
    };
  },
  setDialogSection: (newState: AppState, payload: Partial<AppStateDialog>) => {
    newState.dialog = {
      ...newState.dialog,
      ...payload,
    };
  },
};

export const appReducer = function <T>(
  oldState: AppState,
  action: ReducerAction<T>
) {
  const newState = { ...oldState };
  const mutation = resolvers[action.action];
  if (mutation) {
    mutation(newState, action.payload, oldState);
    console.log('MUTATE STATE', action);
  } else {
    console.error(
      `Action without a reducer mutation: "${action.action}"`,
      action
    );
  }
  return newState;
};

export const renderUi = (): void => {
  const uiInterface = getUiInterface();
  if (uiInterface) {
    // console.trace('render');
    uiInterface.render();
  }
};

export const showSection = (section: AppSection) => {
  getUiInterface().dispatch({
    action: 'showSection',
    payload: {
      section,
    },
  });
};

export const hideSection = (section: AppSection) => {
  getUiInterface().dispatch({
    action: 'hideSection',
    payload: {
      section,
    },
  });
};

export const hideSections = () => {
  getUiInterface().dispatch({
    action: 'hideSections',
    payload: {},
  });
};

export const setBottomButtons = (buttons: BottomBarButton[]) => {
  getUiInterface().dispatch({
    action: 'setBottomButtons',
    payload: {
      buttons,
    },
  });
};

export const resetBottomBarButtons = () => {
  setBottomButtons([
    {
      type: BottomBarButtonType.INTERACT,
    },
    {
      type: BottomBarButtonType.LOOK,
    },
    {
      type: BottomBarButtonType.LOCK_PICK,
    },
    {
      type: BottomBarButtonType.PICK_UP,
    },
    {
      type: BottomBarButtonType.STEAL,
    },
    {
      type: BottomBarButtonType.MENU,
    },
  ]);
};

export const showGame = () => {
  showSection(AppSection.GAME);
  resetBottomBarButtons();
};
export const setGameInventoryState = (inventoryState: InventoryState) => {
  getUiInterface().dispatch({
    action: 'setGameInventoryState',
    payload: {
      inventoryState,
    },
  });
  if (inventoryState === InventoryState.FULL) {
    setBottomButtons([]);
  } else {
    resetBottomBarButtons();
  }
};
export const setGameSelectedCharacter = (ch: Character | null) => {
  getUiInterface().dispatch({
    action: 'setGameSelectedCharacter',
    payload: {
      ch,
    },
  });
};

export const showModal = (args: Partial<AppStateModal>) => {
  getUiInterface().dispatch({
    action: 'setModalSection',
    payload: {
      text: args.text ?? 'text',
      headerText: args.headerText ?? 'headerText',
      title: args.title ?? 'DIALOG',
      sprite: args.sprite ?? '',
      onConfirm: args.onConfirm ?? undefined,
      onCancel: args.onCancel ?? undefined,
    },
  });
  showSection(AppSection.MODAL);
};

export const showDialog = (dialogName: string) => {
  showSection(AppSection.DIALOG);
  getUiInterface().dispatch({
    action: 'setDialogSection',
    payload: {
      lines: [],
      choices: [],
      waitingForChoice: false,
      waitingForContinue: false,
    },
  });
  setBottomButtons([]);
  executeDialog(dialogName);
};

export const addDialogLine = (args: {
  id: string;
  line: string;
  color?: string;
  cb?: () => void;
}) => {
  const uiInterface = getUiInterface();
  const lines = uiInterface.appState.dialog.lines.slice();

  const action = {
    action: 'setDialogSection',
    payload: {
      lines: lines.concat([
        {
          id: args.id,
          line: args.line,
          color: args.color ?? colors.WHITE,
        },
      ]),
    } as Partial<AppStateDialog>,
  };

  if (args.cb) {
    action.payload.onContinue = () => {
      getUiInterface().dispatch({
        action: 'setDialogSection',
        payload: {
          waitingForContinue: false,
          onContinue: undefined,
        },
      });

      if (args.cb) {
        args.cb();
      }
    };
    action.payload.waitingForContinue = true;
  }

  uiInterface.dispatch(action);
};

export const addDialogChoices = (args: {
  choices: AppStateDialogLine[];
  choiceCallbacks: (() => void)[];
}) => {
  const uiInterface = getUiInterface();

  const action = {
    action: 'setDialogSection',
    payload: {
      choices: args.choices,
      waitingForChoice: true,
      waitingForContinue: false,
      onChoice: (ind: number) => {
        const uiInterface = getUiInterface();
        const lines = uiInterface.appState.dialog.lines.slice();
        uiInterface.dispatch({
          action: 'setDialogSection',
          payload: {
            choices: [],
            lines: lines.concat([
              {
                id: '',
                line:
                  `${getCurrentPlayer().name} - ` +
                  args.choices[ind].line.slice(3),
                color: colors.YELLOW,
              },
            ]),
            waitingForChoice: false,
            onChoice: undefined,
          },
        });

        setTimeout(() => {
          const choiceCb = args.choiceCallbacks[ind];
          if (!choiceCb) {
            console.error('Invalid choice index given: ', ind);
          } else {
            choiceCb();
          }
        }, 1);
      },
    } as Partial<AppStateDialog>,
  };

  uiInterface.dispatch(action);
};
