/*
global
G_model_getCurrentWorld
G_model_getDialogLines
G_model_setDialogVisible
G_model_setInputDisabled
G_model_setRightPaneOverlayVisible
G_model_setLeftPaneOverlayVisible
G_view_renderUi
G_controller_render
G_in2_executeDialog
*/

const G_controller_playDialog = (dialogName: string) => {
  const lines = G_model_getDialogLines();
  lines.splice(0, lines.length);
  G_controller_showDialog();
  G_in2_executeDialog(dialogName);
};
const G_controller_showDialog = () => {
  G_model_setDialogVisible(true);
  G_model_setInputDisabled(true);
  G_model_setRightPaneOverlayVisible(true);
  G_model_setLeftPaneOverlayVisible(true);
  G_view_renderUi();
};
const G_controller_hideDialog = () => {
  G_model_setDialogVisible(false);
  G_model_setRightPaneOverlayVisible(false);
  G_model_setLeftPaneOverlayVisible(false);
  G_view_renderUi();

  // hack so you can't accidentally equip/unequip/use items right after speaking
  setTimeout(() => {
    G_model_setInputDisabled(false);
  }, 100);
};
