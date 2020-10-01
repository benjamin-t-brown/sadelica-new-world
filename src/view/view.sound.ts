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
  doorOpen: 'snd/door-open.mp3',
};

const G_view_loadSounds = async () => {
  const promises: Promise<void>[] = [];
  for (let i in view_sounds) {
    const url = view_sounds[i];
    if (typeof url === 'string') {
      promises.push(
        new Promise((resolve, reject) => {
          const fullUrl = 'res/' + url;
          const sound = new Audio(fullUrl);
          sound.autoplay = false;
          sound.oncanplay = () => {
            sound.oncanplay = null;
            sound.currentTime = 99999999999;
            const soundDuration = sound.currentTime;
            sound.currentTime = 0;
            sound.onended = function () {
              sound.pause();
              sound.currentTime = 0;
            };
            view_sounds[i] = {
              sound,
              audio: sound,
              soundDuration,
            };
            resolve();
          };
          sound.addEventListener('error', e => {
            console.error(e);
            reject(
              'Cannot load sound: name="' + i + '", url="' + fullUrl + '"'
            );
          });
          sound.src = fullUrl;
        })
      );
    }
  }
  await Promise.all(promises);
};

const cloneSound = function (soundObj) {
  const s = {
    ...soundObj,
    //soundDuration merged in from soundObj
    audio: soundObj.audio.cloneNode(),
    soundName: name,
    duration: 0,
    isPlaying: false,
    isPaused: false,
  };
  s.sound = s.audio;
  return s;
};

const G_view_playSound = (soundName: string) => {
  // if (!G_model_isSoundEnabled()) {
  //   return;
  // }

  const soundObj = view_sounds[soundName] as any;
  if (!soundObj) {
    console.error('No sound exists with name: ' + soundName);
    return;
  }
  const soundVolume = 0.3;

  if (soundObj.length) {
    G_view_setVolume(soundVolume);
    zzfx(...soundObj);
  } else {
    const soundCloned = cloneSound(soundObj);
    const { sound } = soundCloned;
    sound.volume = soundVolume;
    sound.play();
    soundObj.lastStartTimestamp = performance.now();
    soundObj.isPlaying = true;
  }
};
