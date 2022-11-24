var ctxId = -1;

var resumeCb = function () {};
function fromCpp_resumeExecution() {
  resumeCb();
}
function fromCpp_chooseExecution(choiceId) {
  return resumeCb(choiceId);
}

function fromCpp_runFile(fileName) {
  var func = core.in2.files[fileName];
  if (func) {
    func();
    return 0;
  } else {
    return 1;
  }
}

function addLine(args) {
  player.set('nodes.' + args.id);
  cpp_say(ctxId, args.line);
}

function addDialogChoices(choices) {
  const args = choices.reduce(
    function (agg, c) {
      agg.push(c.line);
      agg.push(c.id);
      return agg;
    },
    [ctxId]
  );
  resumeCb = function (arg) {
    var choiceInd = choices
      .map(function (c) {
        return c.id;
      })
      .indexOf(arg);
    var choice = choices[choiceInd];
    // log('Pick choice ' + choiceInd + ' ' + arg + ' ' + JSON.stringify(choices));
    if (choice) {
      player.set('nodes.' + choice.id);
      choice.cb();
      return 0;
    } else {
      return 1;
    }
  };
  cpp_setWaitingForChoice(ctxId);
  cpp_choose.apply(null, args);
}

var core = {
  init(id) {
    log('init');
    ctxId = id;
    var obj = run(true);
    core.in2 = obj;
  },

  isChoiceNode(id) {
    var obj = core.in2.scope[id];
    if (obj) {
      return obj.isChoice;
    }
    return false;
  },

  hasPickedChoice(id) {
    return player.get('nodes.' + id);
  },

  say(text, cb, nodeId, childId) {
    if (Array.isArray(text)) {
      if (text.length === 1) {
        // is this even used?
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
        cpp_setWaitingForResume(ctxId);
        addLine({ line: text, id: nodeId || '', cb });
        resumeCb = cb;
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
            player.set(choice.id, true);
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
  exit() {
    log('EXIT');
    cpp_setExecutionCompleted(ctxId);
  },
};

var UNDEFINED = 'STORAGE_IN2_UNDEFINED';
var CURRENT_NODE_VAR = 'curIN2n';
var CURRENT_FILE_VAR = 'curIN2f';
var LAST_FILE_VAR = 'lasIN2f';

var player = {
  dontTriggerOnce: false,
  init: function () {},
  get: function (path) {
    var result = cpp_getString(ctxId, path);
    var numResult = parseFloat(result);
    var ret = undefined;
    if (result === 'true') {
      ret = true;
    } else if (result === 'false') {
      ret = false;
    } else if (result === '') {
      ret = undefined;
    } else if (!isNaN(numResult)) {
      ret = numResult;
    } else {
      ret = result;
    }
    // log('get: ' + path + '=' + result);
    return ret;
  },
  set: function (path, val) {
    if (val === null || val === undefined) {
      val = true;
    }
    cpp_setString(ctxId, path, String(val));
    // log('set: ' + path + '=' + String(val));
  },
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
