/* @jsx h */
import { h } from 'preact';
import { colors, style } from 'view/style';
import { pxToPctHeight, pxToPctWidth } from 'model/screen';
import { getUiInterface } from 'controller/ui-actions';
import { SmallSquareButton } from 'view/elements/Button';

const Root = style('div', {
  height: pxToPctHeight(44),
  position: 'absolute',
  bottom: '0px',
  width: '100%',
  background: colors.DARKBLUE,
  display: 'flex',
  alignItems: 'center',
  padding: '0px 2px',
  boxSizing: 'border-box',
});

const BottomBar = () => {
  const appState = getUiInterface().appState;
  const bottomBarState = appState.bottomBar;

  return (
    <Root id="bottom-bar">
      {bottomBarState.buttons.map((button, i) => {
        return (
          <SmallSquareButton
            key={button.type + i}
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
