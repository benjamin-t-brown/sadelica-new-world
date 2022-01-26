/* @jsx h */
import { getUiInterface, hideSection } from 'controller/ui-actions';
import { AppSection } from 'model/app-state';
import { pxToPctHeight } from 'model/screen';
import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Button } from 'view/elements/Button';
import ModalWindow from 'view/elements/ModalWindow';
import { useKeyboardEventListener } from 'view/hooks';
import { colors, style } from 'view/style';

const isInGameMenuActive = () => {
  return (
    getUiInterface().appState.sections.slice(-1)?.[0] === AppSection.GAME_MENU
  );
};
const ButtonWrapper = style('div', {
  height: '8%',
  width: '100%',
  padding: '0 2rem',
  boxSizing: 'border-box',
  background: colors.DARKGREY,
});

const InGameMenuSection = () => {
  const [selectedInd, setSelectedInd] = useState(0);
  const [activeInd, setActiveInd] = useState(-1);

  const handleResumeClick = useCallback(() => {
    hideSection(AppSection.GAME_MENU);
  }, []);

  const handleClick = useCallback(
    (ind: number) => {
      if (activeInd === -1) {
        setActiveInd(ind);
        setTimeout(() => {
          setActiveInd(-1);
          switch (ind) {
            case 0:
              handleResumeClick();
              break;
            default:
              break;
          }
        }, 100);
      }
    },
    [activeInd, handleResumeClick]
  );

  useKeyboardEventListener(
    ev => {
      if (!isInGameMenuActive() || activeInd !== -1) {
        return;
      }

      if (ev.key === 'Tab' || ev.key === 'ArrowDown') {
        ev.preventDefault();
        setSelectedInd((selectedInd + 1) % 7);
        ev.preventDefault();
      } else if (ev.key === 'ArrowUp') {
        setSelectedInd((selectedInd - 1 + 7) % 7);
      } else if (ev.key === 'Enter') {
        ev.preventDefault();
        handleClick(selectedInd);
      }
    },
    [selectedInd, activeInd, handleClick]
  );

  const buttonStyle = {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
  };

  return (
    <ModalWindow title="Menu">
      <ButtonWrapper>
        <Button
          style={{ ...buttonStyle, color: activeInd === 0 ? colors.CYAN : '' }}
          onClick={handleClick.bind(null, 0)}
          highlighted={selectedInd === 0}
        >
          Resume
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          style={{ ...buttonStyle, color: activeInd === 1 ? colors.CYAN : '' }}
          onClick={handleClick.bind(null, 1)}
          highlighted={selectedInd === 1}
        >
          Log
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          style={{ ...buttonStyle, color: activeInd === 2 ? colors.CYAN : '' }}
          onClick={handleClick.bind(null, 2)}
          highlighted={selectedInd === 2}
        >
          Quick Save
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          style={{ ...buttonStyle, color: activeInd === 3 ? colors.CYAN : '' }}
          onClick={handleClick.bind(null, 3)}
          highlighted={selectedInd === 3}
        >
          Save
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          style={{ ...buttonStyle, color: activeInd === 4 ? colors.CYAN : '' }}
          onClick={handleClick.bind(null, 4)}
          highlighted={selectedInd === 4}
        >
          Load
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          style={{ ...buttonStyle, color: activeInd === 5 ? colors.CYAN : '' }}
          onClick={handleClick.bind(null, 5)}
          highlighted={selectedInd === 5}
        >
          Options
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          style={{ ...buttonStyle, color: activeInd === 6 ? colors.CYAN : '' }}
          onClick={handleClick.bind(null, 6)}
          highlighted={selectedInd === 6}
        >
          Quit
        </Button>
      </ButtonWrapper>
    </ModalWindow>
  );
};

export default InGameMenuSection;
