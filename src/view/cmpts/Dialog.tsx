/*
global
G_model_getDialogLines
G_model_getDialogVisible
*/

const G_view_Dialog = (): SuperfineElement => {
  const lines = G_model_getDialogLines();
  const visible = G_model_getDialogVisible();

  return (
    <div
      style={{
        // padding: '16px',
        height: visible ? '512px' : '0px',
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
