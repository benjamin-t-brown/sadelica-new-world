/*
global
G_controller_useItem
G_controller_equipItem
G_controller_render
G_controller_acquireItem
G_controller_sellItem
G_model_getCurrentWorld
G_model_itemGetBaseItem
G_model_itemGetAmount
G_model_itemGetName
G_model_itemGetSprite
G_model_itemIsUsable
G_model_itemCanBeEquipped
G_model_createCanvas
G_model_playerGetActor
G_model_actorGetInventory
G_model_actorSetEquippedItem
G_model_actorGetEquippedItem
G_model_actorGetStats
G_model_actorPushInventory
G_model_statsGetHp
G_model_statsGetMaxHp
G_model_setDrawTargetingLine
G_model_setSelectedInventoryItemIndex
G_model_getSelectedInventoryItemIndex
G_model_unsetSelectedInventoryItemIndex
G_model_setTargetSelectedCb
G_model_itemGetOnUse
G_model_worldGetCurrentRoom
G_model_roomGetSurroundingItemsAt
G_model_roomRemoveItemAt
G_model_getLogs
G_model_actorGetDamage
G_model_isCutsceneVisible
G_model_getCutsceneLine
G_model_getCutsceneSprite
G_model_playerIsAtSellTile
G_model_playerIsAtFountainTile
G_model_playerGetGold
G_model_itemGetSellAmount
G_model_getCurrentPlayer
G_model_setCutsceneLine
G_model_getIsVictory
G_model_setIsVictory
G_model_setCutsceneVisible
G_view_playSound
G_view_drawSprite
G_utils_cycleItemInArr
G_start
G_superfine_patch

G_VIEW_DIV
G_VIEW_INNER_HTML
G_VIEW_ONCLICK
G_view_appendChild
G_view_setClassName
G_view_getElementById
G_view_createElement
G_view_setStyle

G_view_PickupItems
G_view_RightPane
*/

// tracks the scroll top so it can be re-applied on re-render
// let inventoryScrollTop = 0;

const G_view_showTargetingLine = (
  x: number,
  y: number,
  x2: number,
  y2: number
) => {
  const parent = G_view_getElementById('tgt') as HTMLElement;
  G_view_setStyle(parent, { display: 'block' });
  const elem = parent.children[0];
  const setAttribute = 'setAttribute';
  elem[setAttribute]('x1', '' + x);
  elem[setAttribute]('x2', '' + x2);
  elem[setAttribute]('y1', '' + y);
  elem[setAttribute]('y2', '' + y2);
};

const G_view_hideTargetingLine = () => {
  G_model_setDrawTargetingLine(false);
  G_view_setStyle(G_view_getElementById('tgt') as HTMLElement, {
    display: 'none',
  });
};

const InventoryItem = (
  item: GenericItem | null,
  i: number,
  actor: Actor,
  parent: HTMLElement
) => {
  const div = G_view_createElement(G_VIEW_DIV);
  G_view_setClassName(div, 'item hrz');
  if (item) {
    const baseItem = G_model_itemGetBaseItem(item);
    const amount = G_model_itemGetAmount(item);
    const itemName = G_model_itemGetName(baseItem);
    const itemSprite = G_model_itemGetSprite(baseItem);
    const isEquipped = G_model_actorGetEquippedItem(actor) === item;
    G_view_setStyle(div, { 'justify-content': 'flex-start' });

    if (i === G_model_getSelectedInventoryItemIndex()) {
      G_view_setStyle(div, { background: '#444' });
    }

    const cycleMenu = G_view_createElement(G_VIEW_DIV);
    G_view_setClassName(cycleMenu, 'vrt menu-item-ctr');
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

    const cycClassName = 'cyc-item';
    const cycleUp = G_view_createElement(G_VIEW_DIV, 'up');
    G_view_setClassName(cycleUp, cycClassName);
    cycleUp[G_VIEW_ONCLICK] = createCycleFunc(-1);
    G_view_appendChild(cycleMenu, cycleUp);
    const cycleDown = G_view_createElement(G_VIEW_DIV, 'dn');
    G_view_setClassName(cycleDown, cycClassName);
    cycleDown[G_VIEW_ONCLICK] = createCycleFunc(1);
    G_view_appendChild(cycleMenu, cycleDown);
    G_view_appendChild(div, cycleMenu);

    const numberLabel = G_view_createElement(G_VIEW_DIV, `${i + 1}. `);
    G_view_setStyle(numberLabel, { margin: '5px', width: '20px' });
    G_view_appendChild(div, numberLabel);

    const menu = G_view_createElement(G_VIEW_DIV);
    G_view_setClassName(menu, 'vrt menu-item-ctr');
    G_view_appendChild(div, menu);
    const world = G_model_getCurrentWorld();
    if (G_model_playerIsAtSellTile(world.player, world)) {
      const btn = G_view_createElement(G_VIEW_DIV, 'SELL');
      btn[G_VIEW_ONCLICK] = () => {
        G_controller_sellItem(item, G_model_getCurrentPlayer());
      };
      G_view_setClassName(btn, 'menu-item');
      G_view_setStyle(btn, { background: '#994' });
      G_view_appendChild(menu, btn);

      const cost = G_view_createElement(
        G_VIEW_DIV,
        `${G_model_itemGetSellAmount(item)} gold `
      );
      G_view_setStyle(cost, {
        'text-align': 'center',
        color: '#FFE762',
        margin: '5px',
        width: '32px',
      });
      G_view_appendChild(div, cost);
    } else {
      if (G_model_itemIsUsable(item)) {
        const btn = G_view_createElement(G_VIEW_DIV, 'USE');
        G_view_setClassName(btn, 'menu-item');
        btn[G_VIEW_ONCLICK] = async () => {
          G_model_setSelectedInventoryItemIndex(i);
          G_controller_useItem(baseItem, actor);
        };
        G_view_appendChild(menu, btn);
      }
      if (G_model_itemCanBeEquipped(item) && !isEquipped) {
        const btn = G_view_createElement(G_VIEW_DIV, 'EQP');
        btn[G_VIEW_ONCLICK] = () => {
          G_controller_equipItem(i, actor);
        };
        G_view_setClassName(btn, 'menu-item');
        G_view_appendChild(menu, btn);
      }
    }

    const [canvas, ctx] = G_model_createCanvas(32, 32);
    G_view_setStyle(canvas, { margin: '2px' });
    G_view_drawSprite(itemSprite, 0, 0, 2, ctx);
    G_view_appendChild(div, canvas);

    const span = G_view_createElement(
      G_VIEW_DIV,
      `${itemName} ${amount > 1 ? '(' + amount + ')' : ''}`,
      { width: '90px' }
    );
    if (isEquipped) {
      G_view_setStyle(span, { color: '#9ef' });
    }
    G_view_appendChild(div, span);
  }
  G_view_appendChild(parent, div);
};

const Inventory = (player: Player, parent: HTMLElement) => {
  const div = G_view_createElement(G_VIEW_DIV);
  div.onscroll = () => {
    inventoryScrollTop = div.scrollTop;
  };
  G_view_setClassName(div, 'inventory');

  const title = G_view_createElement(G_VIEW_DIV, 'INVENTORY');
  G_view_setClassName(title, 'title');
  G_view_appendChild(div, title);

  const actor = G_model_playerGetActor(player);
  const inventory = G_model_actorGetInventory(actor);
  for (let i = 0; i < 10; i++) {
    InventoryItem(inventory[i], i, actor, div);
  }
  G_view_appendChild(parent, div);
  div.scrollTop = inventoryScrollTop;
};

const G_view_renderUi = () => {
  const world = G_model_getCurrentWorld();
  const invDiv = G_view_getElementById('invDiv') as HTMLElement;
  invDiv[G_VIEW_INNER_HTML] = '';
  const rightPane = G_view_getElementById('rightPane') as HTMLElement;

  if (G_model_getIsVictory() || G_model_isCutsceneVisible()) {
    G_view_setStyle(rightPane, { width: '0' });
  } else {
    G_view_setStyle(rightPane, { width: '' });
    Inventory(world.player, invDiv);
    G_superfine_patch(rightPane, G_view_RightPane(world));
  }
  G_view_setStyle(document.body.children[0] as HTMLElement, {
    display: 'flex',
  });
};
