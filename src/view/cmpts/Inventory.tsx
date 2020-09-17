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
G_model_itemIsUsable
G_model_setSelectedInventoryItemIndex
G_model_itemCanBeEquipped
G_model_getDialogVisible
G_controller_equipItem
G_controller_useItem
G_utils_cycleItemInArr
G_view_renderUi
G_view_cacheItemIconDataUrl
*/

let inventoryScrollTop = 0;

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
  const menuElems: SuperfineElement[] = [];

  if (G_model_itemIsUsable(item)) {
    menuElems.push(
      <div
        className="menu-item"
        onclick={async () => {
          G_model_setSelectedInventoryItemIndex(i);
          G_controller_useItem(baseItem, actor);
        }}
      >
        USE
      </div>
    );
  }
  if (G_model_itemCanBeEquipped(item) && !isEquipped) {
    menuElems.push(
      <div
        className="menu-item"
        onclick={async () => {
          G_controller_equipItem(i, actor);
        }}
      >
        EQP
      </div>
    );
  }

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
      <div style={{ margin: '5px', width: '20px' }}>{`${i + 1}. `}</div>
      <div className="vrt menu-item-ctr">{menuElems}</div>
      <img style={{ margin: '2px' }} src={url}></img>
      <div style={{ color: isEquipped ? '#9ef' : 'unset' }}>{`${itemName} ${
        amount > 1 ? '(' + amount + ')' : ''
      }`}</div>
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
