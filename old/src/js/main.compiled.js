/**
 * IN2 Logic Tree File
 *
 * This file has been generated by an IN2 compiler.
 */
/*eslint-disable-line*/ function run(isDryRun) {
  /* global player, core, engine */
  const files = {};
  const scope = {};
  const CURRENT_NODE_VAR = 'curIN2n';
  const CURRENT_FILE_VAR = 'curIN2f';
  const LAST_FILE_VAR = 'lasIN2f';

  files[`main.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'main.json');
    if (player.get('test') === undefined) player.set('test', 'value');
    // action
    scope.RM9 = () => {
      player.set(CURRENT_NODE_VAR, 'RM9');
      engine.setBackground('bg-floor1-left');
      engine.setConversation2(
        'Adalais',
        'ada-regular',
        'Iroha',
        'iroha-regular'
      );
      scope.p1O();
    };

    // action
    scope.p1O = () => {
      player.set(CURRENT_NODE_VAR, 'p1O');
      scope.CzA();
    };

    // text
    scope.CzA = () => {
      player.set(CURRENT_NODE_VAR, 'CzA');
      let text = `The value of test is '${player.get('test')}'.`;
      core.say(text, scope.gD5);
    };

    // chunk FIRST
    scope.gD5 = () => {
      scope.gD5_0();
    };
    // text
    scope.gD5_0 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_0');
      let text = `Adalais,ada-talking: I have something to say to you!`;
      core.say(text, scope.gD5_1);
    };

    // text
    scope.gD5_1 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_1');
      let text = `Iroha: Oh yeah?`;
      core.say(text, scope.gD5_2);
    };

    // text
    scope.gD5_2 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_2');
      let text = `Iroha: What is it?`;
      core.say(text, scope.gD5_3);
    };

    // text
    scope.gD5_3 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_3');
      let text = `Adalais,ada-sarcastic: Eh... nevermind.`;
      core.say(text, scope.gD5_4);
    };

    // text
    scope.gD5_4 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_4');
      let text = `Iroha: ...?`;
      core.say(text, scope.gD5_5);
    };

    // text
    scope.gD5_5 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_5');
      let text = `Adalais,ada-talking: It's not really worth it.`;
      core.say(text, scope.gD5_6);
    };

    // text
    scope.gD5_6 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_6');
      let text = `Iroha,iroha-angry: You can be so weird sometimes...`;
      core.say(text, scope.gD5_7);
    };

    // text
    scope.gD5_7 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_7');
      let text = `both,ada-surprised,iroha-angry: *CLANK*`;
      core.say(text, scope.gD5_8);
    };

    // text
    scope.gD5_8 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_8');
      let text = `Adalais: What the heck was that?`;
      core.say(text, scope.gD5_9);
    };

    // text
    scope.gD5_9 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_9');
      let text = `Iroha: I don't know... but it was certainly scary.`;
      core.say(text, scope.gD5_10);
    };

    // text
    scope.gD5_10 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_10');
      let text = `Adalais,ada-thinking: It had to have been something nearby...`;
      core.say(text, scope.gD5_11);
    };

    // text
    scope.gD5_11 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_11');
      let text = `Iroha: Yeah, that was super loud.`;
      core.say(text, scope.gD5_12);
    };

    // text
    scope.gD5_12 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_12');
      let text = `Iroha,iroha-angry: How could somebody do something like that?`;
      core.say(text, scope.gD5_13);
    };

    // text
    scope.gD5_13 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_13');
      let text = `Adalais,ada-thinking: I don't know...`;
      core.say(text, scope.gD5_14);
    };

    // text
    scope.gD5_14 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_14');
      let text = `Adalais,ada-happy: But you want to know something?`;
      core.say(text, scope.gD5_15);
    };

    // text
    scope.gD5_15 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_15');
      let text = `Adalais,ada-happy: You are going to be the one that helps me figure it out.`;
      core.say(text, scope.gD5_16);
    };

    // text
    scope.gD5_16 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_16');
      let text = `Iroha: Oh brother, here we go again...`;
      core.say(text, scope.gD5_17);
    };

    // action
    scope.gD5_17 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_17');
      engine.setConversation1('Adalais', 'ada-regular');
      scope.gD5_18();
    };

    // text
    scope.gD5_18 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_18');
      let text = `Adalais,ada-thinking: Little does she know that this has all been part of my plan.`;
      core.say(text, scope.gD5_19);
    };

    // text
    scope.gD5_19 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_19');
      let text = `Adalais,ada-happy: Muahahahahahah!`;
      core.say(text, scope.gD5_20);
    };

    // text
    scope.gD5_20 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_20');
      let text = `Adalais,ada-surprised: *clip* *clop* *clip*`;
      core.say(text, scope.gD5_21);
    };

    // text
    scope.gD5_21 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_21');
      let text = `Adalais,ada-surprised: Uh oh, someone's coming!`;
      core.say(text, scope.gD5_22);
    };

    // text
    scope.gD5_22 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_22');
      let text = `Adalais: I've got to get out of here, fast!`;
      core.say(text, scope.gD5_23);
    };

    // action
    scope.gD5_23 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_23');
      engine.setConversation1('', '');
      scope.gD5_24();
    };

    // text
    scope.gD5_24 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_24');
      let text = `unknown: *Clip* *Clop* *Clip*`;
      core.say(text, scope.gD5_25);
    };

    // text
    scope.gD5_25 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_25');
      let text = `unknown: Who was that who just darted off?`;
      core.say(text, scope.gD5_26);
    };

    // text
    scope.gD5_26 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_26');
      let text = `unknown: Ahh well... that's not important.`;
      core.say(text, scope.gD5_27);
    };

    // text
    scope.gD5_27 = () => {
      player.set(CURRENT_NODE_VAR, 'gD5_27');
      let text = `unknown: All that's important is that my plans aren't interrupted.`;
      core.say(text, scope.gD5_28);
    };
    // chunk LAST
    scope.gD5_28 = () => {
      scope.Bf4();
    };
    // next_file
    scope.Bf4 = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `main.json`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.RM9();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_SpyRigby.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_SpyRigby.json');
    // next_file
    scope.Hg9db = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.Hg9db();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_RadmilaOmvaire.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_RadmilaOmvaire.json');
    // next_file
    scope.KxZH3 = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.KxZH3();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_SchovanAbivola.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_SchovanAbivola.json');
    // next_file
    scope.OhVgn = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.OhVgn();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_Igmund.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_Igmund.json');
    // next_file
    scope.iPi3f = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.iPi3f();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_Idoreo.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_Idoreo.json');
    // next_file
    scope.FdbAF = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.FdbAF();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_Gruff.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_Gruff.json');
    // next_file
    scope.f1zni = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.f1zni();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_GuardCaptainMullen.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_GuardCaptainMullen.json');
    // next_file
    scope.F3tbm = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.F3tbm();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_Elvyosa.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_Elvyosa.json');
    // next_file
    scope.m8Gsl = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.m8Gsl();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_DunnsMurose.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_DunnsMurose.json');
    // next_file
    scope.YDiFN = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.YDiFN();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_DockmasterClaire.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_DockmasterClaire.json');
    // switch
    scope.G2sLG = () => {
      player.set(CURRENT_NODE_VAR, 'G2sLG');
      if (player.once()) scope.XgRzi();
      else if (true) scope.BgtJr();
    };
    // text
    scope.XgRzi = () => {
      player.set(CURRENT_NODE_VAR, 'XgRzi');
      let text = `A stern woman, clipboard in hand, oversees the workers bustling about the docks.  She barks orders with every other breath, gesturing curtly with bony fingers and an icy glare.  A bright green tabard marks her as a Realm Adjutant.  Your approach hardly gives her pause.`;
      core.say(text, scope.BgtJr);
    };

    // text
    scope.BgtJr = () => {
      player.set(CURRENT_NODE_VAR, 'BgtJr');
      let text = `"What is it?  What do you need?"`;
      core.say(text, scope.qlRtQ);
    };

    // choice
    scope.qlRtQ = () => {
      player.set(CURRENT_NODE_VAR, 'qlRtQ');
      let text = ``;
      core.choose(text, 'qlRtQ', [
        {
          t: `Who are you?`,
          cb: scope.DERfp,
          c: () => {
            return true;
          },
        },
        {
          t: `What are "Larks"?`,
          cb: scope.Y5uuR,
          c: () => {
            return player.get('nodes.DERfp');
          },
        },
        {
          t: `Nevermind.`,
          cb: scope.w1b5S,
          c: () => {
            return true;
          },
        },
      ]);
    };

    // text
    scope.DERfp = () => {
      player.set(CURRENT_NODE_VAR, 'DERfp');
      let text = `She spits at the ground.  "Faw!  Larks!  As clueless as ever I see."`;
      core.say(text, scope.Ip8B3);
    };

    // text
    scope.Ip8B3 = () => {
      player.set(CURRENT_NODE_VAR, 'Ip8B3');
      let text = `She points at her tabard as if that was self-explanitory.  "I'm Claire.  Dock Master here in Alinea.  That means try to behave when I'm around or I'll have to send you into seclusion.  Had a few troublemakers just yesterday, thought they could sneak a few shipments of shelk into warehouse 3."  She shakes her head in disappointment.  "I'd feel bad for them if I hadn't seen the like a hundred times over."`;
      core.say(text, scope.qlRtQ);
    };

    // text
    scope.Y5uuR = () => {
      player.set(CURRENT_NODE_VAR, 'Y5uuR');
      let text = `"It means you're new here.  Get used to that label.  You're the Larkiest Larks I've ever seen."`;
      core.say(text, scope.qlRtQ);
    };

    // next_file
    scope.w1b5S = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.G2sLG();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_SirLavolanChevel.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_SirLavolanChevel.json');
    // next_file
    scope.r7TWk = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.r7TWk();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_Sol.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_Sol.json');
    // next_file
    scope.tG08a = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.tG08a();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_Chem.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_Chem.json');
    // next_file
    scope.RLgZd = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.RLgZd();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_BartoloCaldeburn.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_BartoloCaldeburn.json');
    // switch
    scope.enWMm = () => {
      player.set(CURRENT_NODE_VAR, 'enWMm');
      if (player.once()) scope.mqogS();
      else if (true) scope.SwzEw();
    };
    // text
    scope.mqogS = () => {
      player.set(CURRENT_NODE_VAR, 'mqogS');
      let text = `A nobleman sits here, his clothes notably more gaudy and pretentious than anyone else around.  A deep blue lace lines every possible edge of his silk coat, and auburn trousers glint with a distracting sheen.  He clasps a large glass of plum wine and idly taps a finger on the rough wood of the table.  He ignores the other patrons in the room as his gaze passes imperiously by them to rest upon you.`;
      core.say(text, scope.dY7sz);
    };

    // text
    scope.dY7sz = () => {
      player.set(CURRENT_NODE_VAR, 'dY7sz');
      let text = `"And what have we here?  Another rabble come to further dissuade me from this pit of a town?"`;
      core.say(text, scope.ku2iV);
    };

    // choice
    scope.ku2iV = () => {
      player.set(CURRENT_NODE_VAR, 'ku2iV');
      let text = ``;
      core.choose(text, 'ku2iV', [
        {
          t: `Who are you?`,
          cb: scope.ASqD8,
          c: () => {
            return true;
          },
        },
        {
          t: `Don't like Alinea much?`,
          cb: scope.zkasm,
          c: () => {
            return true;
          },
        },
        {
          t: `You work for Lord Guildimarche?  Who is that?`,
          cb: scope.ecss2,
          c: () => {
            return player.get('nodes.ASqD8');
          },
        },
        {
          t: `What is someone as 'esteemed' as you doing here?`,
          cb: scope.KLPVt,
          c: () => {
            return player.get('nodes.ASqD8');
          },
        },
        {
          t: `Idle threats?  Are you always this distasteful?`,
          cb: scope.DRtxf,
          c: () => {
            return player.get('nodes.OfySb');
          },
        },
        {
          t: `There are bandits to the north?`,
          cb: scope.wEid3,
          c: () => {
            return player.get('nodes.KLPVt');
          },
        },
        {
          t: `Nevermind.`,
          cb: scope.udfI0,
          c: () => {
            return true;
          },
        },
      ]);
    };

    // text
    scope.ASqD8 = () => {
      player.set(CURRENT_NODE_VAR, 'ASqD8');
      let text = `"Lord Bartolo Caldeburn, originally of the Esthsmund Estates.  You've heard of those?"`;
      core.say(text, scope.zfyBY);
    };

    // text
    scope.zfyBY = () => {
      player.set(CURRENT_NODE_VAR, 'zfyBY');
      let text = `You have not heard of these names.  You lack intricate knowledge of nobility on the Mainland.  Lord Bartolo grows irritated as this fault of yours becomes obvious.`;
      core.say(text, scope.tE4LF);
    };

    // text
    scope.tE4LF = () => {
      player.set(CURRENT_NODE_VAR, 'tE4LF');
      let text = `"Yes well... They are renowned on the Mainland for their luxury.  I suppose simpletons such as yourselves would not understand.  Suffice to say that I am important.  Very important.  You should certainly not underestimate that fact.  These days I lend my assistance to Lord Guildimarche and his grand estate."`;
      core.say(text, scope.ku2iV);
    };

    // text
    scope.zkasm = () => {
      player.set(CURRENT_NODE_VAR, 'zkasm');
      let text = `"Certainly not!  The people here no nothing of luxury.  They they think only in singles." He taps his glass. "A mere single selection of wine, a single bed, a single tavern...  How can a man visit this town with anything but disappointment?"`;
      core.say(text, scope.gIcZc);
    };

    // text
    scope.gIcZc = () => {
      player.set(CURRENT_NODE_VAR, 'gIcZc');
      let text = `"The only thing I can say for sure that it has is plenty of Larks."`;
      core.say(text, scope.ybfJ1);
    };

    // text
    scope.ybfJ1 = () => {
      player.set(CURRENT_NODE_VAR, 'ybfJ1');
      let text = `He makes a shooing gesture at you.`;
      core.say(text, scope.ku2iV);
    };

    // text
    scope.ecss2 = () => {
      player.set(CURRENT_NODE_VAR, 'ecss2');
      let text = `Lord Cladeburn's face contorts into an aghast expression.`;
      core.say(text, scope.GM0EE);
    };

    // text
    scope.GM0EE = () => {
      player.set(CURRENT_NODE_VAR, 'GM0EE');
      let text = `"I do not 'work for' Lord Guildimarche, as you so uncouthly put it.  We are of the noble persuasion, we do favors for each other.  We lend aid!"  `;
      core.say(text, scope.ViWA8);
    };

    // text
    scope.ViWA8 = () => {
      player.set(CURRENT_NODE_VAR, 'ViWA8');
      let text = `"It just so happens that the Guildimarche estate has quite the pull on Sadelica.  Save for Alinea and perhaps the Magi Tower, go most anywhere on this accursed island and you'll find some establishment associated with that name.  This is not a coincidence.  Perhaps *you* would not know of such things, but support for such a strong house tends to bear fruit."`;
      core.say(text, scope.ku2iV);
    };

    // text
    scope.KLPVt = () => {
      player.set(CURRENT_NODE_VAR, 'KLPVt');
      let text = `"I am waiting for the Bandits currently occupying the northern bridge to be dealt with.  Then I can safety return to a place of at least relative sanity."`;
      core.say(text, scope.OfySb);
    };

    // text
    scope.OfySb = () => {
      player.set(CURRENT_NODE_VAR, 'OfySb');
      let text = `"And might I advise you to watch your tone, or you might find your tongue in a ditch somewhere."`;
      core.say(text, scope.CfFBg);
    };

    // text
    scope.CfFBg = () => {
      player.set(CURRENT_NODE_VAR, 'CfFBg');
      let text = `He takes a small sip from his drink, and you notice a wickedly curved blade on a hilt at his hip.`;
      core.say(text, scope.ku2iV);
    };

    // text
    scope.DRtxf = () => {
      player.set(CURRENT_NODE_VAR, 'DRtxf');
      let text = `"Like most reasonable people, I do not suffer fools."`;
      core.say(text, scope.ku2iV);
    };

    // text
    scope.wEid3 = () => {
      player.set(CURRENT_NODE_VAR, 'wEid3');
      let text = `"Yes there are, and they have been quite the nuisance.  I'm simply waiting for them to be dealt with.  It is only a matter of time."`;
      core.say(text, scope.ku2iV);
    };

    // next_file
    scope.udfI0 = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    // text
    scope.SwzEw = () => {
      player.set(CURRENT_NODE_VAR, 'SwzEw');
      let text = `"Back again I see..."`;
      core.say(text, scope.ku2iV);
    };

    if (id === undefined) {
      scope.enWMm();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_AldebethBlackrose.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_AldebethBlackrose.json');
    // switch
    scope.xn4GD = () => {
      player.set(CURRENT_NODE_VAR, 'xn4GD');
      if (player.once()) scope.Ck2ff();
      else if (true) scope.sBfVM();
    };
    // text
    scope.Ck2ff = () => {
      player.set(CURRENT_NODE_VAR, 'Ck2ff');
      let text = `The leader of the mercenary company occupying these red tents is obviously this elegant and aristocratic woman.  Her exquisite silk dress is slashed with the the white and red of what is very clearly the Blackrose crest, and a fashionable high-neck collar accentuates her ample bosom.  `;
      core.say(text, scope.niNF7);
    };

    // choice
    scope.niNF7 = () => {
      player.set(CURRENT_NODE_VAR, 'niNF7');
      let text = ``;
      core.choose(text, 'niNF7', [
        {
          t: `Who are you?`,
          cb: scope.R3DD4,
          c: () => {
            return true;
          },
        },
        {
          t: `Blackrose LEGION!?  How many of you are there?`,
          cb: scope.fadc7,
          c: () => {
            return player.get('nodes.BSReu');
          },
        },
        {
          t: `Nevermind.`,
          cb: scope.QUeaf,
          c: () => {
            return true;
          },
        },
      ]);
    };

    // text
    scope.R3DD4 = () => {
      player.set(CURRENT_NODE_VAR, 'R3DD4');
      let text = `She raises a thinly-painted eyebrow.`;
      core.say(text, scope.BSReu);
    };

    // text
    scope.BSReu = () => {
      player.set(CURRENT_NODE_VAR, 'BSReu');
      let text = `"I am Lady Aldebeth Blackrose.  I lead this contingent of the great Blackrose legion."`;
      core.say(text, scope.niNF7);
    };

    // text
    scope.fadc7 = () => {
      player.set(CURRENT_NODE_VAR, 'fadc7');
      let text = `Her lips curl into a slight smile.`;
      core.say(text, scope.ceRC2);
    };

    // text
    scope.ceRC2 = () => {
      player.set(CURRENT_NODE_VAR, 'ceRC2');
      let text = `"We are indeed, a great military force, renowned, and dare I say "feared" throughout Sadelica.  You should contain your awe better, it is unbecoming of the moment for any person to show such raw emotion."`;
      core.say(text, scope.niNF7);
    };

    // next_file
    scope.QUeaf = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    // text
    scope.sBfVM = () => {
      player.set(CURRENT_NODE_VAR, 'sBfVM');
      let text = `"Ah yes.  You.  What is it you want this time?"`;
      core.say(text, scope.niNF7);
    };

    if (id === undefined) {
      scope.xn4GD();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };

  files[`Alinea_CH_Scopey.json`] = id => {
    player.set(CURRENT_FILE_VAR, 'Alinea_CH_Scopey.json');
    // next_file
    scope.bUbbt = () => {
      player.set(LAST_FILE_VAR, player.get(CURRENT_FILE_VAR));
      let key = `NONE`;
      let func = files[key];
      if (func) {
        func();
      } else {
        core.exit();
      }
    };

    if (id === undefined) {
      scope.bUbbt();
    } else if (id) {
      scope[id]();
    }
    return player.state;
  };
  files.exit = () => {
    core.exit();
  };
  if (!isDryRun) {
    files['main.json']();
  }
  return { files, scope };
}
