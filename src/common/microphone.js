import {
  AUTO_SENSITIVITY,
  getAudioConstraints,
  getVoiceSettings,
  requestUserMedia,
} from "common/voiceSettings";

export const MIN_DB = -100;

// Opens the microphone through a gain stage so the input volume can change
// while it is in use. `stream` is the processed audio that gets sent and
// `getLevel()` returns its loudness in dBFS (MIN_DB..0).
export const openMicrophone = async settings => {
  const rawStream = await requestUserMedia({
    audio: getAudioConstraints(settings),
    video: false,
  });

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextClass();
  const source = context.createMediaStreamSource(rawStream);
  const gain = context.createGain();
  const analyser = context.createAnalyser();
  const destination = context.createMediaStreamDestination();

  analyser.fftSize = 1024;
  gain.gain.value = settings.inputVolume / 100;
  source.connect(gain);
  gain.connect(analyser);
  gain.connect(destination);
  context.resume().catch(() => {});

  const samples = new Float32Array(analyser.fftSize);
  let stopped = false;

  return {
    stream: destination.stream,
    rawStream,
    getLevel: () => {
      // A closed AudioContext keeps returning its last samples forever, which
      // would freeze the level meter on a stale value
      if (stopped) return MIN_DB;
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
      const rms = Math.sqrt(sum / samples.length);
      return rms > 0 ? Math.max(MIN_DB, 20 * Math.log10(rms)) : MIN_DB;
    },
    setVolume: volume => {
      gain.gain.value = volume / 100;
    },
    setTransmitting: enabled => {
      destination.stream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    },
    stop: () => {
      stopped = true;
      rawStream.getTracks().forEach(track => track.stop());
      destination.stream.getTracks().forEach(track => track.stop());
      context.close().catch(() => {});
    },
  };
};

export const getSensitivityThreshold = (s = getVoiceSettings()) =>
  s.autoSensitivity ? AUTO_SENSITIVITY : s.sensitivity;

// Keeps transmitting this long after the voice drops below the threshold,
// so the ends of words are not cut off
const VOICE_RELEASE_MS = 400;

// While push-to-talk is held, only this much sound counts as actually talking
const PUSH_TO_TALK_VOICE_DB = -60;

// Decides when the microphone actually transmits: while the voice is above the
// sensitivity threshold, or while the push-to-talk key is held. Push-to-talk
// only sees key presses while this browser tab has focus.
// `onSpeakingChange(true|false)` fires when we start or stop talking.
export const attachInputMode = (mic, onSpeakingChange = () => {}) => {
  let lastVoiceAt = 0;
  let pushToTalkActive = false;
  let releaseTimer = null;
  let speaking = false;

  const report = value => {
    if (value === speaking) return;
    speaking = value;
    onSpeakingChange(value);
  };

  const tick = setInterval(() => {
    const s = getVoiceSettings();
    // Muted or deafened with the user panel buttons: send nothing
    if (s.selfMute || s.selfDeaf) {
      mic.setTransmitting(false);
      lastVoiceAt = 0;
      report(false);
      return;
    }
    const now = Date.now();
    const level = mic.getLevel();
    if (s.inputMode === "pushToTalk") {
      mic.setTransmitting(pushToTalkActive);
      if (pushToTalkActive && level >= PUSH_TO_TALK_VOICE_DB) lastVoiceAt = now;
      report(pushToTalkActive && now - lastVoiceAt < VOICE_RELEASE_MS);
      return;
    }
    if (level >= getSensitivityThreshold(s)) lastVoiceAt = now;
    const transmitting = now - lastVoiceAt < VOICE_RELEASE_MS;
    mic.setTransmitting(transmitting);
    report(transmitting);
  }, 50);

  const isPushToTalkKey = event => {
    const key = getVoiceSettings().pushToTalkKey;
    return !!key && event.code === key.code;
  };

  const handleKeyDown = event => {
    if (!isPushToTalkKey(event)) return;
    clearTimeout(releaseTimer);
    pushToTalkActive = true;
  };

  const handleKeyUp = event => {
    if (!isPushToTalkKey(event)) return;
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(() => {
      pushToTalkActive = false;
    }, getVoiceSettings().pushToTalkDelay);
  };

  const handleBlur = () => {
    clearTimeout(releaseTimer);
    pushToTalkActive = false;
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", handleBlur);

  return () => {
    clearInterval(tick);
    clearTimeout(releaseTimer);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", handleBlur);
    report(false);
  };
};
