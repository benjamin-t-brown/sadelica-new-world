/* @jsx h */
import {
  getUiInterface,
  hideSection,
  setGameSelectedCharacter,
} from 'controller/ui-actions';
import { AppSection, StoreItem } from 'model/app-state';
import { Actor } from 'model/actor';
import { getCurrentPlayer } from 'model/generics';
import { Player } from 'model/player';
import { pxToPctHeight, pxToPctWidth } from 'model/screen';
import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { SmallSquareButton, TextButton } from 'view/elements/Button';
import { colors, style } from 'view/style';
import StoreItemList from './StoreItemList';

const Root = style('div', {
  width: '100%',
  height: '100%',
  background: colors.GREY,
  position: 'absolute',
  top: '0',
  left: '0',
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
    // width: '10%',
    textAlign: 'center',
    fontSize: '1rem',
  };
});
const CharacterNameInfo = (props: { ch?: Actor | null; player: Player }) => {
  return (
    <CharacterNameInfoContainer>
      <CharacterName>{props.ch?.name ?? ''}</CharacterName>
      <ChInfoStat color={colors.DARKYELLOW}>☼{props.player.money}</ChInfoStat>
    </CharacterNameInfoContainer>
  );
};

const CloseStoreButton = style('div', () => {
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

const StoreInfoArea = style('div', {
  width: '100%',
  height: pxToPctHeight(30),
  background: colors.DARKGREY,
  margin: '1px 0px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0px 2px',
  boxSizing: 'border-box',
});
const StoreName = style('div', {
  color: colors.CYAN,
});
const StoreBuySellContainer = style('div', {
  display: 'flex',
  marginRight: '0.5rem',
});

interface IGameSubSectionProps {
  selectedCh: Actor | null;
  player: Player | null;
}
const FullSectionRoot = style('div', {
  width: '100%',
  background: colors.BLACK,
});

const StoreSection = () => {
  const appState = getUiInterface().appState;
  const storeState = appState.store;
  const gameState = appState.game;
  const player = getCurrentPlayer();
  const selectedCh = gameState.selectedCh;

  const [buySellIndex, setBuySellIndex] = useState(0);

  const handleCloseStoreClick = useCallback(() => {
    hideSection(AppSection.STORE);
  }, []);

  const handleBuySellClick = useCallback((buttonName: string) => {
    if (buttonName === 'buy') {
      setBuySellIndex(0);
    } else if (buttonName === 'sell') {
      setBuySellIndex(1);
    }
  }, []);

  const itemList: StoreItem[] =
    buySellIndex === 0
      ? storeState.items
      : selectedCh?.inventory.map(item => {
          return {
            itemName: item.name,
            quantity: 1,
            price: 30,
          };
        }) ?? [];

  return (
    <Root id="store-section">
      <FullSectionRoot>
        <CharacterSelect selectedCh={gameState.selectedCh} player={player} />
        <CharacterNameInfo ch={gameState.selectedCh} player={player} />
        <CloseStoreButton onClick={handleCloseStoreClick}>X</CloseStoreButton>
        <StoreInfoArea>
          <StoreName>{storeState.name}</StoreName>
          <StoreBuySellContainer>
            <TextButton
              style={{
                paddingLeft: '0.5rem',
                boxSizing: 'border-box',
                color: buySellIndex === 0 ? '' : 'white',
              }}
              highlighted={buySellIndex === 0}
              onClick={handleBuySellClick.bind(null, 'buy')}
            >
              Buy
            </TextButton>
            <TextButton
              style={{
                paddingLeft: '0.5rem',
                boxSizing: 'border-box',
                color: buySellIndex === 1 ? '' : 'white',
              }}
              highlighted={buySellIndex === 1}
              onClick={handleBuySellClick.bind(null, 'sell')}
            >
              Sell
            </TextButton>
          </StoreBuySellContainer>
        </StoreInfoArea>
        <div
          style={{
            height: '81%',
            background: colors.DARKGREY,
          }}
        >
          <StoreItemList items={itemList}></StoreItemList>
        </div>
      </FullSectionRoot>
    </Root>
  );
};

export default StoreSection;
