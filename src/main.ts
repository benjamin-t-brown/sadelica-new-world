import { initHooks } from 'view/hooks';
import { colors } from 'view/style';
import { mountUi } from 'view/ui';
import {
  renderUi,
  setBottomButtons,
  setGameSelectedCharacter,
  showDialog,
  showGame,
  showModal,
} from 'controller/ui-actions';
import { BottomBarButtonType } from 'model/app-state';
import { Character, createCharacter } from 'model/character';
import { setCurrentPlayer } from 'model/generics';
import { core } from 'in2';

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
  core.init();

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

  const ch1: Character = createCharacter('Elmindretta');
  ch1.inventory = [
    {
      name: 'Knife',
    },
    {
      name: 'Sword',
    },
    {
      name: 'Ruby Gem',
      stackable: true,
    },
    {
      name: 'Ruby Gem',
      stackable: true,
    },
    {
      name: 'Ruby Gem',
      stackable: true,
    },
    {
      name: 'Ruby Gem',
      stackable: true,
    },
    {
      name: 'Ruby Gem',
      stackable: true,
    },
    {
      name: 'Ruby Gem',
      stackable: true,
    },
  ];

  const ch2: Character = createCharacter('Jose');
  ch2.inventory = [
    {
      name: 'Knife',
    },
  ];
  const ch3: Character = createCharacter('Goodwin-James-McElroy');
  ch3.inventory = [
    {
      name: 'Sword',
    },
  ];
  setCurrentPlayer({
    name: 'Player Name',
    party: [ch1, ch2, ch3],
    leader: ch1,
  });
  setGameSelectedCharacter(ch1);

  showGame();

  showDialog('Alinea_CH_DockmasterClaire');

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
