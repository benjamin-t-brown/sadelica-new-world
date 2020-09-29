/*
global
G_model_getDialogLines
G_model_getDialogVisible
G_model_getDialogActor
G_model_actorGetSprite
G_view_cachePortraitIconDataUrl
*/

const G_view_Dialog = (): SuperfineElement => {
  const lines = G_model_getDialogLines();
  const visible = G_model_getDialogVisible();

  const actor = G_model_getDialogActor();
  let url = G_view_cachePortraitIconDataUrl(
    actor ? G_model_actorGetSprite(actor) : 'actors1_0'
  );

  return (
    <div
      style={{
        // padding: '16px',
        height: visible ? '100%' : '0px',
        opacity: visible ? '1' : '0',
      }}
    >
      <div
        className="dialog-bg"
        style={{
          opacity: visible ? '1' : '0',
        }}
      ></div>
      <div className="title">DIALOG</div>
      <div className="dialog-portrait hrz">
        <img style={{ margin: '2px' }} src={url}></img>
      </div>
      {lines.map(({ text, color, cb }) => {
        return (
          <div
            className={`dialog-line${cb ? ' dialog-line-choice' : ''}`}
            style={{
              color: color ? color : '',
            }}
            onclick={() => {
              if (cb) {
                cb();
              }
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};
