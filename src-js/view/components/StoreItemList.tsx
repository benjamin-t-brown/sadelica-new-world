/* @jsx h */
import { h, Fragment } from 'preact';
import { Item } from 'model/item';
import { Button, SmallSquareButton, TextButton } from 'view/elements/Button';
import { colors, style } from 'view/style';
import { pxToPctWidth } from 'model/screen';
import VerticalMenu from 'view/elements/VerticalMenu';
import { Actor } from 'model/actor';
import { StoreItem } from 'model/app-state';

const InventoryItemContainer = style('div', {
  position: 'relative',
  width: '100%',
  height: '10.6%',
  background: colors.WHITE,
  color: colors.BLACK,
  boxSizing: 'border-box',
  paddingLeft: '2.5%',
});
const InventoryItemName = style('div', {
  display: 'flex',
  alignItems: 'center',
  height: '50%',
});
const InventoryItemActions = style('div', {
  display: 'flex',
  alignItems: 'center',
  height: '50%',
});
const StoreItemRow = (props: { value: StoreItem }) => {
  const storeItem = props.value;
  const textButtonStyle = {
    marginRight: '2.5%',
    color: colors.GREY,
  };
  return (
    <InventoryItemContainer>
      <InventoryItemName>
        {storeItem.itemName}{' '}
        {storeItem.quantity > 1 ? `(${storeItem.quantity})` : ''}
      </InventoryItemName>
      <InventoryItemActions>
        <div style={{ ...textButtonStyle, color: colors.DARKYELLOW }}>
          ☼{storeItem.price}
        </div>
        <TextButton style={textButtonStyle}>Exam.</TextButton>
      </InventoryItemActions>
      <Button
        style={{
          position: 'absolute',
          right: '12',
          top: '3',
          width: pxToPctWidth(50),
          height: 'calc(100% - 8px)',
        }}
      >
        Buy
      </Button>
    </InventoryItemContainer>
  );
};

const StoreItemList = (props: { items: StoreItem[] }) => {
  const backpack = props.items;
  return backpack.length === 0 ? (
    <div
      style={{
        width: '100%',
        padding: '1rem',
        textAlign: 'center',
        color: colors.CYAN,
        boxSizing: 'border-box',
      }}
    >
      No items.
    </div>
  ) : (
    <VerticalMenu
      width="100%"
      height="100%"
      onItemClick={storeItem => {
        console.log('clicked item', storeItem.itemName);
      }}
      items={backpack.map(storeItem => {
        return {
          Cmpt: StoreItemRow,
          value: storeItem,
        };
      })}
    />
  );
};

export default StoreItemList;
