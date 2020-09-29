/*
global
G_controller_initEvents
G_controller_render
G_controllerPlayCutscene
G_model_getCanvas
G_model_getImage
G_model_getCtx
G_model_getCanvas
G_model_getSprite
G_model_loadImagesAndSprites
G_model_createWorld
G_model_setCurrentWorld
G_model_setInputDisabled
G_view_clearScreen
G_view_renderWorld
G_view_renderMap
G_view_renderUi
G_view_playSound
G_initActors
*/

const G_start = () => {
  G_model_setInputDisabled(false);
  const world = G_model_createWorld('map1');
  G_model_setCurrentWorld(world);
  console.log('world', world);
  G_controller_render(world);
  // G_view_playSound('start');
  G_view_renderUi();
};

const main = async () => {
  await G_model_loadImagesAndSprites([
    ['terrain1', 'res/terrain1.png', 16, 16, 1, 1, ['terrain1']],
    ['actors1', 'res/actors1.png', 16, 16, 1, 1, ['actors1']],
    ['map1', 'res/map1.png', 64, 64, 1, 1, ['map1']],
  ]);

  G_initActors();
  G_controller_initEvents();
  G_start();
  //G_view_renderMap(world, 1);
};

window.addEventListener('load', main);
