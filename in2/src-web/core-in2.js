const $ = require('jquery');
const expose = require('expose');
const utils = require('utils');

window.IN2 = true;

const LOCAL_STORAGE_SAVE_STATE_KEY = 'in2_save_state';

exports.setSaveData = initialState => {
  localStorage.setItem(
    LOCAL_STORAGE_SAVE_STATE_KEY,
    JSON.stringify(initialState)
  );
};
exports.getSaveData = () => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_SAVE_STATE_KEY) || '{}');
};

const _console_log = (text, onClick) => {
  expose.get_state('player-area').add_line(text || '', onClick);
};

class KeyCatcher {
  constructor() {
    this.disabled = false;
    this.cb = () => {};

    this.onKeypress = ev => {
      if (this.disabled) {
        return;
      }
      this.cb(String.fromCharCode(ev.which));
    };

    this.onMouseDown = ev => {
      this.onKeypress(ev);
    };

    window.addEventListener('keydown', this.onKeypress);
    //window.addEventListener('mousedown', this.onMouseDown);
  }

  setKeypressEvent(cb) {
    this.cb = cb;
  }

  unsetKeypressEvent() {
    window.removeEventListener('keydown', this.onKeyPress);
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }
}

let disable_next_say_wait = false;
let last_choose_node_id = null;
let last_choose_nodes_selected = [];

exports._core = {
  in2: true,
  catcher: new KeyCatcher(),
  scope: null,
  async init(canvasId) {
    disable_next_say_wait = false;
    last_choose_node_id = null;
    last_choose_nodes_selected = [];
    if (this.origCore) {
      await this.origCore.init(canvasId);
    }
  },

  centerAtActiveNode() {
    const board = expose.get_state('board');
    board.removeAllExtraClasses();
    const active_node_id = exports.player().get('curIN2n');
    const active_file_name = exports.player().get('curIN2f');
    if (active_node_id) {
      expose
        .get_state('file-browser')
        .loadFileExternal(active_file_name, () => {
          const elem = document.getElementById(active_node_id);
          if (elem) {
            board.centerOnNode(active_node_id);
            $('#' + active_node_id).css('outline', '4px solid green');
          }
        });
    }
  },

  isChoiceNode(id) {
    const scope = exports._player.get('scope');
    return scope?.[id]?.isChoice;
  },

  async say(text, cb, id, childId) {
    this.centerAtActiveNode();
    if (this.origCore) {
      this.origCore.say(text, cb);
    }
    if (typeof text === 'object') {
      if (text.length === 1) {
        _console_log(text);
      } else {
        exports.say(text[0], () => {
          exports.say(text.slice(1), cb);
        });
        return;
      }
    } else {
      if (text.length <= 1) {
        cb && cb();
        return;
      } else {
        _console_log(text);
      }
    }

    if (disable_next_say_wait || this.isChoiceNode(childId)) {
      setTimeout(() => {
        cb();
      }, 1);
      return;
    }
    return new Promise(resolve => {
      _console_log();
      _console_log('&nbsp&nbsp&nbsp&nbsp&nbspPress any key to continue...');
      this.currentCatcherEvent = () => {
        expose.get_state('player-area').remove_line();
        cb && cb();
        resolve();
      };
      this.catcher.setKeypressEvent(this.currentCatcherEvent);
    });
  },

  async choose(text, node_id, choices) {
    return new Promise((resolve, reject) => {
      try {
        this.centerAtActiveNode();
        if (text) {
          _console_log(text);
          _console_log();
        }
        _console_log();
        _console_log('---------');
        const actual_choices = choices.filter(choice => {
          if (choice.c()) {
            return true;
          } else {
            return false;
          }
        });
        if (last_choose_node_id === node_id) {
          // actual_choices = actual_choices.filter( ( choice ) => {
          // 	return last_choose_nodes_selected.indexOf( choice.t ) === -1;
          // } );
        } else {
          last_choose_node_id = node_id;
          last_choose_nodes_selected = [];
        }
        let ctr = 1;
        actual_choices.forEach((choice, i) => {
          _console_log('  ' + ctr + '.) ' + choice.t, () => {
            console.log('ON CHOOSE ', i);
            onChoose(i + 1);
          });
          ctr++;
        });
        _console_log('---------');
        const onChoose = async key => {
          const choice = actual_choices[key - 1];
          if (choice) {
            last_choose_nodes_selected.push(choice.t);
            this.catcher.setKeypressEvent(() => {});
            _console_log();
            _console_log(choice.t);
            _console_log();
            if (this.origCore) {
              this.origCore.onChoose();
            }
            await choice.cb();
            disable_next_say_wait = false;
            resolve();
          }
        };
        this.currentCatcherEvent = onChoose;
        this.catcher.setKeypressEvent(this.currentCatcherEvent);
        if (this.origCore) {
          this.origCore.choose(
            text,
            node_id,
            choices.map(choice => {
              return {
                ...choice,
                cb: async () => {
                  last_choose_nodes_selected.push(choice.t);
                  this.catcher.setKeypressEvent(() => {});
                  _console_log();
                  _console_log(choice.t);
                  _console_log();
                  if (this.origCore) {
                    this.origCore.onChoose();
                  }
                  await choice.cb();
                  disable_next_say_wait = false;
                  resolve();
                },
              };
            })
          );
        }
      } catch (e) {
        console.error('reject');
        reject(e);
        expose.set_state('player-area', {
          errors: [
            {
              text: 'Error during evaluation: ' + e.toString(),
              filename: 'current',
              node_id,
            },
          ],
        });
      }
    });
  },

  exit() {
    this.catcher.setKeypressEvent(function () {});
    if (this.origCore) {
      this.origCore.exit();
    } // console.log('BYE!');
  },
};

exports._player = {
  state: exports.getSaveData(),
  name: 'default',
  init() {
    this.state = exports.getSaveData();
  },

  print() {
    _console_log(this.state);
  },

  get(path) {
    let _helper = (paths, obj) => {
      let k = paths.shift();
      if (!paths.length) {
        return obj[k] === undefined ? undefined : obj[k];
      }

      let next_obj = obj[k];
      if (next_obj !== undefined) {
        return _helper(paths, next_obj);
      } else {
        return undefined;
      }
    };

    return _helper(path.split('.'), this.state);
  },

  set(path, val) {
    if (path === 'curIN2n') {
      this.set('nodes.' + val);
    }
    if (path === 'curIN2f') {
      this.set('files.' + val.replace('.json', ''));
    }
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

  once() {
    const nodeId = this.get('curIN2n');
    const key = 'once.' + nodeId;
    if (!this.get(key)) {
      this.set(key);
      return true;
    }
    return false;
  },
};

exports.core = function () {
  return exports._core;
};

exports.player = function () {
  return window.player;
};

exports.disable = function () {
  exports._core.catcher.disable();
  exports._core.exit();
};

exports.enable = function () {
  exports._core.catcher.enable();
};

window.addEventListener('unhandledrejection', function (promiseRejectionEvent) {
  _console_log('EXECUTION WARNING ' + promiseRejectionEvent.reason);
});

function evalInContext(js, context) {
  return function () {
    return eval(js); //eslint-disable-line no-eval
  }.call(context);
}

const postfix = `
window.core = window.core.origCore || window.core;
window._core.origCore = window.core;
window.player = {...player, ...window._player};
window.core = {...core, origCore: core, ...window._core};
`;

let standalone = '';
exports.runFile = async function (file) {
  _console_log('Success!');
  _console_log('');
  if (!standalone) {
    standalone = (await utils.get('/standalone/')).data;
    eval(standalone);
  }
  console.log('Now evaluating...');
  window._core = exports._core;
  window._player = exports._player;

  const evalStr =
    '{\ntry {' +
    postfix +
    '\n' +
    `
${file}
async function main() {
  console.log('Loading...');
  await core.init('player-canvas');
  player.init();
  // console.log('Run!', core);
  run();
}
main();
} catch (e) {
console.error(e);
alert('There was an error evaluating the script.');
}
}`;
  try {
    const existingScript = document.getElementById('in2-injection');
    if (existingScript) {
      existingScript.remove();
    }
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = evalStr;
    script.id = 'in2-injection';
    document.body.appendChild(script);
    window.player = exports._player;
  } catch (e) {
    console.error(e, e.stack);
    //console.log(evalStr);
  }
};

exports.runFileDry = async function (file) {
  const flatten = prevState => {
    const errors = [];
    const keys = {};
    const fileNames = {};
    for (let fileName in prevState) {
      for (let key in prevState[fileName]) {
        const type = typeof keys[key];
        if (type === 'string' || type === 'number') {
          errors.push(
            `Duplicate key declared: '${key}' (${fileName}) and (${fileNames[key]})`
          );
        } else {
          if (type === 'object') {
            keys[key] = {
              ...keys[key],
              ...prevState[fileName][key],
            };
            fileNames[key] = fileName;
          } else {
            keys[key] = prevState[fileName][key];
            fileNames[key] = fileName;
          }
        }
      }
    }
    if (errors.length) {
      keys.errors = errors;
    }
    return keys;
  };

  standalone = (await utils.get('/standalone/')).data;
  const context = {};
  const evalStr = standalone + '\n' + postfix + '\n(' + file + ')(true)';
  window._core = exports._core;
  window._player = exports._player;
  console.log('Now evaluating dry...');
  const states = {};
  try {
    let result = evalInContext(evalStr, context);
    for (let i in result.files) {
      if (i === 'exit') {
        continue;
      }
      exports._player.init();
      result = evalInContext(evalStr, context);
      const playerState = result.files[i](false);
      states[i] = { ...playerState };
      delete states[i].curIN2f;
    }
    const flattenedState = flatten(states);
    states._ = flattenedState;
    return states;
  } catch (e) {
    console.error(e, e.stack);
    return {};
  }
};
