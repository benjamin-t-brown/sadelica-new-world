var ctxId = -1;

function addLine(args) {
  cpp_say(args.line);
  resumeCb = args.cb;
}

var resumeCb = function () {};
function resumeExecution(arg) {
  resumeCb(arg);
}

function addDialogChoices(choices) {
  choices.forEach(function (c) {
    addLine({ line: c.line });
  });
  resumeCb = function (arg) {
    var choice = choices.find(c.id === arg);
    if (choice) {
      choice.cb();
    } else {
      log('Error, no choice found for nodeId=' + arg);
      log(
        choices
          .map(function (c) {
            return c.id;
          })
          .join(',')
      );
    }
  };
}

var core = {
  init(id) {
    log('init');
    ctxId = id;
    // in2 = run(true);
  },

  isChoiceNode(id) {
    var scope = player.get('scope');
    if (scope) {
      return scope[id || ''].isChoice;
    }
  },

  hasPickedChoice(id) {
    var nodes = player.get('nodes');

    if (nodes) {
      return nodes[id || ''];
    }
  },

  say(text, cb, nodeId, childId) {
    // log('SAY INNER', text);
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
    var actualChoices = choices
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

    addDialogChoices(
      actualChoices.map(function (c) {
        return {
          line: c.text,
          id: c.id,
          cb: c.cb,
        };
      })
    );
  },
  // async defer(func, args) {
  //   args = args || [this.get(CURRENT_NODE_VAR), this.get('curIN2f')];
  //   await func.apply(null, args);
  // },
  exit() {
    log('EXIT');

    // hideSection(AppSection.DIALOG);
  },
};

var player = {
  state: {
    //curIN2n
    //curIN2f
    //lasIN2f
    // coins: 100,
  },
  dontTriggerOnce: false,
  init: function () {
    player.state = {};
  },
  get: function (path) {},
  set: function (path, val) {},
  once: function () {
    var nodeId = player.get(CURRENT_NODE_VAR);
    var key = 'once.' + nodeId;
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
