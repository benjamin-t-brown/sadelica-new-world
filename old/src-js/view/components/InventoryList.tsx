/* @jsx h */
import { h, Fragment } from 'preact';
import { Item } from 'model/item';
import { Button, SmallSquareButton, TextButton } from 'view/elements/Button';
import { colors, style } from 'view/style';
import { pxToPctWidth } from 'model/screen';
import VerticalMenu from 'view/elements/VerticalMenu';
import { Actor } from 'model/actor';

const InventoryItemContainer = style('div', {
  position: 'relative',
  width: '100%',
  height: '16.6%',
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
const InventoryItem = (props: { value: ItemWithCount }) => {
  const itemWithCount = props.value;
  const textButtonStyle = {
    marginRight: '2.5%',
    color: colors.GREY,
  };
  return (
    <InventoryItemContainer>
      <InventoryItemName>
        {itemWithCount.item.name}{' '}
        {itemWithCount.count > 1 ? `(${itemWithCount.count})` : ''}
      </InventoryItemName>
      <InventoryItemActions>
        <TextButton style={textButtonStyle}>Up</TextButton>
        <TextButton style={textButtonStyle}>Dn</TextButton>
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
        Use
      </Button>
    </InventoryItemContainer>
  );
};

const stackItems = (items: Item[]) => {
  return items.reduce((items, item) => {
    const existingItem = items.find(a => a.item.name === item.name);
    if (existingItem && item.stackable) {
      existingItem.count++;
    } else {
      items.push({
        item,
        count: 0,
      });
    }
    return items;
  }, [] as ItemWithCount[]);
};

interface ItemWithCount {
  item: Item;
  count: number;
}

const InventoryList = (props: { ch: Actor }) => {
  const backpack = stackItems(props.ch.inventory);
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
      This character has no items.
    </div>
  ) : (
    <VerticalMenu
      width="100%"
      height="100%"
      onItemClick={itemWithCount => {
        console.log('clicked item', itemWithCount.item);
      }}
      items={backpack.map(itemWithCount => {
        return {
          Cmpt: InventoryItem,
          value: itemWithCount,
        };
      })}
    />
  );
};

export default InventoryList;
