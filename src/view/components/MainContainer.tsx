/* @jsx h */
import {
  appReducer,
  getUiInterface,
  setUiInterface,
  UIInterface,
} from 'controller/ui-actions';
import { AppSection, createAppState } from 'model/app-state';
import { h } from 'preact';
import { useReducer, useState } from 'preact/hooks';
import { colors, style } from 'view/style';
import BottomBar from './BottomBar';
import DialogSection from './DialogSection';
import GameSection from './GameSection';
import ModalSection from './ModalSection';

const CenterContent = style('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

const AspectRatioPhone = style('div', {
  width: '100%',
  maxWidth: '450px',
  aspectRatio: '9/16',
});

const Root = style('div', {
  // borderTop: '1px solid ' + colors.WHITE,
  // borderBottom: '1px solid ' + colors.WHITE,
  background: colors.BLACK,
  color: colors.WHITE,
  width: '100%',
  height: '100%',
  position: 'relative',
});

const renderSection = (section: AppSection) => {
  switch (section) {
    case AppSection.GAME: {
      return <GameSection key={section} />;
    }
    case AppSection.MODAL: {
      return <ModalSection key={section} />;
    }
    case AppSection.DIALOG: {
      return <DialogSection key={section} />;
    }
    default: {
      return <div></div>;
    }
  }
};

const MainContainer = () => {
  const [render, setRender] = useState(false);
  const [appState, dispatch] = useReducer(appReducer, createAppState());
  setUiInterface({
    appState,
    render: () => {
      setRender(!render);
    },
    dispatch,
  } as UIInterface);
  getUiInterface().appState = appState;

  console.log('render app', appState);

  return (
    <CenterContent id="center-content">
      <AspectRatioPhone id="aspect-ratio">
        <Root id="root">
          {appState.sections.map(renderSection)}
          <BottomBar />
        </Root>
      </AspectRatioPhone>
    </CenterContent>
  );
};

export default MainContainer;
