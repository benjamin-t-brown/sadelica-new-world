core = {
  init() {
    log('[standalone] init');
    // in2 = run(true);
  },

  isChoiceNode(id) {
    const scope = player.get('scope');
    if (scope) {
      return scope[id || ''].isChoice;
    }
  },

  hasPickedChoice(id) {
    const nodes = player.get('nodes');

    if (nodes) {
      return nodes[id || ''];
    }
  },

  say(text, cb, nodeId, childId) {
    log('[standalone] SAY INNER', text);
    if (Array.isArray(text)) {
      if (text.length === 1) {
        addLine({ line: text[0], id: nodeId || '' });
      } else {
        core.say(text[0], function () {
          core.say(text.slice(1), function () {
            cb();
          });
        });
      }
    } else {
      if (text.length <= 1) {
        cb && cb();
        return;
      } else {
        addLine({ line: text, id: nodeId || '', cb });
      }
      if (core.isChoiceNode(childId)) {
        cb();
      }
    }
  },
  choose(text, nodeId, choices) {
    if (text) {
      addLine({ line: text, id: nodeId });
    }
    const actualChoices = choices
      .filter(function (choice) {
        player.dontTriggerOnce = true;
        if (choice.c()) {
          player.dontTriggerOnce = false;
          return true;
        } else {
          player.dontTriggerOnce = false;
          return false;
        }
      })
      .map(function (choice, i) {
        return {
          id: choice.id,
          text: i + 1 + '. ' + choice.t,
          cb: function () {
            choice.cb();
          },
        };
      });

    addDialogChoices({
      choices: actualChoices.map(function (c) {
        return {
          line: c.text,
          id: c.id,
        };
      }),
      choiceCallbacks: actualChoices.map(function (c) {
        return c.cb;
      }),
    });
  },
  // async defer(func, args) {
  //   args = args || [this.get(CURRENT_NODE_VAR), this.get('curIN2f')];
  //   await func.apply(null, args);
  // },
  exit() {
    log('[standalone] EXIT');

    // hideSection(AppSection.DIALOG);
  },
};

const player = {
  state: {
    //curIN2n
    //curIN2f
    //lasIN2f
    coins: 100,
  },
  dontTriggerOnce: false,
  init: function () {
    player.state = {};
  },
  get: function (path) {
    const _helper = function (paths, obj) {
      const k = paths.shift();
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

    return _helper(path.split('.'), player.state);
  },
  set: function (path, val) {
    if (path === CURRENT_NODE_VAR) {
      player.set('nodes.' + val);
    }
    if (path === 'curIN2f') {
      player.set('files.' + val.replace('.json', ''));
    }
    val = val === undefined ? true : val;
    const _helper = function (keys, obj) {
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

    _helper(path.split('.'), player.state);
  },
  once: function () {
    const nodeId = player.get(CURRENT_NODE_VAR);
    const key = 'once.' + nodeId;
    if (!player.get(key)) {
      if (!player.dontTriggerOnce) {
        player.set(key);
      }
      return true;
    }
    return false;
  },
  setIfUnset: function (path, val) {
    if (player.get(path) === undefined) {
      player.set(path, val);
    }
  },
  hasSpokenTo: function (fileName) {
    return player.get('files.' + fileName);
  },
};
