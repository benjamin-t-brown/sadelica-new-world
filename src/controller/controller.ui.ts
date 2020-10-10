/*
global
G_model_getAlertProps
G_view_renderUi
G_view_playSound
*/

const G_controller_showAlert = (props: {
  text: string;
  portrait: string;
  isSmallPortrait?: boolean;
  title?: string;
  soundName?: string;
  cb?: () => void;
}) => {
  const alertProps = G_model_getAlertProps();
  alertProps.visible = true;
  alertProps.text = props.text;
  alertProps.portrait = props.portrait;
  alertProps.title = props.title || 'ALERT';
  alertProps.cb = props.cb;
  alertProps.isSmallPortrait = props.isSmallPortrait || false;
  if (props.soundName !== undefined) {
    if (props.soundName) {
      G_view_playSound(props.soundName);
    }
  } else {
    G_view_playSound('alert');
  }
  G_view_renderUi();
};

const G_controller_hideAlert = () => {
  const alertProps = G_model_getAlertProps();
  alertProps.visible = false;
  alertProps.cb = undefined;
  G_view_renderUi();
};
