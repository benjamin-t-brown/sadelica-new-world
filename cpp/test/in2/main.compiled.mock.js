/**
 * IN2 Logic Tree File
 *
 * This file has been generated by an IN2 compiler.
 */
/*eslint-disable-line*/ function run(isDryRun) {
  /* global player, core, engine */
  var files = {};
  var scope = {};
  var CURRENT_NODE_VAR = 'curIN2n';
  var CURRENT_FILE_VAR = 'curIN2f';
  var LAST_FILE_VAR = 'lasIN2f';
  player.set('scope', scope);
  files['main1.json'] = function (id) {
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
      var text = 'The value of test is '.concat(player.get('test'), '.');
      core.say(text, scope.bni37boy1, 'CzA', 'bni37boy1');
    };

    // text
    scope.bni37boy1 = function () {
      player.set(CURRENT_NODE_VAR, 'bni37boy1');
      var text = 'This node currently has no actual content.';
      core.say(text, scope.ruquexdxr, 'bni37boy1', 'ruquexdxr');
    };

    // pass_fail
    scope.ruquexdxr = function () {
      player.set(CURRENT_NODE_VAR, 'ruquexdxr');
      var condition = (function () {
        return Boolean(player.get('CHECK_CHOICES'));
      })();
      if (condition) {
        player.set(CURRENT_NODE_VAR, 'e3x8twito');
        var text = '';
        core.say(text, scope.g63f035fo);
      }
      if (!condition) {
        player.set(CURRENT_NODE_VAR, 'kq8dfyt5q');
        var text = '';
        core.say(text, scope.Bf4);
      }
    };
    // choice
    scope.g63f035fo = function () {
      player.set(CURRENT_NODE_VAR, 'g63f035fo');
      var text = '';
      core.choose(text, 'g63f035fo', [
        {
          t: 'Test choice 1.',
          id: 'ghrlz0lnr',
          cb: scope.ghrlz0lnr,
          c: function c() {
            return true;
          },
        },
        {
          t: 'Test choice 2.',
          id: 'bbf376zr7',
          cb: scope.bbf376zr7,
          c: function c() {
            return true;
          },
        },
      ]);
    };
    scope['g63f035fo'].isChoice = true;

    // text
    scope.ghrlz0lnr = function () {
      player.set(CURRENT_NODE_VAR, 'ghrlz0lnr');
      var text = 'You picked choice 1.';
      core.say(text, scope.Bf4, 'ghrlz0lnr', 'Bf4');
    };

    // next_file
    scope.Bf4 = function () {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      var key = '';
      var func = files[key];
      if (func) {
        func();
      } else {
        files.exit();
      }
    };

    // text
    scope.bbf376zr7 = function () {
      player.set(CURRENT_NODE_VAR, 'bbf376zr7');
      var text = 'You picked choice 2.';
      core.say(text, scope.Bf4, 'bbf376zr7', 'Bf4');
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