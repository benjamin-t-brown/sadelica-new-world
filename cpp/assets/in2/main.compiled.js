function run(isDryRun) {
  var files = {};
  var scope = {};
  var CURRENT_NODE_VAR = 'curIN2n';
  var CURRENT_FILE_VAR = 'curIN2f';
  var LAST_FILE_VAR = 'lasIN2f';
  player.set('scope', scope);
  files['main.json'] = function (id) {
    player.set(CURRENT_FILE_VAR, 'main.json');
    if (player.get('test') === undefined) player.set('test', 'value');
    // action
    scope.p1O = function () {
      player.set(CURRENT_NODE_VAR, 'p1O');
      scope.CzA();
    };

    // text
    scope.CzA = function () {
      player.set(CURRENT_NODE_VAR, 'CzA');
      var text = "The value of test is player.get('test').";
      core.say(text, scope.Bf4, 'CzA', 'Bf4');
    };

    // next_file
    scope.Bf4 = function () {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      var key = 'main.json';
      var func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };
    if (id === undefined) {
      scope.p1O();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };
  files.exit = function () {
    core.exit();
  };
  if (!isDryRun) {
    files['main.json']();
  }
  return {
    files: files,
    scope: scope,
  };
}
