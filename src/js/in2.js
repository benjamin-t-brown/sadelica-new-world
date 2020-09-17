/*
global
G_model_getDialogLines
G_controller_hideDialog
G_view_renderUi
G_utils_waitMs
*/

const FADED_COLOR = '#9D9D9D';
const PRESS_ANY_KEY = 'Press any key or click here to continue.';

// let loaded = false;
const IS_IN2 = !!window.IN2;
async function load() {
  // if (loaded) {
  //   console.log('[standalone] Already loaded.');
  //   return;
  // }
  // loaded = true;
}

var core = (window.core = /*eslint-disable-line*/ {
  async init() {
    console.log('[standalone] init');
    await load();
  },

  async say(text, cb) {
    console.log('[standalone] SAY INNER', text);
    if (typeof text === 'object') {
      if (text.length === 1) {
        addLine(text);
      } else {
        core.say(text[0], () => {
          core.say(text.slice(1), cb);
        });
        return;
      }
    } else {
      if (text.length <= 1) {
        cb && cb();
        return;
      } else {
        addLine(text);
        addLine(PRESS_ANY_KEY, FADED_COLOR, cb);
      }
    }

    if (IS_IN2) {
      return;
    }

    return new Promise(resolve => {
      catcher.setK(() => {
        if (cb) {
          cb();
        }
        resolve();
      });
    });
  },
  async choose(text, nodeId, choices) {
    return new Promise(resolve => {
      if (text) {
        addLine(text, FADED_COLOR);
      } else {
        addLine('Select an option.', FADED_COLOR);
      }
      addLine('-----', FADED_COLOR);
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
            text: i + 1 + '.) ' + choice.t,
            cb: async () => {
              this.onChoose();
              await choice.cb();
              resolve();
            },
          };
        });
      actualChoices.forEach(({ text, cb }) => {
        addLine(text, '#F7E26B', cb);
      });
      addLine('-----', FADED_COLOR);
      const onChoose = async key => {
        const choice = actualChoices[key - 1];
        if (choice) {
          catcher.setK(() => {});
          // addLine('');
          addLine(choice.text, '#EB8931');
          // addLine('');
          await choice.cb();
          resolve();
        }
      };
      catcher.setK(onChoose);
    });
  },
  onChoose() {
    G_model_getDialogLines().forEach(lineObj => {
      lineObj.cb = undefined;
    });
  },
  async defer(func, args) {
    args = args || [this.get('curIN2n'), this.get('curIN2f')];
    await func.apply(null, args);
  },

  exit() {
    console.log('[standalone] EXIT');
    catcher.setK(() => {});
    G_controller_hideDialog();
  },
});

var player = (window.player = /*eslint-disable-line*/ {
  state: {
    //curIN2n
    //curIN2f
    //lasIN2f
  },
  init() {
    this.state = {};
  },
  get(path) {
    let _helper = (paths, obj) => {
      let k = paths.shift();
      if (!paths.length) {
        return obj[k] === undefined ? undefined : obj[k];
      }

      let nextObj = obj[k];
      if (nextObj !== undefined) {
        return _helper(paths, nextObj);
      } else {
        return undefined;
      }
    };

    return _helper(path.split('.'), this.state);
  },
  set(path, val) {
    val = val === undefined ? true : val;
    let _helper = (keys, obj) => {
      let k = keys.shift();
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
  setIfUnset(path, val) {
    if (this.get(path) === undefined) {
      this.set(path, val);
    }
  },
});

var addLine = (text, color, cb) => {
  const lines = G_model_getDialogLines();
  const lastLine = lines[lines.length - 1];
  if (lastLine && lastLine.text === PRESS_ANY_KEY) {
    lines.splice(lines.length - 1, 1);
  }
  G_model_getDialogLines().push({ text, color, cb });
  G_view_renderUi();
  document.getElementById('dialog').scrollTop = 999999;
};

var catcher = new (function () {
  let cb = () => {};
  this.setK = _cb => (cb = _cb);
  window.addEventListener('keydown', ev => {
    if (this.disabled) {
      return;
    }
    cb(String.fromCharCode(ev.which));
  });
})();
