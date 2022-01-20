/* @jsx h */
import {
  getUiInterface,
  hideSection,
  resetBottomBarButtons,
} from 'controller/ui-actions';
import { AppSection } from 'model/app-state';
import { pxToPctHeight } from 'model/screen';
import { h, Fragment } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Button } from 'view/elements/Button';
import { colors, style } from 'view/style';

const Root = style('div', {
  position: 'absolute',
  left: '0',
  top: '0',
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  zIndex: '1',
});

const Title = style('div', {
  width: '100%',
  borderTop: '2px solid ' + colors.GREY,
  borderLeft: '2px solid ' + colors.GREY,
  borderRight: '2px solid ' + colors.GREY,
  textTransform: 'uppercase',
  textAlign: 'center',
  height: pxToPctHeight(23),
  background: colors.DARKPURPLE,
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Header = style('div', {
  width: '100%',
  height: pxToPctHeight(68),
  borderTop: '2px solid ' + colors.GREY,
  borderLeft: '2px solid ' + colors.GREY,
  borderRight: '2px solid ' + colors.GREY,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: colors.DARKBROWN,
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
});

const Buttons = style('div', {
  width: '100%',
  height: pxToPctHeight(46),
  borderTop: '2px solid ' + colors.GREY,
  borderBottom: '2px solid ' + colors.GREY,
  borderLeft: '2px solid ' + colors.GREY,
  borderRight: '2px solid ' + colors.GREY,
  background: colors.DARKBROWN,
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

  const handleConfirm = useCallback(() => {
    if (active) {
      setTimeout(() => {
        setActive(false);
        if (onConfirm) {
          onConfirm();
        }
        hideSection(AppSection.MODAL);
        resetBottomBarButtons();
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
        resetBottomBarButtons();
      }, 75);
    }
  }, [onCancel, active]);

  const buttonStyle = {
    height: 'calc(100% - 16px)',
    width: '28%',
    marginLeft: '2.5%',
    marginRight: '2px',
  };

  return (
    <Root>
      <Title>{title}</Title>
      <Header>
        <HeaderPictureContainer>
          <HeaderPicture></HeaderPicture>
        </HeaderPictureContainer>
        <HeaderTextContainer>{headerText}</HeaderTextContainer>
      </Header>
      <Text
        dangerouslySetInnerHTML={{
          __html: text,
        }}
      />
      <Buttons>
        {onCancel ? (
          <>
            <Button
              onClick={handleConfirm}
              color={colors.DARKBLUE}
              style={buttonStyle}
            >
              OK
            </Button>
            <Button
              onClick={handleCancel}
              color={colors.DARKBLUE}
              style={buttonStyle}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={handleConfirm}
            color={colors.DARKBLUE}
            style={buttonStyle}
          >
            OK
          </Button>
        )}
      </Buttons>
    </Root>
  );
};

export default ModalSection;
