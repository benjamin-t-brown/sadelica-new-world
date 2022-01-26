/* @jsx h */
import { h } from 'preact';
import { colors, keyframes, style } from 'view/style';
import { pxToPctHeight } from 'model/screen';
import { Scrollbars } from 'preact-custom-scrollbars';
import { getUiInterface } from 'controller/ui-actions';
import { useEffect, useState } from 'preact/hooks';
import { useCallback } from 'lib/preact-hooks';
import { core } from 'in2';
import { useKeyboardEventListener } from 'view/hooks';
import { AppSection } from 'model/app-state';
import SpriteDiv from 'view/elements/SpriteDiv';

const Root = style('div', {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  background: colors.DARKGREY,
});

const isDialogActive = () => {
  return (
    getUiInterface().appState.sections.slice(-1)?.[0] === AppSection.DIALOG
  );
};

const PortraitContainer = style('div', {
  height: '128px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
const PortraitDecorator = style('div', {
  height: '100%',
  width: 'calc(50% - 64px)',
  background: colors.GREY,
});
const Portrait = style('div', {
  width: '128px',
  height: '128px',
  boxSizing: 'border-box',
  border: '1px solid ' + colors.WHITE,
  display: 'flex',
  justifyContent: 'center',
  overflow: 'hidden',
});

const NameLabelContainer = style('div', {
  height: pxToPctHeight(31),
  width: '100%',
  borderTop: '1px solid ' + colors.WHITE,
  borderBottom: '1px solid ' + colors.WHITE,
  display: 'flex',
  color: colors.CYAN,
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.2rem',
  background: colors.BLACK,
});

const fadeIn = keyframes({
  '0%': {
    opacity: '0%',
  },
  '100%': {
    opacity: '100%',
  },
});

const TextContainer = style('div', {
  height: `calc(100% - ${pxToPctHeight(31)} - ${pxToPctHeight(42)} - 128px)`,
  width: '100%',
  boxSizing: 'border-box',
  fontSize: '0.8rem',
  fontFamily: 'NewYork',
});
const DialogLine = style('p', {
  width: '100%',
  padding: '2.5%',
  margin: '8px 0',
  boxSizing: 'border-box',
  animation: fadeIn + ' 0.05s linear',
  lineHeight: '1.1rem',
});
const DialogChoice = style('p', {
  width: '100%',
  color: colors.WHITE,
  padding: '2.5%',
  boxSizing: 'border-box',
  margin: '1 0',
  background: colors.DARKGREY_ALT,
  animation: fadeIn + ' 0.05s linear',
});
const renderLineSpans = (line: string) => {
  const lineSplitByQuotes = line.split('"');
  const lines: h.JSX.Element[] = [];
  for (let i = 0; i < lineSplitByQuotes.length; i++) {
    if (lineSplitByQuotes[i].length === 0) {
      continue;
    }
    if (i > 0 && lines.length) {
      lines.push(<br></br>, <br></br>);
    }
    if (i % 2 == 1) {
      // in quotes
      lines.push(
        <span
          style={{
            color: colors.WHITE,
          }}
        >
          "{lineSplitByQuotes[i]}"
        </span>
      );
    } else {
      // not in quotes
      lines.push(
        <span
          style={{
            color: colors.LIGHTGREY,
          }}
        >
          {lineSplitByQuotes[i]}
        </span>
      );
    }
  }
  return lines;
};

const DialogSection = () => {
  const appState = getUiInterface().appState;

  const [active, setActive] = useState(true);
  const [disableScroll, setDisableScroll] = useState(false);
  const [choiceClicked, setChoiceClicked] = useState(-1);

  const dialogState = appState.dialog;
  useEffect(() => {
    const elem = document.getElementById('scrollbars');
    if (elem && !disableScroll) {
      elem.children[0].children[dialogState.lines.length - 1].scrollIntoView(
        true
      );
    }

    const elem2 = document.getElementById('tap-to-continue');
    hideTapToContinue();
    if (elem2 && active) {
      if (dialogState.waitingForContinue) {
        (elem2 as any).style.opacity = 1;
      }
    }
  });

  const hideTapToContinue = useCallback(() => {
    const elem2 = document.getElementById('tap-to-continue');
    if (elem2) {
      console.log('hide tap to continue');
      elem2.style.transition = 'unset';
      elem2.style.opacity = '0';
      setTimeout(() => {
        (elem2 as any).style.transition = 'opacity 0.0s linear';
      }, 1);
    }
  }, []);

  const handleDialogChoiceClick = useCallback(
    (ind: number) => {
      if (active && ind < dialogState.choices.length) {
        setDisableScroll(true);
        hideTapToContinue();
        setChoiceClicked(ind);
        setActive(false);
        setTimeout(() => {
          setDisableScroll(false);
          const appState = getUiInterface().appState;
          const dialogState = appState.dialog;
          if (dialogState.onChoice) {
            setChoiceClicked(-1);
            dialogState.onChoice(ind);
          }
          setTimeout(() => setActive(true), 100);
        }, 100);
      }
    },
    [hideTapToContinue, active, setActive, dialogState.choices.length]
  );

  const handleDialogContinueClick = useCallback(() => {
    if (active && dialogState.waitingForContinue) {
      hideTapToContinue();
      setActive(false);
      setTimeout(() => {
        const appState = getUiInterface().appState;
        const dialogState = appState.dialog;

        if (dialogState.onContinue) {
          dialogState.onContinue();
        }
        setActive(true);
      }, 100);
    }
  }, [hideTapToContinue, active, setActive, dialogState.waitingForContinue]);

  useKeyboardEventListener(
    ev => {
      if (!isDialogActive()) {
        return;
      }

      const keyAsNumber = Number(ev.key);

      if (ev.key === 'Enter') {
        ev.preventDefault();
        handleDialogContinueClick();
      } else if (!isNaN(keyAsNumber) && keyAsNumber >= 1 && keyAsNumber <= 9) {
        handleDialogChoiceClick(keyAsNumber - 1);
      }
    },
    [handleDialogChoiceClick, handleDialogContinueClick]
  );

  return (
    <Root id="dialog">
      <PortraitContainer>
        <PortraitDecorator></PortraitDecorator>
        <Portrait>
          <SpriteDiv
            sprite={dialogState.portraitSprite ?? ''}
            scale={1}
          ></SpriteDiv>
        </Portrait>
        <PortraitDecorator></PortraitDecorator>
      </PortraitContainer>
      <NameLabelContainer>{dialogState.actorName}</NameLabelContainer>
      <TextContainer onClick={handleDialogContinueClick}>
        <Scrollbars width="100%" height="100%" id="scrollbars">
          {dialogState.lines.map((lineObj, i) => {
            return (
              <DialogLine
                key={'line' + i}
                style={{
                  color: lineObj.color,
                }}
              >
                {renderLineSpans(lineObj.line)}
              </DialogLine>
            );
          })}
          {dialogState.choices.map((lineObj, i) => {
            return (
              <DialogChoice
                onClick={handleDialogChoiceClick.bind(null, i)}
                key={'choice' + i}
                style={{
                  color:
                    i === choiceClicked
                      ? colors.YELLOW
                      : core.hasPickedChoice(lineObj.id)
                      ? colors.GREY
                      : colors.CYAN,
                }}
              >
                {lineObj.line}
              </DialogChoice>
            );
          })}
          <div
            id="tap-to-continue"
            style={{
              textAlign: 'center',
              visibility: active ? 'unset' : 'invisible',
              fontFamily: 'Chicago',
              // color: active ? colors.CYAN : colors.GREY,
            }}
          >
            Tap to continue.
          </div>
          <div
            style={{
              width: '100%',
              height: '100%',
              // background: 'black',
            }}
          ></div>
        </Scrollbars>
      </TextContainer>
    </Root>
  );
};

export default DialogSection;
