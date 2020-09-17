/*
global
G_model_setDrawTargetingLine
G_model_getCurrentWorld
G_model_getIsVictory
G_view_playSound
G_view_drawSprite
G_utils_cycleItemInArr
G_superfine_patch

G_VIEW_DIV
G_VIEW_INNER_HTML
G_VIEW_ONCLICK
G_view_appendChild
G_view_setClassName
G_view_getElementById
G_view_createElement
G_view_setStyle

G_view_RightPane
G_view_LeftPane
G_view_Dialog
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

const G_view_renderUi = () => {
  const world = G_model_getCurrentWorld();
  const rightPane = G_view_getElementById('rightPane') as HTMLElement;
  const leftPane = G_view_getElementById('leftPane') as HTMLElement;
  const dialogWindow = G_view_getElementById('dialog') as HTMLElement;

  if (G_model_getIsVictory()) {
    G_view_setStyle(rightPane, { width: '0' });
  } else {
    G_view_setStyle(rightPane, { width: '' });
    G_superfine_patch(leftPane, G_view_LeftPane(world));
    G_superfine_patch(rightPane, G_view_RightPane(world));
    G_superfine_patch(dialogWindow, G_view_Dialog());
  }
  G_view_setStyle(document.body.children[0] as HTMLElement, {
    display: 'flex',
  });
};
