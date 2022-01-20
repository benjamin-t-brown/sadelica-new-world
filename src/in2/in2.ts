import {
  addDialogLine as addLine,
  addDialogChoices,
  hideSection,
  resetBottomBarButtons,
} from 'controller/ui-actions';
import { AppSection } from 'model/app-state';

import { run } from 'in2/main.compiled';

const CURRENT_NODE_VAR = 'curIN2n';

interface WindowWithIn2 extends Window {
  core: any;
  player: any;
  IN2: boolean;
}

interface Choice {
  t: string;
  id: string;
  cb: () => void;
  c: () => boolean;
}

const windowWithIn2: WindowWithIn2 = window as any;

let in2: any = null;
export const executeDialog = (dialogName: string) => {
  const key = dialogName + '.json';
  const cb = in2.files[key];
  if (cb) {
    cb();
  } else {
    console.error(`Cannot play in2 dialog, no key exists: '${dialogName}'`);
  }
};

export const core = (windowWithIn2.core = /*eslint-disable-line*/ {
  async init() {
    console.log('[standalone] init');
    in2 = run(true);
  },

  isChoiceNode(id?: string) {
    const scope = player.get('scope');
    return scope?.[id ?? '']?.isChoice;
  },

  async say(
    text: string | string[],
    cb: () => void,
    nodeId?: string,
    childId?: string
  ): Promise<void> {
    return new Promise(resolve => {
      console.log('[standalone] SAY INNER', text);
      if (Array.isArray(text)) {
        if (text.length === 1) {
          addLine({ line: text[0], id: nodeId ?? '' });
          resolve();
        } else {
          core.say(text[0], () => {
            core.say(text.slice(1), () => {
              cb();
            });
            resolve();
          });
        }
      } else {
        if (text.length <= 1) {
          cb && cb();
          resolve();
          return;
        } else {
          addLine({ line: text, id: nodeId ?? '', cb });
        }
        if (core.isChoiceNode(childId)) {
          cb();
          // setTimeout(() => {
          // }, 1);
          resolve();
        }
      }
    });
  },
  async choose(text: string, nodeId: string, choices: Choice[]) {
    return new Promise<void>(resolve => {
      if (text) {
        addLine({ line: text, id: nodeId });
      }
      const actualChoices = choices
        .filter(choice => {
          if (choice.c()) {
            return true;
          } else {
            return false;
          }
        })
        .map((choice, i) => {
          return {
            id: choice.id,
            text: i + 1 + '. ' + choice.t,
            cb: async () => {
              choice.cb();
              resolve();
            },
          };
        });

      addDialogChoices({
        choices: actualChoices.map(c => {
          return {
            line: c.text,
            id: c.id,
          };
        }),
        choiceCallbacks: actualChoices.map(c => {
          return c.cb;
        }),
      });
    });
  },
  async defer(func, args) {
    args = args || [this.get(CURRENT_NODE_VAR), this.get('curIN2f')];
    await func.apply(null, args);
  },
  exit() {
    console.log('[standalone] EXIT');

    hideSection(AppSection.DIALOG);
    resetBottomBarButtons();
  },
});

const player = (windowWithIn2.player = /*eslint-disable-line*/ {
  state: {
    //curIN2n
    //curIN2f
    //lasIN2f
    coins: 100,
  },
  init() {
    this.state = {};
  },
  get(path: string) {
    const _helper = (paths: string[], obj: any) => {
      const k = paths.shift() as string;
      if (!paths.length) {
        return obj[k] === undefined ? undefined : obj[k];
      }

      const nextObj = obj[k];
      if (nextObj !== undefined) {
        return _helper(paths, nextObj);
      } else {
        return undefined;
      }
    };

    return _helper(path.split('.'), this.state);
  },
  set(path: string, val: any) {
    if (path === CURRENT_NODE_VAR) {
      this.set('nodes.' + val);
    }
    if (path === 'curIN2f') {
      this.set('files.' + val.replace('.json', ''));
    }
    val = val === undefined ? true : val;
    const _helper = (keys, obj) => {
      const k = keys.shift();
      if (k === undefined) {
        return;
      }
      if (!keys.length) {
        obj[k] = val;
        return;
      }

      if (!obj[k]) {
        obj[k] = {};
      }
      _helper(keys, obj[k]);
    };

    _helper(path.split('.'), this.state);
  },
  once() {
    const nodeId = this.get(CURRENT_NODE_VAR);
    const key = 'once.' + nodeId;
    if (!this.get(key)) {
      this.set(key);
      return true;
    }
    return false;
  },
  setIfUnset(path, val) {
    if (this.get(path) === undefined) {
      this.set(path, val);
    }
  },
  hasSpokenTo(fileName) {
    return player.get('files.' + fileName);
  },
});
