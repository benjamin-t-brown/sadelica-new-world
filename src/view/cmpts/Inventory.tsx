/*
global
G_model_playerGetActor
G_model_actorGetInventory
*/

let inventoryScrollTop = 0;

const G_view_Inventory = (
  player: Player,
  parent: HTMLElement
): SuperfineElement => {
  // const div = G_view_createElement(G_VIEW_DIV);
  // div.onscroll = () => {
  //   inventoryScrollTop = div.scrollTop;
  // };
  // G_view_setClassName(div, 'inventory');

  // const title = G_view_createElement(G_VIEW_DIV, 'INVENTORY');
  // G_view_setClassName(title, 'title');
  // G_view_appendChild(div, title);

  const actor = G_model_playerGetActor(player);
  const inventory = G_model_actorGetInventory(actor);
  // for (let i = 0; i < 10; i++) {
  //   InventoryItem(inventory[i], i, actor, div);
  // }
  // G_view_appendChild(parent, div);
  // div.scrollTop = inventoryScrollTop;

  const elems: SuperfineElement[] = [];
  for (let i = 0; i < 24; i++) {
    //InventoryItem(inventory[i], i, actor, div);
  }

  return (
    <div
      className="inventory"
      onscroll={(ev: MouseEvent) =>
        (inventoryScrollTop = (ev?.target as HTMLElement)?.scrollTop)
      }
      scrollTop={inventoryScrollTop}
    >
      <div className="title">INVENTORY</div>
      {elems}
    </div>
  );
};
