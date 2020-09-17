/*
global
G_view_Inventory
G_model_worldGetCurrentRoom
G_model_getLeftPaneOverlayVisible
*/

const G_view_LeftPane = (world: World): SuperfineElement => {
  const isOverlayVisible = G_model_getLeftPaneOverlayVisible();
  return (
    <div id="leftPane">
      {G_view_Inventory(world.player)}
      <div
        className="overlay"
        style={{
          left: 0,
          width: isOverlayVisible ? '100%' : '0',
        }}
      ></div>
    </div>
  );
};
