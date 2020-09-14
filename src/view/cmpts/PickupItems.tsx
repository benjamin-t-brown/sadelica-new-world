/*
global
G_model_itemGetBaseItem
G_model_itemGetAmount
G_model_itemGetName
G_model_itemGetSprite
G_model_createCanvas
G_model_playerGetActor
G_model_roomGetSurroundingItemsAt
G_controller_acquireItem
G_view_drawSprite
*/

const itemCanvasCache = {};

const PickupItemsRow = (
  item: GenericItem,
  i: number,
  room: Room,
  x: number,
  y: number,
  actor: Actor
): SuperfineElement => {
  if (!item) {
    return (
      <div
        key={i}
        className="item hrz"
        style={{ width: '155px', background: '#555' }}
      ></div>
    );
  }

  const baseItem = G_model_itemGetBaseItem(item);
  const amount = G_model_itemGetAmount(item);
  const itemName = G_model_itemGetName(baseItem);
  const itemSprite = G_model_itemGetSprite(baseItem);

  let url = itemCanvasCache[itemSprite];
  if (!url) {
    const [canvas, ctx] = G_model_createCanvas(32, 32);
    G_view_drawSprite(itemSprite, 0, 0, 2, ctx);
    url = canvas.toDataURL();
    itemCanvasCache[itemSprite] = url;
  }

  return (
    <div
      key={itemName + i}
      className="item hrz"
      style={{
        width: '155px',
        background: '#555',
        'justify-content': 'flex-start',
      }}
      onclick={() => G_controller_acquireItem(item, actor, x, y, room)}
    >
      <span>{`${'!@#$%^&*()_+'[i]}.`}</span>
      <img src={url}></img>
      <span>{`${itemName} ${amount > 1 ? '(' + amount + ')' : ''}`}</span>
    </div>
  );
};

const G_view_PickupItems = (player: Player, room: Room): SuperfineElement => {
  const actor = G_model_playerGetActor(player);
  const nearbyItemsAt = G_model_roomGetSurroundingItemsAt(room, actor);

  return (
    <div>
      <div className="title">NEARBY ITEMS</div>
      {nearbyItemsAt.map(([item, x, y], i) => {
        return PickupItemsRow(item, i, room, x, y, actor);
      })}
    </div>
  );
};
