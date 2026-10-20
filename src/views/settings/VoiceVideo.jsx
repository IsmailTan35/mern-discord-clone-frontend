import React, { useEffect, useRef, useState } from "react";
import {
  applyOutputSettings,
  canChooseOutputDevice,
  getVideoConstraints,
  getVoiceSettings,
  requestUserMedia,
  resetVoiceSettings,
  subscribeVoiceSettings,
  updateVoiceSettings,
} from "common/voiceSettings";
import {
  attachInputMode,
  getSensitivityThreshold,
  MIN_DB,
  openMicrophone,
} from "common/microphone";

import { defaultOption, useMediaDevices, watchInputDevice } from "common/mediaDevices";
import {
  CameraIcon,
  HeadphonesIcon,
  MicrophoneIcon,
} from "components/VoiceIcons";

import "assets/css/voicevideo.css";

const NOTCH_COUNT = 50;

// Devices that record what the computer plays instead of a microphone
const LOOPBACK_DEVICE =
  /stereo mix|stereo karışım|what u hear|wave out|loopback|cable output|voicemeeter out|monitor of/i;

const toPercent = level => Math.min(Math.max(level - MIN_DB, 0), -MIN_DB);

// ---------------------------------------------------------------- hooks

const useVoiceSettings = () => {
  const [settings, setSettings] = useState(getVoiceSettings);
  useEffect(() => subscribeVoiceSettings(setSettings), []);
  return settings;
};

// Like Discord, the microphone stays open while this page is visible: it feeds
// the level meters and the mic test
const useMicrophone = settings => {
  const [mic, setMic] = useState(null);
  const [status, setStatus] = useState("pending"); // pending | ready | denied | failed
  // Bumped when the open device goes away, to open the microphone again
  const [reopen, setReopen] = useState(0);
  const { inputDeviceId, echoCancellation, noiseSuppression, autoGainControl } =
    settings;

  useEffect(() => {
    let cancelled = false;
    let opened = null;
    let unwatch = () => {};
    // The previous microphone is being closed; never show its stale level
    setMic(null);
    openMicrophone(getVoiceSettings())
      .then(result => {
        if (cancelled) {
          result.stop();
          return;
        }
        opened = result;
        unwatch = watchInputDevice(
          result.rawStream.getAudioTracks()[0],
          () => getVoiceSettings().inputDeviceId,
          () => setReopen(count => count + 1)
        );
        setMic(result);
        setStatus("ready");
      })
      .catch(error => {
        if (cancelled) return;
        setStatus(
          error.name === "NotAllowedError" || error.name === "SecurityError"
            ? "denied"
            : "failed"
        );
      });
    return () => {
      cancelled = true;
      unwatch();
      if (opened) opened.stop();
    };
  }, [inputDeviceId, echoCancellation, noiseSuppression, autoGainControl, reopen]);

  useEffect(() => {
    if (mic) mic.setVolume(settings.inputVolume);
  }, [mic, settings.inputVolume]);

  return { mic, status };
};

const useLevel = (mic, active = true) => {
  const [level, setLevel] = useState(MIN_DB);
  useEffect(() => {
    if (!mic || !active) {
      setLevel(MIN_DB);
      return;
    }
    const id = setInterval(() => setLevel(mic.getLevel()), 50);
    return () => clearInterval(id);
  }, [mic, active]);
  return level;
};

// Escape closes the innermost popup instead of the whole settings screen
const useEscape = (active, onEscape) => {
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = event => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onEscape();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [active]);
};

// ---------------------------------------------------------------- controls

const ChevronIcon = () => (
  <svg className="vv-select-chevron" width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M16.59 8.59003L12 13.17L7.41 8.59003L6 10L12 16L18 10L16.59 8.59003Z"
    />
  </svg>
);

// The selected item's mark: a white tick in a filled circle
const SelectedMark = () => (
  <svg className="vv-select-check" width="20" height="20" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path
      fill="#fff"
      d="M10.4 15.6L7 12.2l1.4-1.4 2 2 5.2-5.2 1.4 1.4-6.6 6.6z"
    />
  </svg>
);

// Device lists: an icon, the device name and, below it, its endpoint name
const Select = ({ value, options, onChange, disabled, icon: Icon }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(option => option.value === value) || options[0];

  useEscape(open, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = event => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  return (
    <div
      ref={ref}
      className={`vv-select${open ? " open" : ""}${disabled ? " disabled" : ""}`}
    >
      <button
        type="button"
        className="vv-select-value"
        disabled={disabled}
        onClick={() => setOpen(prev => !prev)}
      >
        {Icon && <Icon />}
        <span className="vv-select-label">
          {selected && (selected.title || selected.label)}
        </span>
        <ChevronIcon />
      </button>
      {open && (
        <div className="vv-select-popout" role="listbox">
          {options.map(option => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              title={option.label}
              className={`vv-select-option${
                option.value === value ? " selected" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {Icon && <Icon />}
              <span className="vv-select-text">
                <span className="vv-select-label">
                  {option.title || option.label}
                </span>
                {option.subtitle && (
                  <span className="vv-select-subtitle">{option.subtitle}</span>
                )}
              </span>
              {option.value === value && <SelectedMark />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Slider = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  fill = true,
  children,
}) => {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const percent = ((value - min) / (max - min)) * 100;

  const valueAt = clientX => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    return Math.round((min + ratio * (max - min)) / step) * step;
  };

  const handlePointerDown = event => {
    event.preventDefault();
    if (trackRef.current.setPointerCapture) {
      trackRef.current.setPointerCapture(event.pointerId);
    }
    setDragging(true);
    onChange(valueAt(event.clientX));
  };

  const handlePointerMove = event => {
    if (dragging) onChange(valueAt(event.clientX));
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handleKeyDown = event => {
    const direction = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
    }[event.key];
    if (!direction) return;
    event.preventDefault();
    onChange(Math.min(max, Math.max(min, value + direction * step)));
  };

  return (
    <div
      className={`vv-slider${dragging ? " dragging" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        ref={trackRef}
        className="vv-slider-track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="vv-slider-bar">
          {children}
          {fill && (
            <div className="vv-slider-fill" style={{ width: `${percent}%` }} />
          )}
        </div>
        <div
          className="vv-slider-grabber"
          style={{ left: `${percent}%` }}
          role="slider"
          tabIndex={0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={handleKeyDown}
        >
          {(dragging || hovered) && (
            <div className="vv-slider-tooltip">{format(value)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className={`vv-switch${checked ? " checked" : ""}`}
    onClick={() => onChange(!checked)}
  >
    <span className="vv-switch-knob">
      <svg viewBox="0 0 20 20" fill="none">
        {checked ? (
          <>
            <path
              fill="currentColor"
              d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"
            />
            <path
              fill="currentColor"
              d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"
            />
          </>
        ) : (
          <>
            <path
              fill="currentColor"
              d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"
            />
            <path
              fill="currentColor"
              d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"
            />
          </>
        )}
      </svg>
    </span>
  </button>
);

const SwitchRow = ({ title, note, checked, onChange, divider = true }) => (
  <div className="vv-switch-row">
    <div className="vv-switch-row-main">
      <div className="vv-switch-row-title">{title}</div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
    {note && <div className="vv-note">{note}</div>}
    {divider && <div className="vv-divider-small" />}
  </div>
);

const RadioGroup = ({ value, options, onChange }) => (
  <div className="vv-radio-group" role="radiogroup">
    {options.map(option => {
      const selected = option.value === value;
      return (
        <div
          key={option.value}
          role="radio"
          aria-checked={selected}
          tabIndex={0}
          className={`vv-radio${selected ? " selected" : ""}`}
          onClick={() => onChange(option.value)}
          onKeyDown={event => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onChange(option.value);
            }
          }}
        >
          <svg className="vv-radio-icon" width="24" height="24" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              fill="currentColor"
              d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            />
            {selected && <circle cx="12" cy="12" r="5" fill="currentColor" />}
          </svg>
          <div className="vv-radio-label">{option.label}</div>
        </div>
      );
    })}
  </div>
);

const KEY_NAMES = {
  " ": "SPACE",
  Control: "CTRL",
  Meta: "META",
  Escape: "ESC",
};

const KeybindRecorder = ({ value, onChange }) => {
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const handleKeyDown = event => {
      event.preventDefault();
      event.stopPropagation();
      if (event.key !== "Escape") {
        onChange({
          code: event.code,
          label: KEY_NAMES[event.key] || event.key.toUpperCase(),
        });
      }
      setRecording(false);
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [recording]);

  return (
    <div className={`vv-keybind${recording ? " recording" : ""}`}>
      <div className={`vv-keybind-value${value || recording ? "" : " empty"}`}>
        {recording
          ? "Bir tuşa bas..."
          : value
          ? value.label
          : "Kısayol Tuşu Ayarlanmadı"}
      </div>
      <button
        type="button"
        className={`vv-button vv-button-small ${
          recording ? "vv-button-red" : "vv-button-grey"
        }`}
        onClick={() => setRecording(prev => !prev)}
      >
        {recording
          ? "Kaydı Durdur"
          : value
          ? "Kısayol Tuşunu Düzenle"
          : "Kısayol Tuşu Kaydet"}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------- sections

const MicTest = ({ mic, settings, disabled }) => {
  const [testing, setTesting] = useState(false);
  const level = useLevel(mic, testing);
  const audioRef = useRef(null);
  const activeNotches = Math.round((toPercent(level) / 100) * NOTCH_COUNT);

  useEffect(() => {
    if (disabled) setTesting(false);
  }, [disabled]);

  // Plays back what the others would hear, like Discord's test: the input
  // sensitivity threshold and push-to-talk gate it exactly as in a call
  useEffect(() => {
    if (!testing || !mic) return;
    const detachInputMode = attachInputMode(mic, undefined, {
      ignoreSelfMute: true,
    });
    const audio = new Audio();
    audio.srcObject = mic.stream;
    // The test is meant to be heard, even while deafened
    applyOutputSettings(audio, getVoiceSettings(), { ignoreDeafen: true });
    audio.play().catch(() => {});
    audioRef.current = audio;
    return () => {
      detachInputMode();
      mic.setTransmitting(true);
      audio.pause();
      audio.srcObject = null;
      audioRef.current = null;
    };
  }, [testing, mic]);

  useEffect(() => {
    applyOutputSettings(audioRef.current, settings, { ignoreDeafen: true });
  }, [settings.outputVolume, settings.outputDeviceId]);

  return (
    <div className="vv-mic-test">
      <button
        type="button"
        className="vv-button vv-button-brand"
        disabled={disabled}
        onClick={() => setTesting(prev => !prev)}
      >
        {testing ? "Testi Durdur" : "Hadi Kontrol Edelim"}
      </button>
      <div className="vv-notches">
        {Array.from({ length: NOTCH_COUNT }, (_, index) => (
          <div
            key={index}
            className={`vv-notch${index < activeNotches ? " active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

const InputSensitivity = ({ mic, settings }) => {
  const level = useLevel(mic);
  const percent = toPercent(level);
  const threshold = getSensitivityThreshold(settings);
  const thresholdPercent = toPercent(threshold);
  const speaking = level >= threshold;

  if (settings.autoSensitivity) {
    return (
      <div className="vv-meter">
        <div
          className={`vv-meter-fill${speaking ? " speaking" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  }

  // Below the threshold (orange) is not sent, above it (green) is
  const zones = (
    <>
      <div
        className="vv-sensitivity-zone below"
        style={{ left: 0, width: `${thresholdPercent}%` }}
      />
      <div
        className="vv-sensitivity-zone above"
        style={{ left: `${thresholdPercent}%`, right: 0 }}
      />
    </>
  );

  return (
    <Slider
      value={settings.sensitivity}
      min={-100}
      max={0}
      fill={false}
      format={value => `${value}dB`}
      onChange={value => updateVoiceSettings({ sensitivity: value })}
    >
      <div className="vv-sensitivity-zones dim">{zones}</div>
      <div
        className="vv-sensitivity-zones"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        {zones}
      </div>
    </Slider>
  );
};

const CameraPreview = ({ settings, onAccessGranted }) => {
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!testing) return;
    let cancelled = false;
    let stream = null;
    requestUserMedia({ video: getVideoConstraints(settings), audio: false })
      .then(result => {
        if (cancelled) {
          result.getTracks().forEach(track => track.stop());
          return;
        }
        stream = result;
        if (videoRef.current) videoRef.current.srcObject = result;
        setError(null);
        onAccessGranted();
      })
      .catch(() => {
        if (cancelled) return;
        setError("Kameraya erişilemedi. Tarayıcı izinlerini ve kameranın başka bir uygulamada açık olmadığını kontrol et.");
        setTesting(false);
      });
    return () => {
      cancelled = true;
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [testing, settings.videoDeviceId]);

  return (
    <>
      <div className={`vv-preview${testing ? " active" : ""}`}>
        <video
          ref={videoRef}
          className="vv-preview-video"
          autoPlay
          playsInline
          muted
        />
        {testing ? (
          <button
            type="button"
            className="vv-button vv-button-grey vv-button-small vv-preview-stop"
            onClick={() => setTesting(false)}
          >
            Videoyu Durdur
          </button>
        ) : (
          <div className="vv-preview-empty">
            <svg width="72" height="72" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.526 8.149C21.231 7.966 20.862 7.951 20.553 8.105L18 9.382V7C18 5.897 17.103 5 16 5H4C2.897 5 2 5.897 2 7V17C2 18.104 2.897 19 4 19H16C17.103 19 18 18.104 18 17V14.618L20.553 15.894C20.694 15.965 20.847 16 21 16C21.183 16 21.365 15.949 21.526 15.851C21.82 15.668 22 15.347 22 15V9C22 8.653 21.82 8.332 21.526 8.149Z"
              />
            </svg>
            <button
              type="button"
              className="vv-button vv-button-brand"
              onClick={() => setTesting(true)}
            >
              Videoyu Test Et
            </button>
          </div>
        )}
      </div>
      {error && <div className="vv-error">{error}</div>}
    </>
  );
};

const ResetModal = ({ onClose }) => {
  useEscape(true, onClose);

  return (
    <div className="vv-modal-backdrop" onMouseDown={onClose}>
      <div className="vv-modal" onMouseDown={event => event.stopPropagation()}>
        <div className="vv-modal-content">
          <h3 className="vv-modal-title">Ses Ayarlarını Sıfırla</h3>
          <div className="vv-modal-text">
            Ses ayarlarını sıfırlamak istediğinden emin misin? Tüm ses ve görüntü
            ayarların varsayılan değerlerine döner.
          </div>
        </div>
        <div className="vv-modal-footer">
          <button
            type="button"
            className="vv-button vv-button-red"
            onClick={() => {
              resetVoiceSettings();
              onClose();
            }}
          >
            Tamam
          </button>
          <button
            type="button"
            className="vv-button vv-button-link"
            onClick={onClose}
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- page

const VoiceVideo = () => {
  const settings = useVoiceSettings();
  const { mic, status } = useMicrophone(settings);
  const [cameraAccess, setCameraAccess] = useState(0);
  const devices = useMediaDevices(`${status}-${cameraAccess}`);
  const [confirmReset, setConfirmReset] = useState(false);
  const outputSupported = canChooseOutputDevice();
  const pushToTalk = settings.inputMode === "pushToTalk";
  // The label of the device actually opened, which also resolves "Varsayılan"
  const openedInput = mic ? mic.rawStream.getAudioTracks()[0] : null;
  const recordsSystemAudio =
    !!openedInput && LOOPBACK_DEVICE.test(openedInput.label);

  return (
    <div className="vv">
      <h2 className="vv-title">Ses ve Görüntü</h2>

      <h5 className="vv-heading">Ses Ayarları</h5>
      <div className="vv-columns">
        <div className="vv-column">
          <h5 className="vv-heading vv-heading-small">Giriş Cihazı</h5>
          <Select
            value={settings.inputDeviceId}
            options={[defaultOption(devices.defaults.audioinput), ...devices.audioinput]}
            icon={MicrophoneIcon}
            onChange={value => updateVoiceSettings({ inputDeviceId: value })}
          />
        </div>
        <div className="vv-column">
          <h5 className="vv-heading vv-heading-small">Çıkış Cihazı</h5>
          <Select
            value={outputSupported ? settings.outputDeviceId : "default"}
            options={[
              defaultOption(outputSupported && devices.defaults.audiooutput),
              ...(outputSupported ? devices.audiooutput : []),
            ]}
            disabled={!outputSupported}
            icon={HeadphonesIcon}
            onChange={value => updateVoiceSettings({ outputDeviceId: value })}
          />
        </div>
      </div>

      <div className="vv-columns">
        <div className="vv-column">
          <h5 className="vv-heading vv-heading-small">Giriş Ses Seviyesi</h5>
          <Slider
            value={settings.inputVolume}
            min={0}
            max={100}
            format={value => `${value}%`}
            onChange={value => updateVoiceSettings({ inputVolume: value })}
          />
        </div>
        <div className="vv-column">
          <h5 className="vv-heading vv-heading-small">Çıkış Ses Seviyesi</h5>
          <Slider
            value={settings.outputVolume}
            min={0}
            max={200}
            format={value => `${value}%`}
            onChange={value => updateVoiceSettings({ outputVolume: value })}
          />
        </div>
      </div>

      {!outputSupported && (
        <div className="vv-note vv-spaced">
          Bu tarayıcı çıkış cihazı seçmeyi desteklemiyor; sistemin varsayılan
          hoparlörü kullanılır.
        </div>
      )}

      {recordsSystemAudio && (
        <div className="vv-warning vv-spaced">
          Giriş cihazı olarak "{openedInput.label}" kullanılıyor. Bu bir mikrofon
          değil; bilgisayarda çalan her sesi (müzik, videolar) kaydeder. Giriş
          Cihazı menüsünden gerçek mikrofonunu seç.
        </div>
      )}

      {status === "failed" && (
        <div className="vv-warning vv-spaced">
          Seçilen giriş cihazı açılamadı. Bağlı olmayabilir ya da başka bir
          uygulama onu kullanıyor olabilir; başka bir cihaz seçmeyi dene.
        </div>
      )}

      {status === "denied" && (
        <div className="vv-warning vv-spaced">
          Mikrofonuna erişim izni yok. Adres çubuğundaki kilit simgesinden
          mikrofon iznini verip sayfayı yeniden açabilirsin.
        </div>
      )}

      <h5 className="vv-heading vv-heading-small">Mikrofon Testi</h5>
      <div className="vv-description">
        Mikrofonunla ilgili sorun mu yaşıyorsun? Bir test başlat ve saçma sapan
        bir şey söyle; sesini sana geri dinleteceğiz.
      </div>
      <MicTest mic={mic} settings={settings} disabled={status !== "ready"} />
      <div className="vv-help">
        Ses veya görüntüyle ilgili yardıma mı ihtiyacın var?{" "}
        <a
          href="https://support.discord.com/hc/tr"
          target="_blank"
          rel="noreferrer"
        >
          Sorun giderme rehberimize
        </a>{" "}
        göz at.
      </div>

      <div className="vv-divider" />

      <h5 className="vv-heading vv-heading-small">Giriş Modu</h5>
      <RadioGroup
        value={settings.inputMode}
        options={[
          { value: "voiceActivity", label: "Ses Etkinliği" },
          { value: "pushToTalk", label: "Bas-Konuş (Sınırlı)" },
        ]}
        onChange={value => updateVoiceSettings({ inputMode: value })}
      />

      {pushToTalk ? (
        <>
          <div className="vv-note vv-spaced">
            Bas-Konuş (Sınırlı) yalnızca bu tarayıcı sekmesi odaktayken çalışır.
          </div>
          <div className="vv-columns">
            <div className="vv-column">
              <h5 className="vv-heading vv-heading-small">Kısayol</h5>
              <KeybindRecorder
                value={settings.pushToTalkKey}
                onChange={value => updateVoiceSettings({ pushToTalkKey: value })}
              />
              {!settings.pushToTalkKey && (
                <div className="vv-error">
                  Bas-Konuş'u kullanmak için bir kısayol tuşu ayarla.
                </div>
              )}
            </div>
            <div className="vv-column">
              <h5 className="vv-heading vv-heading-small">
                Bas-Konuş Bırakma Gecikmesi
              </h5>
              <Slider
                value={settings.pushToTalkDelay}
                min={0}
                max={2000}
                step={10}
                format={value =>
                  value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${value}ms`
                }
                onChange={value =>
                  updateVoiceSettings({ pushToTalkDelay: value })
                }
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h5 className="vv-heading vv-heading-small vv-spaced-top">
            Giriş Hassasiyeti
          </h5>
          <SwitchRow
            title="Giriş hassasiyetini otomatik olarak belirle"
            checked={settings.autoSensitivity}
            divider={false}
            onChange={value => updateVoiceSettings({ autoSensitivity: value })}
          />
          <InputSensitivity mic={mic} settings={settings} />
        </>
      )}

      <div className="vv-divider" />

      <h5 className="vv-heading">Görüntü Ayarları</h5>
      <div className="vv-columns">
        <div className="vv-column">
          <h5 className="vv-heading vv-heading-small">Kamera</h5>
          <Select
            value={settings.videoDeviceId}
            options={[defaultOption(devices.defaults.videoinput), ...devices.videoinput]}
            icon={CameraIcon}
            onChange={value => updateVoiceSettings({ videoDeviceId: value })}
          />
        </div>
        <div className="vv-column">
          <h5 className="vv-heading vv-heading-small">Önizleme</h5>
          <CameraPreview
            settings={settings}
            onAccessGranted={() => setCameraAccess(prev => prev + 1)}
          />
        </div>
      </div>

      <div className="vv-divider" />

      <h5 className="vv-heading">Gelişmiş</h5>
      <h5 className="vv-heading vv-heading-small">Ses İşleme</h5>
      <SwitchRow
        title="Yankı Engelleme"
        note="Görüşmedeki kişilerin sesinin hoparlörden mikrofonuna geri dönmesini engeller."
        checked={settings.echoCancellation}
        onChange={value => updateVoiceSettings({ echoCancellation: value })}
      />
      <SwitchRow
        title="Gürültü Azaltma"
        note="Yapay zekâ ile (RNNoise) klavye, fan, uğultu ve arka plan müziğini bastırır ve sadece insan sesi aralığını (100 Hz - 7 kHz) iletir. Hoparlörden gelen konuşmaları (dizi, video) ayıramaz; bunun için kulaklık kullan."
        checked={settings.noiseSuppression}
        onChange={value => updateVoiceSettings({ noiseSuppression: value })}
      />
      <SwitchRow
        title="Otomatik Kazanç Kontrolü"
        note="Sesin çok kısık ya da çok yüksek gitmesin diye mikrofon seviyesini otomatik olarak ayarlar."
        checked={settings.autoGainControl}
        divider={false}
        onChange={value => updateVoiceSettings({ autoGainControl: value })}
      />

      <div className="vv-divider" />

      <button
        type="button"
        className="vv-button vv-button-outlined-red"
        onClick={() => setConfirmReset(true)}
      >
        Ses Ayarlarını Sıfırla
      </button>

      {confirmReset && <ResetModal onClose={() => setConfirmReset(false)} />}
    </div>
  );
};

export default VoiceVideo;
