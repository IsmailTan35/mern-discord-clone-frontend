import { useEffect, useState } from "react";

// Chrome labels the system default as "Default - <device>"; show which device
// that really is, since a wrong Windows default is easy to miss otherwise
const DEFAULT_PREFIX = /^(default|varsayılan)\s*-\s*/i;

// "Microphone (2- SteelSeries Alias Pro 1) (1038:12c2)": Windows puts the
// device in brackets after its endpoint name, and USB devices get their ids
// appended. Like Discord, show the device as the title and the endpoint below.
const USB_IDS = /\s*\([0-9a-f]{4}:[0-9a-f]{4}\)$/i;
const ENDPOINT_AND_DEVICE = /^(.+?)\s\((.+)\)$/;

export const describeDevice = label => {
  const clean = String(label || "").replace(USB_IDS, "").trim();
  const match = clean.match(ENDPOINT_AND_DEVICE);
  return match
    ? { title: match[2], subtitle: match[1] }
    : { title: clean, subtitle: "" };
};

export const defaultOption = deviceName => ({
  value: "default",
  label: deviceName ? `Varsayılan (${deviceName})` : "Varsayılan",
  title: "Varsayılan",
  subtitle: deviceName ? describeDevice(deviceName).title : "",
});

// Calls `onLost` once when an open microphone `track` no longer delivers what
// the user chose: the device was unplugged or restarted (the track ends), or,
// with "Varsayılan" selected, Windows switched its default input to another
// device (an open track stays on the device it was opened on; apps like
// SteelSeries Sonar make themselves the default when they start).
// Returns a function that stops watching.
export const watchInputDevice = (track, getDeviceId, onLost) => {
  const mediaDevices = navigator.mediaDevices;
  if (!track || !mediaDevices) return () => {};
  let active = true;

  const handleDeviceChange = async () => {
    if (getDeviceId() !== "default") return;
    try {
      const devices = await mediaDevices.enumerateDevices();
      const current = devices.find(
        device => device.kind === "audioinput" && device.deviceId === "default"
      );
      if (current && current.label && track.label && current.label !== track.label) lost();
    } catch (error) {}
  };
  const stop = () => {
    active = false;
    track.removeEventListener("ended", lost);
    mediaDevices.removeEventListener("devicechange", handleDeviceChange);
  };
  function lost() {
    if (!active) return;
    stop();
    onLost();
  }

  track.addEventListener("ended", lost);
  mediaDevices.addEventListener("devicechange", handleDeviceChange);
  return stop;
};

// Audio inputs, outputs and cameras, kept up to date when devices are plugged
// in or out. Device labels are only visible once the page has media
// permission, so the list is read again whenever `refreshKey` changes.
export const useMediaDevices = refreshKey => {
  const [devices, setDevices] = useState({
    audioinput: [],
    audiooutput: [],
    videoinput: [],
    defaults: {},
  });

  useEffect(() => {
    const mediaDevices = navigator.mediaDevices;
    if (!mediaDevices || !mediaDevices.enumerateDevices) return;
    let active = true;

    const load = () => {
      mediaDevices
        .enumerateDevices()
        .then(list => {
          if (!active) return;
          const grouped = {
            audioinput: [],
            audiooutput: [],
            videoinput: [],
            defaults: {},
          };
          list.forEach(device => {
            const group = grouped[device.kind];
            if (!group || !device.deviceId) return;
            // Chrome adds the system defaults as extra "default"/"communications" entries
            if (device.deviceId === "default") {
              grouped.defaults[device.kind] = device.label.replace(
                DEFAULT_PREFIX,
                ""
              );
              return;
            }
            if (device.deviceId === "communications") return;
            const label = device.label || `Cihaz ${group.length + 1}`;
            group.push({
              value: device.deviceId,
              label,
              ...describeDevice(label),
            });
          });
          setDevices(grouped);
        })
        .catch(() => {});
    };

    load();
    mediaDevices.addEventListener("devicechange", load);
    return () => {
      active = false;
      mediaDevices.removeEventListener("devicechange", load);
    };
  }, [refreshKey]);

  return devices;
};
