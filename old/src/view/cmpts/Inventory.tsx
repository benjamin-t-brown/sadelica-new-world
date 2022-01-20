/*
global
G_model_playerGetActor
G_model_actorGetInventory
G_model_itemGetBaseItem
G_model_itemGetAmount
G_model_itemGetName
G_model_itemGetSprite
G_model_actorGetEquippedItem
G_model_getSelectedInventoryItemIndex
G_model_actorSetEquippedItem
G_model_getCurrentWorld
G_model_worldGetCurrentRoom
G_model_itemIsUsable
G_model_setSelectedInventoryItemIndex
G_model_itemCanBeEquipped
G_model_getDialogVisible
G_model_getCurrentPlayer
G_controller_equipItem
G_controller_unequipItem
G_controller_useItem
G_controller_dropItemOnGround
G_controller_examineItem
G_utils_cycleItemInArr
G_view_renderUi
G_view_cacheItemIconDataUrl
G_view_Select
*/

let inventoryScrollTop = 0;

const MENU_VALUE_USE = 'use';
const MENU_VALUE_DROP = 'drop';
const MENU_VALUE_EXAMINE = 'examine';
const MENU_VALUE_EQUIP = 'equip';
const MENU_VALUE_UNEQUIP = 'unequip';

const InventoryItem = (item: GenericItem | null, i: number, actor: Actor) => {
  if (!item) {
    return <div className="item hrz"></div>;
  }

  const baseItem = G_model_itemGetBaseItem(item);
  const amount = G_model_itemGetAmount(item);
  const itemName = G_model_itemGetName(baseItem);
  const itemSprite = G_model_itemGetSprite(baseItem);
  const url = G_view_cacheItemIconDataUrl(itemSprite);
  const isEquipped = G_model_actorGetEquippedItem(actor) === item;
  const createCycleFunc = (dir: 1 | -1) => {
    return () => {
      const equipI = actor[12];
      const newI = G_utils_cycleItemInArr(
        i,
        G_model_actorGetInventory(actor),
        dir
      );
      let nextI = equipI;
      if (newI === equipI) {
        nextI = equipI - dir;
      }
      if (isEquipped) {
        nextI = i + dir;
      }
      G_model_actorSetEquippedItem(actor, nextI);
      G_view_renderUi();
    };
  };
  const menuElems: IOptionProps[] = [];

  menuElems.push({
    value: '',
    label: '',
  });

  if (G_model_itemIsUsable(item)) {
    menuElems.push({
      value: MENU_VALUE_USE,
      label: 'Use',
    });
  }
  if (G_model_itemCanBeEquipped(item) && !isEquipped) {
    menuElems.push({
      value: MENU_VALUE_EQUIP,
      label: 'Equip',
    });
  } else if (isEquipped) {
    menuElems.push({
      value: MENU_VALUE_UNEQUIP,
      label: 'Unequip',
    });
  }

  menuElems.push({
    value: MENU_VALUE_EXAMINE,
    label: 'Examine',
  });

  menuElems.push({
    value: MENU_VALUE_DROP,
    label: 'Drop',
  });

  const handleMenuAction = (value: string) => {
    switch (value) {
      case MENU_VALUE_USE:
        G_model_setSelectedInventoryItemIndex(i);
        G_controller_useItem(baseItem, actor);
        break;
      case MENU_VALUE_EQUIP:
        G_controller_equipItem(i, actor);
        break;
      case MENU_VALUE_UNEQUIP:
        G_controller_unequipItem(actor);
        break;
      case MENU_VALUE_EXAMINE:
        G_controller_examineItem(item, G_model_getCurrentPlayer());
        break;
      case MENU_VALUE_DROP:
        G_controller_dropItemOnGround(
          baseItem,
          actor,
          G_model_worldGetCurrentRoom(G_model_getCurrentWorld())
        );
        break;
    }
  };

  return (
    <div
      className="item hrz"
      style={{
        'justify-content': 'flex-start',
        background:
          i === G_model_getSelectedInventoryItemIndex() ? '#444' : 'unset',
      }}
    >
      <div className="vrt menu-item-ctr">
        <div className="cyc-item" onclick={createCycleFunc(-1)}>
          up
        </div>
        <div className="cyc-item" onclick={createCycleFunc(1)}>
          dn
        </div>
      </div>
      <div style={{ width: '20px' }}>{`${i + 1}. `}</div>
      <div
        onclick={ev => {
          if (G_model_itemIsUsable(item)) {
            handleMenuAction(MENU_VALUE_USE);
          } else if (G_model_itemCanBeEquipped(item) && !isEquipped) {
            handleMenuAction(MENU_VALUE_EQUIP);
          } else if (isEquipped) {
            handleMenuAction(MENU_VALUE_UNEQUIP);
          }
        }}
        className="hrz-between"
        style={{
          width: '240px',
        }}
      >
        <div
          className="hrz"
          style={{
            width: '212px',
            'justify-content': 'flex-start',
          }}
        >
          <img style={{ 'margin-right': '2px' }} src={url}></img>
          <div style={{ color: isEquipped ? '#9ef' : 'unset' }}>{`${itemName} ${
            amount > 1 ? '(' + amount + ')' : ''
          }`}</div>
        </div>
        <div className="vrt menu-item-ctr">
          {G_view_Select({
            className: 'sel',
            value: 0,
            items: menuElems,
            onChange: handleMenuAction,
          })}
        </div>
      </div>
    </div>
  );
};

const G_view_Inventory = (player: Player): SuperfineElement => {
  const actor = G_model_playerGetActor(player);
  const inventory = G_model_actorGetInventory(actor);
  const elems: SuperfineElement[] = [];
  const dialogVisible = G_model_getDialogVisible();

  for (let i = 0; i < 24; i++) {
    elems.push(InventoryItem(inventory[i], i, actor));
  }

  return (
    <div
      id="invDiv"
      // style={{
      //   background: dialogVisible ? 'rgba(0, 0, 0, 0.3)' : 'unset',
      // }}
    >
      <div
        className="inventory"
        onscroll={(ev: MouseEvent) => {
          inventoryScrollTop = (ev?.target as HTMLElement)?.scrollTop;
        }}
        scrollTop={inventoryScrollTop}
      >
        <div className="title">INVENTORY</div>
        {elems}
      </div>
      <div
        className="overlay"
        style={{
          width: dialogVisible ? '100%' : '0',
        }}
      ></div>
    </div>
  );
};
