/*
global
G_view_PickupItems
G_model_worldGetCurrentRoom
G_start
*/

let pickupItemsScrollTop = 0;

const G_view_RightPane = (world: World): SuperfineElement => {
  return (
    <div>
      <div className="ctrl info-item hrz">
        <div
          id="reset-item"
          className="menu-item"
          style={{ width: '80px' }}
          onclick={() => G_start()}
        >
          Reset
        </div>
      </div>
      <div className="ctrl info-item" style={{ height: '134px' }}></div>
      <div className="pickup info-item" scrollTop={pickupItemsScrollTop}>
        {G_view_PickupItems(world.player, G_model_worldGetCurrentRoom(world))}
      </div>
    </div>
  );
};
