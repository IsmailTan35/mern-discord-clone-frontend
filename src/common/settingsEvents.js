// Opening the user settings from anywhere (the gear in the user panel, the
// "Voice Settings" item of the device menus), optionally on a given tab
const OPEN_SETTINGS = "open-settings";

export const SETTINGS_TABS = { account: 1, voiceVideo: 12 };

export const openSettings = tab =>
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS, { detail: { tab } }));

export const onOpenSettings = handler => {
  const listener = event => handler(event.detail || {});
  window.addEventListener(OPEN_SETTINGS, listener);
  return () => window.removeEventListener(OPEN_SETTINGS, listener);
};
