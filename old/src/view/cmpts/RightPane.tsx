/*
global
G_view_PickupItems
G_model_worldGetCurrentRoom
G_model_getRightPaneOverlayVisible
G_start
*/

let pickupItemsScrollTop = 0;
const G_view_RightPane = (world: World): SuperfineElement => {
  const isOverlayVisible = G_model_getRightPaneOverlayVisible();
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
      <div className="ctrl info-item" style={{ height: '100px' }}></div>
      <div className="pickup info-item" scrollTop={pickupItemsScrollTop}>
        {G_view_PickupItems(world.player, G_model_worldGetCurrentRoom(world))}
      </div>
      <div
        className="overlay"
        style={{
          right: 0,
          width: isOverlayVisible ? '100%' : '0',
        }}
      ></div>
    </div>
  );
};
