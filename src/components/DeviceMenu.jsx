import React, { useEffect, useRef } from "react";
import {
  canChooseOutputDevice,
  updateVoiceSettings,
  useVoiceSettings,
} from "common/voiceSettings";
import { defaultOption, useMediaDevices } from "common/mediaDevices";
import { openSettings, SETTINGS_TABS } from "common/settingsEvents";

const KINDS = {
  input: {
    title: "Giriş Cihazı",
    devices: "audioinput",
    setting: "inputDeviceId",
    volumeTitle: "Giriş Ses Seviyesi",
    volume: "inputVolume",
    max: 100,
  },
  output: {
    title: "Çıkış Cihazı",
    devices: "audiooutput",
    setting: "outputDeviceId",
    volumeTitle: "Çıkış Ses Seviyesi",
    volume: "outputVolume",
    max: 200,
  },
};

// The menu behind the small arrows next to the microphone and headphones
// buttons: pick a device, set the volume, or open the voice settings
const DeviceMenu = ({ kind, onClose }) => {
  const config = KINDS[kind];
  const ref = useRef(null);
  const settings = useVoiceSettings();
  const devices = useMediaDevices(kind);
  const selectable = kind === "input" || canChooseOutputDevice();
  const options = [
    defaultOption(devices.defaults[config.devices]),
    ...(selectable ? devices[config.devices] : []),
  ];
  const selected = options.some(option => option.value === settings[config.setting])
    ? settings[config.setting]
    : "default";

  useEffect(() => {
    // Clicks on the button group (e.g. its arrow, which toggles the menu) are not outside
    const handleMouseDown = event => {
      const group = ref.current && ref.current.parentElement;
      if (group && !group.contains(event.target)) onClose();
    };
    const handleKeyDown = event => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
    };
    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return (
    <div className="device-menu" ref={ref} role="menu">
      <div className="device-menu-title">{config.title}</div>
      {options.map(option => (
        <button
          type="button"
          key={option.value}
          role="menuitemradio"
          aria-checked={option.value === selected}
          className={`device-menu-item${option.value === selected ? " selected" : ""}`}
          onClick={() => updateVoiceSettings({ [config.setting]: option.value })}
        >
          <span className="device-menu-label" title={option.label}>{option.label}</span>
          <span className="device-menu-radio" />
        </button>
      ))}
      {!selectable && (
        <div className="device-menu-note">Bu tarayıcı çıkış cihazı seçmeyi desteklemiyor.</div>
      )}
      <div className="device-menu-separator" />
      <div className="device-menu-title">
        {config.volumeTitle}
        <span>{settings[config.volume]}%</span>
      </div>
      <input
        type="range"
        className="device-menu-slider"
        min={0}
        max={config.max}
        value={settings[config.volume]}
        aria-label={config.volumeTitle}
        onChange={event =>
          updateVoiceSettings({ [config.volume]: Number(event.target.value) })
        }
      />
      <div className="device-menu-separator" />
      <button
        type="button"
        className="device-menu-item"
        onClick={() => {
          onClose();
          openSettings(SETTINGS_TABS.voiceVideo);
        }}
      >
        <span className="device-menu-label">Ses Ayarları</span>
      </button>
    </div>
  );
};

export default DeviceMenu;
