/*
global
zzfx
zzfxV
G_model_isSoundEnabled
*/

const G_view_setVolume = (v: number) => (zzfxV = v); //eslint-disable-line no-global-assign
const view_sounds = {
  talk: [
    0.6,
    0,
    326,
    0.08,
    ,
    0.07,
    1,
    0.25,
    ,
    33,
    -111,
    0.01,
    ,
    ,
    2.9,
    0.8,
    0.06,
    0.22,
    0.05,
    0.01,
  ],
  talkEnd: [
    0.6,
    0,
    326,
    0.08,
    ,
    0.07,
    1,
    0.15,
    0.1,
    33,
    -111,
    0.01,
    ,
    ,
    2.9,
    0.6,
    0.05,
    0.52,
    0.05,
    0.01,
  ],
};
const G_view_playSound = (soundName: string) => {
  // if (!G_model_isSoundEnabled()) {
  //   return;
  // }

  const soundArray = view_sounds[soundName] as any;
  const soundVolume = 0.3;

  G_view_setVolume(soundVolume);
  zzfx(...soundArray);
};
