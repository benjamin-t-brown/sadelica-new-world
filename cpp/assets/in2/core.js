var ctxId = -1;
var loggingEnabled = true;

var resumeCb = function () {};
function fromCpp_resumeExecution() {
  console.log('resumeExecution');
  resumeCb();
}
function fromCpp_chooseExecution(choiceId) {
  console.log('chooseExecution');
  return resumeCb(choiceId);
}

var console = {
  log: function (text) {
    if (loggingEnabled) {
      log(text);
    }
  },
  error: function (text) {
    log('ERR: ' + text);
  },
};

function fromCpp_runFile(fileName) {
  console.log('runFile: ' + fileName);
  var func = core.in2.files[fileName];
  if (func) {
    func();
    return 0;
  } else {
    console.log(
      'Cannot run file, it does not exist: ' +
        fileName +
        ',\n ' +
        Object.keys(core.in2.files).join('\n ')
    );
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
    console.log('init');
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
        addLine({ line: text, id: nodeId || '', cb });
        if (core.isChoiceNode(childId)) {
          cb();
        } else {
          cpp_setWaitingForResume(ctxId);
          resumeCb = cb;
        }
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
          text: choice.t,
          cb: function () {
            player.set('choice.' + choice.id, true);
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
    console.log('EXIT');
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
    console.log('get: ' + path + '=' + result);
    return ret;
  },
  set: function (path, val) {
    if (val === null || val === undefined) {
      val = true;
    }
    cpp_setString(ctxId, path, String(val));
    console.log('set: ' + path + '=' + String(val));
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
