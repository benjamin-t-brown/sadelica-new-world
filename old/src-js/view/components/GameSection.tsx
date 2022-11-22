/* @jsx h */
import {
  getUiInterface,
  setGameInventoryState,
  setGameSelectedCharacter,
} from 'controller/ui-actions';
import { InventoryState } from 'model/app-state';
import { Actor } from 'model/actor';
import { getCurrentPlayer, getCurrentWorld, getScale } from 'model/generics';
import { Player } from 'model/player';
import { pxToPctHeight, pxToPctWidth } from 'model/screen';
import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { SmallSquareButton, Button } from 'view/elements/Button';
import { colors, style } from 'view/style';
import InventoryList from './InventoryList';
import { getCanvas } from 'model/canvas';
import { renderCurrentWorldState } from 'controller/update';
import TileOverlay from 'view/elements/TileOverlay';
import { getTileSize } from 'model/tile';
import { interactWithNearby } from 'controller/interact';

const Root = style('div', {
  width: '100%',
  background: colors.GREY,
});

const CharacterSelectRow = style('div', {
  height: pxToPctHeight(30),
  background: colors.GREY,
  display: 'flex',
});
const CharacterSelect = (props: IGameSubSectionProps) => {
  const { player, selectedCh } = props;

  const handleChButtonClick = useCallback(
    (ch: Actor) => {
      if (selectedCh !== ch) {
        setGameSelectedCharacter(ch);
      }
    },
    [selectedCh]
  );

  return (
    <CharacterSelectRow>
      {player?.party.map((ch, i) => {
        return (
          <SmallSquareButton
            onClick={handleChButtonClick.bind(null, ch)}
            key={ch.name + i}
            color={ch === selectedCh ? colors.BLUE : colors.DARKGREY_ALT}
            highlighted={ch === selectedCh}
            style={{
              height: 'auto',
              margin: '1px 2px',
            }}
          />
        );
      }) ?? []}
    </CharacterSelectRow>
  );
};

const CharacterNameInfoContainer = style('div', {
  height: pxToPctHeight(28),
  background: colors.WHITE,
  color: colors.BLACK,
  display: 'flex',
  alignItems: 'center',
  padding: '0px 2px',
  boxSizing: 'border-box',
});
const CharacterName = style('span', {
  width: '55%',
  whiteSpace: 'pre',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});
const ChInfoStat = style('span', (props: { color: string }) => {
  return {
    color: props.color,
    width: '10%',
    textAlign: 'center',
    fontSize: '0.8rem',
  };
});
const CharacterNameInfo = (props: { ch?: Actor | null }) => {
  return (
    <CharacterNameInfoContainer>
      <CharacterName>{props.ch?.name ?? ''}</CharacterName>
      <ChInfoStat color={colors.RED}>HP 100</ChInfoStat>
      <ChInfoStat color={colors.DARKBLUE}>MP 45</ChInfoStat>
    </CharacterNameInfoContainer>
  );
};

const InventoryStateButton = style('div', (props: { isClose: boolean }) => {
  return {
    position: 'absolute',
    right: '0px',
    top: '0px',
    width: pxToPctWidth(56),
    height: pxToPctHeight(56),
    border: '1px solid ' + colors.WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    background: colors.BLACK,
    boxSizing: 'border-box',
    '&:hover': {
      filter: 'brightness(120%)',
    },
    '&:active': {
      filter: 'brightness(80%)',
    },
  };
});

const CanvasContainer = style('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  height: pxToPctHeight(391),
  // background: 'url(bg.tmp.png)',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  position: 'relative',
});

interface IGameSubSectionProps {
  selectedCh: Actor | null;
  player: Player | null;
}

const BareSectionRoot = style('div', {
  width: '100%',
  background: colors.BLACK,
});
const BareSubSection = (props: IGameSubSectionProps) => {
  const { selectedCh } = props;
  return (
    <BareSectionRoot>
      <CharacterSelect {...props} />
      <CharacterNameInfo ch={selectedCh} />
    </BareSectionRoot>
  );
};

const FullSectionRoot = style('div', {
  width: '100%',
  background: colors.BLACK,
});
const StatsArea = style('div', {
  width: '100%',
  height: pxToPctHeight(77),
  background: colors.DARKGREY_ALT,
  display: 'flex',
  justifyContent: 'space-between',
});
const StatusArea = style('div', {
  width: '100%',
  height: pxToPctHeight(53),
  background: colors.DARKGREY,
  margin: '1px 0px',
});
const StatsSubArea = style('div', {
  width: '33%',
  height: '100%',
});
const Stat = style('div', {
  color: colors.WHITE,
  padding: '4px',
});
const InventoryArea = style('div', {
  width: '100%',
  height: pxToPctHeight(246),
  background: colors.DARKGREY_ALT,
  overflowY: 'auto',
});
const FullSubSection = (props: IGameSubSectionProps) => {
  const { selectedCh } = props;
  return (
    <FullSectionRoot>
      <CharacterSelect {...props} />
      <CharacterNameInfo ch={selectedCh} />
      <StatsArea>
        <StatsSubArea>
          <Stat>Dmg: 0</Stat>
          <Stat>Armor: 0</Stat>
        </StatsSubArea>
        <StatsSubArea>
          <Stat>Acc: +0</Stat>
          <Stat>Pow: +0</Stat>
          <Stat>Crit: 0%</Stat>
        </StatsSubArea>
        <StatsSubArea
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Button
            color={colors.DARKRED}
            style={{
              height: 'calc(50% - 5px)',
              margin: '1px 0px',
            }}
          >
            Skills
          </Button>
          <Button
            color={colors.DARKRED}
            style={{
              height: 'calc(50% - 5px)',
              margin: '1px 0px',
            }}
          >
            Actions
          </Button>
        </StatsSubArea>
      </StatsArea>
      <StatusArea></StatusArea>
      <InventoryArea>
        {selectedCh ? <InventoryList ch={selectedCh} /> : null}
      </InventoryArea>
    </FullSectionRoot>
  );
};

const Interactable = style('div', () => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  // border: '1px solid ' + colors.WHITE,
  pointerEvents: 'all',
}));

const GameSection = () => {
  const appState = getUiInterface().appState;
  const gameState = appState.game;
  const inventoryState = gameState.inventoryState;
  const player = getCurrentPlayer();
  const [tileOverlaysVisible, setTileOverlaysVisible] = useState(false);

  const handleInventoryStateButtonClick = useCallback(() => {
    if (inventoryState === InventoryState.BARE) {
      setGameInventoryState(InventoryState.FULL);
    } else if (inventoryState === InventoryState.FULL) {
      setGameInventoryState(InventoryState.BARE);
    }
  }, [inventoryState]);

  const subSection = ((inventoryState: InventoryState) => {
    switch (inventoryState) {
      case InventoryState.BARE: {
        return (
          <BareSubSection player={player} selectedCh={gameState.selectedCh} />
        );
      }
      case InventoryState.FULL: {
        return (
          <FullSubSection player={player} selectedCh={gameState.selectedCh} />
        );
      }
      default: {
        return <div></div>;
      }
    }
  })(gameState.inventoryState);

  const handleInteractableClick = useCallback((act: Actor) => {
    interactWithNearby(act);
  }, []);

  useEffect(() => {
    // load canvas to canvas module
    getCanvas();

    // renders the world state on the canvas
    renderCurrentWorldState(getCurrentWorld());

    setTileOverlaysVisible(true);
  }, []);

  return (
    <Root id="game-section">
      {subSection}
      <InventoryStateButton
        onClick={handleInventoryStateButtonClick}
        isClose={inventoryState === InventoryState.FULL}
      >
        {inventoryState === InventoryState.FULL ? 'X' : 'Inv'}
      </InventoryStateButton>
      <CanvasContainer
        style={{
          display: inventoryState === InventoryState.FULL ? 'none' : 'flex',
        }}
      >
        <canvas id="main-canvas" width={640} height={768}></canvas>
        <div
          style={{
            width: '640px',
            height: '768px',
            position: 'absolute',
            left: '0',
            top: '0',
            pointerEvents: 'none',
          }}
        >
          {tileOverlaysVisible
            ? gameState.interactables.map((act, i) => {
                return (
                  <TileOverlay key={act.name + i} x={act.x} y={act.y}>
                    <Interactable
                      onClick={handleInteractableClick.bind(null, act)}
                    >
                      <div
                        style={{
                          pointerEvents: 'none',
                          textAlign: 'center',
                          position: 'absolute',
                          top: (-getTileSize() * getScale()) / 2,
                          left: `calc(-100% - ${
                            getTileSize() * getScale()
                          }px / 2)`,
                          width: '400%',
                        }}
                      >
                        {act.name}
                      </div>
                    </Interactable>
                  </TileOverlay>
                );
              })
            : null}
        </div>
      </CanvasContainer>
      {/* <CanvasContainer
        style={{
          position: 'absolute',
          top: 'calc(6.35% + 5.83333%)',
        }}
      >
        <div
          style={{
            width: '640px',
            height: '768px',
            position: 'absolute',
            left: '0',
            top: '0',
          }}
        >
          {tileOverlaysVisible ? (
            <TileOverlay
              id="tile-overlay"
              x={getCurrentPlayer().leader.x}
              y={getCurrentPlayer().leader.y}
            ></TileOverlay>
          ) : null}
        </div>
      </CanvasContainer> */}
    </Root>
  );
};

export default GameSection;
