/*
global
G_model_getAlertProps
G_controller_hideAlert
G_view_cachePortraitIconDataUrl
G_view_playSound
G_view_fireEvent
*/

let view_alertHandleKeyDownAdded = false;
const view_alertHandleKeyDown = (ev: KeyboardEvent) => {
  if (ev.which === 13 || ev.which === 32) {
    const elem = document.getElementById('alert-confirm-btn');
    if (elem) {
      elem.className += ' btn-active';
      G_view_playSound('btn');
      setTimeout(() => {
        G_controller_hideAlert();
      }, 100);
    }
  }
};

const G_view_Alert = (): SuperfineElement => {
  const props = G_model_getAlertProps();
  const visible = props.visible;
  const text = props.text.split('\n');
  let portraitSprite = props.portrait;

  let scale = 2;
  let spriteSize = 32;
  if (!portraitSprite) {
    portraitSprite = 'actors1_0';
    scale = 3;
    spriteSize = 16;
  }
  let url = G_view_cachePortraitIconDataUrl(portraitSprite, spriteSize, scale);

  if (visible) {
    if (!view_alertHandleKeyDownAdded) {
      view_alertHandleKeyDownAdded = true;
      window.addEventListener('keydown', view_alertHandleKeyDown);
    }
  } else {
    view_alertHandleKeyDownAdded = false;
    window.removeEventListener('keydown', view_alertHandleKeyDown);

    // yes we all know this is very very dumb
    const elem = document.getElementById('alert-confirm-btn');
    if (elem) {
      elem.className = 'btn';
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
        display: visible ? 'flex' : 'none',
        'justify-content': 'center',
        'align-items': 'center',
      }}
    >
      <div
        style={{
          width: '400px',
          background: '#493C2B',
          border: '4px outset #9d9d9d',
        }}
      >
        <div className="title">{props.title || 'ALERT'}</div>
        <div
          style={{
            display: 'flex',
            'justify-content': 'space-between',
          }}
        >
          <div
            style={{
              width: '64px',
            }}
          >
            <img
              style={{
                background: '#CCCCCC',
                'margin-left': '16px',
                'margin-top': '16px',
              }}
              src={url}
            ></img>
          </div>
          <div
            style={{
              width: 'calc(100% - 64px - 16px - 16px - 16px - 16px)',
              border: '2px inset',
              background: '#656d71',
              padding: '8px',
              margin: '16px',
              'min-height': '44px',
            }}
          >
            {text.map((t, i) => {
              return (
                <div style={{ 'margin-bottom': '7px' }} key={i}>
                  {t}
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            'justify-content': 'flex-end',
          }}
        >
          <div
            className="btn"
            id="alert-confirm-btn"
            onclick={() => {
              G_view_playSound('btn');
              setTimeout(() => {
                G_controller_hideAlert();
              }, 100);
            }}
            style={{
              'min-width': '80px',
              background: '#656d71',
              margin: '4px 16px',
            }}
          >
            OK
          </div>
        </div>
      </div>
    </div>
  );
};
