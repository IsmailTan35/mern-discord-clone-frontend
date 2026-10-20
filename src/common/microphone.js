import {
  AUTO_SENSITIVITY,
  getAudioConstraints,
  getVoiceSettings,
  requestUserMedia,
} from "common/voiceSettings";

export const MIN_DB = -100;

// With noise suppression on, only the range of the human voice is kept: below
// it are rumble, mains hum (50 Hz) and fan noise, above it hiss. Voices reach
// down to ~85 Hz (deep male fundamentals) and their "s" / "ş" sounds up to
// ~7 kHz; a telephone-like 300-3400 Hz band would sound muffled.
export const VOICE_BAND = { low: 100, high: 7000 };

// Two biquads with these Q values make a 4th-order Butterworth filter
// (24 dB per octave, no bump at the cut-off)
const BUTTERWORTH_Q = [0.5412, 1.3066];

export const createVoiceBandFilter = context => {
  const stages = [
    ...BUTTERWORTH_Q.map(q => ["highpass", VOICE_BAND.low, q]),
    ...BUTTERWORTH_Q.map(q => ["lowpass", VOICE_BAND.high, q]),
  ].map(([type, frequency, q]) => {
    const filter = context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    return filter;
  });
  stages.reduce((previous, next) => {
    previous.connect(next);
    return next;
  });
  return { input: stages[0], output: stages[stages.length - 1], stages };
};

// RNNoise, a small neural network trained to tell speech from noise. Unlike
// the browser's own noise suppression, which only lowers steady noise such as
// a fan, it also removes keyboard clicks, background music and the like.
// Its files are served from public/noise-suppression/rnnoise.
const RNNOISE_URL = `${process.env.PUBLIC_URL || ""}/noise-suppression/rnnoise`;
const RNNOISE_PROCESSOR = "@sapphi-red/web-noise-suppressor/rnnoise";
// RNNoise works on 48 kHz audio only
const RNNOISE_SAMPLE_RATE = 48000;

// A tiny module using a WebAssembly SIMD instruction; the faster SIMD build
// of RNNoise is loaded where it validates
const SIMD_PROBE = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1,
  8, 0, 65, 0, 253, 15, 253, 98, 11,
]);

let rnnoiseBinary = null;
const loadRnnoiseBinary = () => {
  if (!rnnoiseBinary) {
    const file = WebAssembly.validate(SIMD_PROBE) ? "rnnoise_simd.wasm" : "rnnoise.wasm";
    rnnoiseBinary = fetch(`${RNNOISE_URL}/${file}`)
      .then(response => {
        if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
        return response.arrayBuffer();
      })
      .catch(error => {
        // Try again next time the microphone opens
        rnnoiseBinary = null;
        throw error;
      });
  }
  return rnnoiseBinary;
};

// Resolves to the RNNoise node, or null where it can not run (no AudioWorklet,
// e.g. outside https, or the files failed to load)
const createRnnoise = async context => {
  if (!context.audioWorklet || context.sampleRate !== RNNOISE_SAMPLE_RATE) return null;
  try {
    const [wasmBinary] = await Promise.all([
      loadRnnoiseBinary(),
      context.audioWorklet.addModule(`${RNNOISE_URL}/workletProcessor.js`),
    ]);
    return new AudioWorkletNode(context, RNNOISE_PROCESSOR, {
      processorOptions: { wasmBinary, maxChannels: 1 },
      // A stereo microphone is mixed down to the one channel that is sent
      channelCount: 1,
      channelCountMode: "explicit",
    });
  } catch (error) {
    console.error("RNNoise could not start", error);
    return null;
  }
};

const createAudioContext = noiseSuppression => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (noiseSuppression) {
    try {
      return new AudioContextClass({ sampleRate: RNNOISE_SAMPLE_RATE });
    } catch (error) {}
  }
  return new AudioContextClass();
};

// Opens the microphone through a gain stage so the input volume can change
// while it is in use. With noise suppression on, the sound then goes through
// RNNoise and the voice band filter. `stream` is the processed audio that gets
// sent and `getLevel()` returns its loudness in dBFS (MIN_DB..0).
export const openMicrophone = async settings => {
  const rawStream = await requestUserMedia({
    audio: getAudioConstraints(settings),
    video: false,
  });

  const context = createAudioContext(settings.noiseSuppression);
  const source = context.createMediaStreamSource(rawStream);
  const gain = context.createGain();
  const analyser = context.createAnalyser();
  const destination = context.createMediaStreamDestination();

  analyser.fftSize = 1024;
  gain.gain.value = settings.inputVolume / 100;
  source.connect(gain);
  // The level meter and the voice activity check hear the same cleaned sound
  // that is sent, so noise does not open the microphone
  let output = gain;
  // "rnnoise", "browser" (only the browser's own, if RNNoise can not run) or "off"
  let suppression = "off";
  if (settings.noiseSuppression) {
    const rnnoise = await createRnnoise(context);
    suppression = rnnoise ? "rnnoise" : "browser";
    if (rnnoise) {
      output.connect(rnnoise);
      output = rnnoise;
    }
    const band = createVoiceBandFilter(context);
    output.connect(band.input);
    output = band.output;
  }
  output.connect(analyser);
  output.connect(destination);
  context.resume().catch(() => {});

  const samples = new Float32Array(analyser.fftSize);
  let stopped = false;

  return {
    stream: destination.stream,
    rawStream,
    suppression,
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
// `ignoreSelfMute` is for the settings mic test, which should work while muted.
export const attachInputMode = (
  mic,
  onSpeakingChange = () => {},
  { ignoreSelfMute = false } = {}
) => {
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
    if (!ignoreSelfMute && (s.selfMute || s.selfDeaf)) {
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
