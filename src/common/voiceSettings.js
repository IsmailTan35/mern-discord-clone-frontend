import { useEffect, useState } from "react";

const STORAGE_KEY = "voiceSettings";

export const defaultVoiceSettings = {
  inputDeviceId: "default",
  outputDeviceId: "default",
  videoDeviceId: "default",
  inputVolume: 100, // 0-100 %
  outputVolume: 100, // 0-200 %
  inputMode: "voiceActivity", // "voiceActivity" | "pushToTalk"
  pushToTalkKey: null, // { code, label }
  pushToTalkDelay: 20, // ms
  autoSensitivity: true,
  sensitivity: -60, // dBFS
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  selfMute: false, // the microphone button in the user panel
  selfDeaf: false, // the headphones button; also keeps the microphone off
};

// Threshold used while "determine input sensitivity automatically" is on
export const AUTO_SENSITIVITY = -55;

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultVoiceSettings, ...(saved || {}) };
  } catch (error) {
    return { ...defaultVoiceSettings };
  }
};

let settings = load();
const listeners = new Set();

const commit = next => {
  settings = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    // Storage can be unavailable (private mode); settings still apply for this session
  }
  listeners.forEach(listener => listener(settings));
};

export const getVoiceSettings = () => settings;

export const updateVoiceSettings = patch => commit({ ...settings, ...patch });

// Resetting the voice settings does not touch the mute/deafen buttons
export const resetVoiceSettings = () =>
  commit({
    ...defaultVoiceSettings,
    selfMute: settings.selfMute,
    selfDeaf: settings.selfDeaf,
  });

export const isSelfMuted = (s = settings) => s.selfMute || s.selfDeaf;

// Like Discord, un-muting while deafened also undeafens
export const toggleSelfMute = () =>
  settings.selfDeaf
    ? updateVoiceSettings({ selfMute: false, selfDeaf: false })
    : updateVoiceSettings({ selfMute: !settings.selfMute });

// Undeafening brings the microphone back to how it was before
export const toggleSelfDeaf = () =>
  updateVoiceSettings({ selfDeaf: !settings.selfDeaf });

export const subscribeVoiceSettings = listener => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useVoiceSettings = () => {
  const [value, setValue] = useState(getVoiceSettings);
  useEffect(() => {
    setValue(getVoiceSettings());
    return subscribeVoiceSettings(setValue);
  }, []);
  return value;
};

// `exact` is required: Chrome treats an `ideal` deviceId as a mere preference
// and keeps opening the system default device
const pickDevice = deviceId =>
  deviceId && deviceId !== "default" ? { deviceId: { exact: deviceId } } : {};

const withoutDevice = constraints => {
  if (!constraints || typeof constraints !== "object") return constraints;
  const { deviceId, ...rest } = constraints;
  return rest;
};

// getUserMedia that falls back to the system default when the saved device
// has been unplugged instead of failing the whole call
export const requestUserMedia = async constraints => {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    const deviceMissing =
      error.name === "OverconstrainedError" || error.name === "NotFoundError";
    const pinned =
      (constraints.audio && constraints.audio.deviceId) ||
      (constraints.video && constraints.video.deviceId);
    if (!deviceMissing || !pinned) throw error;
    return navigator.mediaDevices.getUserMedia({
      audio: withoutDevice(constraints.audio),
      video: withoutDevice(constraints.video),
    });
  }
};

export const getAudioConstraints = (s = settings) => ({
  ...pickDevice(s.inputDeviceId),
  // Only cancel the voices of the call. Measured on Windows/Chrome: "all"
  // (cancel everything the system plays) mixes system audio such as a video in
  // another tab into a silent microphone. Browsers without echo cancellation
  // modes read the string as `true`.
  echoCancellation: s.echoCancellation ? "remote-only" : false,
  noiseSuppression: s.noiseSuppression,
  autoGainControl: s.autoGainControl,
});

export const getVideoConstraints = (s = settings) => ({
  ...pickDevice(s.videoDeviceId),
  width: { ideal: 1280 },
  height: { ideal: 720 },
});

export const canChooseOutputDevice = () =>
  typeof HTMLMediaElement !== "undefined" &&
  "setSinkId" in HTMLMediaElement.prototype;

// Media elements top out at 100%, so the upper half of the 200% slider is
// capped here. Boosting through Web Audio would bypass the browser's echo
// cancellation for remote voices.
// Deafened, every incoming sound is silenced. `muted` keeps an element silent
// anyway (e.g. our own stream preview); `ignoreDeafen` is for the mic test.
export const applyOutputSettings = (
  element,
  s = settings,
  { muted = false, ignoreDeafen = false } = {}
) => {
  if (!element) return;
  element.volume = Math.min(s.outputVolume, 100) / 100;
  element.muted = muted || (!ignoreDeafen && !!s.selfDeaf);
  if (canChooseOutputDevice()) {
    element
      .setSinkId(s.outputDeviceId === "default" ? "" : s.outputDeviceId)
      .catch(() => {});
  }
};
