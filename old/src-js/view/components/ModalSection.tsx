/* @jsx h */
import { getUiInterface, hideSection } from 'controller/ui-actions';
import { AppSection } from 'model/app-state';
import { pxToPctHeight } from 'model/screen';
import { h, Fragment } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Button } from 'view/elements/Button';
import { useKeyboardEventListener } from 'view/hooks';
import { colors, style } from 'view/style';
import ModalWindow from 'view/elements/ModalWindow';
import SpriteDiv from 'view/elements/SpriteDiv';
import { getScale } from 'model/generics';

const Header = style('div', {
  width: '100%',
  height: pxToPctHeight(68),
  borderTop: '2px solid ' + colors.GREY,
  borderLeft: '2px solid ' + colors.GREY,
  borderRight: '2px solid ' + colors.GREY,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: colors.DARKGREY,
  boxSizing: 'border-box',
});

const HeaderPictureContainer = style('div', {
  width: '25%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const HeaderPicture = style('div', {
  width: '66px',
  height: '66px',
  border: '2px solid ' + colors.GREY,
  background: colors.BLACK,
});

const HeaderTextContainer = style('div', {
  width: '75%',
  textAlign: 'left',
});

const Text = style('p', {
  width: '100%',
  borderTop: '2px solid ' + colors.GREY,
  borderLeft: '2px solid ' + colors.GREY,
  borderRight: '2px solid ' + colors.GREY,
  padding: '2.5%',
  margin: '0',
  background: colors.DARKGREY,
  fontSize: '0.8rem',
  boxSizing: 'border-box',
  fontFamily: 'NewYork',
});

const Buttons = style('div', {
  width: '100%',
  height: pxToPctHeight(46),
  borderTop: '2px solid ' + colors.GREY,
  borderBottom: '2px solid ' + colors.GREY,
  borderLeft: '2px solid ' + colors.GREY,
  borderRight: '2px solid ' + colors.GREY,
  background: colors.DARKGREY,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  boxSizing: 'border-box',
});

const ModalSection = () => {
  const appState = getUiInterface().appState;
  const modalState = appState.modal;
  const [active, setActive] = useState(true);
  const { text, title, headerText, sprite, onConfirm, onCancel } = modalState;
  const [selectedInd, setSelectedInd] = useState(0);

  const handleConfirm = useCallback(() => {
    if (active) {
      setTimeout(() => {
        setActive(false);
        if (onConfirm) {
          onConfirm();
        }
        hideSection(AppSection.MODAL);
      }, 75);
    }
  }, [onConfirm, active]);

  const handleCancel = useCallback(() => {
    if (active) {
      setTimeout(() => {
        setActive(false);
        if (onCancel) {
          onCancel();
        }
        hideSection(AppSection.MODAL);
      }, 75);
    }
  }, [onCancel, active]);

  useKeyboardEventListener(
    ev => {
      if (ev.key === 'Tab') {
        ev.preventDefault();
        setSelectedInd((selectedInd + 1) % 2);
      } else if (ev.key === 'Enter') {
        if (selectedInd === 1 && onCancel) {
          handleCancel();
        } else {
          handleConfirm();
        }
      }
    },
    [selectedInd, onConfirm, onCancel, handleConfirm]
  );

  const buttonStyle = {
    height: 'calc(100% - 16px)',
    width: '28%',
    marginLeft: '2.5%',
    marginRight: '2px',
  };

  return (
    <ModalWindow title={title}>
      <Header>
        <HeaderPictureContainer>
          <HeaderPicture>
            <SpriteDiv sprite={modalState.sprite ?? ''} scale={4}></SpriteDiv>
          </HeaderPicture>
        </HeaderPictureContainer>
        <HeaderTextContainer>{headerText}</HeaderTextContainer>
      </Header>
      <Text
        dangerouslySetInnerHTML={{
          __html: text.replace(/\n/g, '<br><br>'),
        }}
      />
      <Buttons>
        {onCancel ? (
          <>
            <Button
              onClick={handleConfirm}
              color={colors.DARKBLUE}
              style={buttonStyle}
              highlighted={selectedInd === 0}
            >
              OK
            </Button>
            <Button
              onClick={handleCancel}
              color={colors.DARKBLUE}
              style={buttonStyle}
              highlighted={selectedInd === 1}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={handleConfirm}
            color={colors.DARKBLUE}
            style={buttonStyle}
            highlighted={true}
          >
            OK
          </Button>
        )}
      </Buttons>
    </ModalWindow>
  );
};

export default ModalSection;
