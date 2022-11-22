/* @jsx h */
import { h } from 'preact';
import { colors, style } from 'view/style';
import { pxToPctHeight, pxToPctWidth } from 'model/screen';
import {
  getUiInterface,
  showInGameMenu,
  showStore,
} from 'controller/ui-actions';
import { SmallSquareButton } from 'view/elements/Button';
import { useCallback } from 'lib/preact-hooks';
import { BottomBarButton, BottomBarButtonType } from 'model/app-state';
import { interactWithNearby } from 'controller/interact';

const Root = style('div', {
  height: pxToPctHeight(44),
  position: 'absolute',
  bottom: '0px',
  width: '100%',
  background: colors.GREY,
  display: 'flex',
  alignItems: 'center',
  padding: '0px 2px',
  boxSizing: 'border-box',
});

const BottomBar = () => {
  const appState = getUiInterface().appState;
  const bottomBarState = appState.bottomBar;

  const handleButtonClick = useCallback((button: BottomBarButton) => {
    console.log('Button clicked', button);
    switch (button.type) {
      case BottomBarButtonType.MENU: {
        showInGameMenu();
        break;
      }
      case BottomBarButtonType.INTERACT: {
        interactWithNearby();
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
      }
      default: {
        break;
      }
    }
  }, []);

  return (
    <Root id="bottom-bar">
      {bottomBarState.buttons.map((button, i) => {
        return (
          <SmallSquareButton
            key={button.type + i}
            onClick={handleButtonClick.bind(null, button)}
            style={{
              height: 'calc(100% - 4px)',
              width: pxToPctWidth(42),
              margin: '0px 2px',
              fontSize: '10px',
              textTransform: 'uppercase',
            }}
          >
            {button.type}
          </SmallSquareButton>
        );
      })}
    </Root>
  );
};

export default BottomBar;
