import { initHooks } from 'view/hooks';
import { colors } from 'view/style';
import { mountUi } from 'view/ui';
import {
  loadWorld,
  renderUi,
  setBottomButtons,
  setGameSelectedCharacter,
  showDialog,
  showGame,
  showInGameMenu,
  showModal,
  showStore,
} from 'controller/ui-actions';
import { BottomBarButtonType } from 'model/app-state';
import {
  getCurrentPlayer,
  setCurrentPlayer,
  setCurrentWorld,
} from 'model/generics';
import { core } from 'in2';
import { Actor, actorSetPosition, createActor } from 'model/actor';
import { createItem } from 'model/item';
import { loadImagesAndSprites } from 'model/canvas';
import { init as initDb } from 'db';
import { to4d } from 'utils';
import { getRoomSize } from 'model/room';
import { createWorld } from 'model/world';
import { initEvents } from 'controller/input';
import { runMainLoop } from 'controller/loop';
import { loadRes } from 'controller/res-loader';
import { PLAYERS_SPRITE_SHEET } from 'db/sprite-mapping';

const elem = document.documentElement;

function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if ((elem as any).webkitRequestFullscreen) {
    /* Safari */
    (elem as any).webkitRequestFullscreen();
  } else if ((elem as any).msRequestFullscreen) {
    /* IE11 */
    (elem as any).msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    /* Safari */
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) {
    /* IE11 */
    (document as any).msExitFullscreen();
  }
}

export const main = async (): Promise<void> => {
  console.time('load');

  mountUi();

  initHooks();
  initDb();
  initEvents();
  core.init();
  runMainLoop();

  // await Promise.all([
  //   loadImagesAndSprites([
  //     [
  //       'packed',
  //       'img/packed.png',
  //       16,
  //       16,
  //       2,
  //       2,
  //       ['terrain2', 'terrain3', 'actors2', 'misc1'],
  //     ],
  //     ['terrain1', 'img/terrain1.png', 16, 16, 1, 1, ['terrain1']],
  //     ['actors1', 'img/actors1.png', 16, 16, 1, 1, ['actors1']],
  //     // ['map1', 'img/map1.png', 64, 64, 1, 1, ['map1']],
  //     ['portrait1', 'img/portrait1.png', 32, 32, 1, 1, ['portrait1']],
  //   ]),
  //   // G_view_loadSounds(),
  // ]);

  await loadRes();

  const loading = document.getElementById('page-loading');
  if (loading) {
    loading.remove();
  }

  await new Promise<void>(resolve => {
    const touchSomething = () => {
      window.removeEventListener('keydown', touchSomething);
      window.removeEventListener('mousedown', touchSomething);
      resolve();
    };
    window.addEventListener('keydown', touchSomething);
    window.addEventListener('mousedown', touchSomething);

    const pressAnyKey = document.getElementById('page-press-any-key');
    if (pressAnyKey) {
      pressAnyKey.style.display = 'flex';
    }
  });

  const pressAnyKey = document.getElementById('page-press-any-key');
  if (pressAnyKey) {
    pressAnyKey.remove();
  }

  const ch1 = createActor('Elmindretta');
  ch1.spriteSheet = PLAYERS_SPRITE_SHEET;
  ch1.spriteIndex = 10;
  ch1.inventory = [
    createItem({
      name: 'Knife',
    }),
    createItem({
      name: 'Sword',
    }),
    createItem({
      name: 'Ruby Gem',
      stackable: true,
    }),
    createItem({
      name: 'Ruby Gem',
      stackable: true,
    }),
    createItem({
      name: 'Ruby Gem',
      stackable: true,
    }),
    createItem({
      name: 'Ruby Gem',
      stackable: true,
    }),
    createItem({
      name: 'Ruby Gem',
      stackable: true,
    }),
    createItem({
      name: 'Ruby Gem',
      stackable: true,
    }),
  ];

  const ch2 = createActor('Jose');
  ch2.inventory = [
    createItem({
      name: 'Knife',
    }),
  ];
  const ch3 = createActor('Goodwin-James-McElroy');
  setCurrentPlayer({
    name: ch1.name,
    party: [ch1, ch2, ch3],
    leader: ch1,
    money: 1024,
    worldX: 0,
    worldY: 0,
  });
  const player = getCurrentPlayer();
  const [worldX, worldY, localX, localY] = to4d(87, 226, getRoomSize());
  player.worldX = worldX;
  player.worldY = worldY;
  actorSetPosition(player.leader, localX, localY);

  // player.worldX = 0;
  // player.worldY = 1;
  // actorSetPosition(player.leader, 10, 10);

  setGameSelectedCharacter(ch1);

  loadWorld('alinea');
  showGame();
  // showStore({
  //   storeName: 'Stephens',
  //   items: [
  //     {
  //       itemName: 'Fine Sword',
  //       quantity: 1,
  //       price: 80,
  //     },
  //     {
  //       itemName: 'Fine Halberd',
  //       quantity: 1,
  //       price: 80,
  //     },
  //     {
  //       itemName: 'Fine Hauberk',
  //       quantity: 1,
  //       price: 80,
  //     },
  //     {
  //       itemName: 'Fine Chainmail',
  //       quantity: 1,
  //       price: 80,
  //     },
  //     {
  //       itemName: 'Rod of Sparking',
  //       quantity: 5,
  //       price: 80,
  //     },
  //     {
  //       itemName: 'Elfen Pie',
  //       quantity: 999,
  //       price: 80,
  //     },
  //     {
  //       itemName: 'Elfen Bread',
  //       quantity: 999,
  //       price: 80,
  //     },
  //   ],
  // });

  // showDialog('Alinea_CH_DockmasterClaire');

  // showModal({
  //   title: 'CHOOSE',
  //   text: 'You have come to a fork in the road.  <br/><br/>Do you go forward or backwards?',
  //   headerText: 'Fork in the road',
  //   onConfirm: () => {
  //     console.log('You chose to go forwards.');
  //   },
  //   onCancel: () => {
  //     console.log('You chose to go backwards.');
  //   },
  // });

  // showInGameMenu();

  // renderUi();
  // setTimeout(() => {
  // }, 100);
};

window.addEventListener('load', () => {
  (window as any).DEVELOPMENT = true;
  const loading = document.getElementById('page-loading');
  if (loading) {
    loading.style.color = colors.LIGHTBLUE;
  }
  main();
});
