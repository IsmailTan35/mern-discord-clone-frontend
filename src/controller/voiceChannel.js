import { useEffect, useState } from "react";
import Peer from "simple-peer";
import { attachInputMode, openMicrophone } from "common/microphone";
import {
  applyOutputSettings,
  getVoiceSettings,
  subscribeVoiceSettings,
} from "common/voiceSettings";
import { setSpeaking } from "controller/speaking";

// Voice channels use a full mesh: one WebRTC connection per other member,
// keyed by that member's socket id. Kept at module level so the call survives
// navigating away from the server page.
let localStream = null; // handed to every peer; its track is swapped when the microphone changes
let mic = null;
let screenStream = null; // our own screen share, sent to every peer as a second stream
let detachInputMode = null;
let unsubscribeSettings = null;
let lastSettings = null;
let current = null; // { serverID, channelID }
let currentUserId = null;
let voiceSocket = null;
let peers = {}; // socketId -> { peer, audio, userId }
let remoteScreens = {}; // userId -> MediaStream of that member's screen share
let watching = null; // { userId, username, serverID, channelID } of the open stream viewer
let joinAttempt = 0;
let micGeneration = 0;
let listening = false;

// Changing these needs a new microphone stream instead of a live adjustment
const MICROPHONE_SETTINGS = [
  "inputDeviceId",
  "echoCancellation",
  "noiseSuppression",
  "autoGainControl",
];

// ---- state for the UI (voice panel, stream viewer)

const listeners = new Set();
const snapshot = () => ({
  channel: current,
  sharing: !!screenStream,
  screenStream,
  remoteScreens,
  watching,
});
let state = snapshot();

const notify = () => {
  state = snapshot();
  listeners.forEach(listener => listener(state));
};

export const getVoiceState = () => state;

export const useVoiceState = () => {
  const [value, setValue] = useState(state);
  useEffect(() => {
    setValue(state);
    listeners.add(setValue);
    return () => listeners.delete(setValue);
  }, []);
  return value;
};

export const watchStream = target => {
  watching = target;
  notify();
};

export const closeStream = () => {
  watching = null;
  notify();
};

// ---- peers

const playRemoteStream = stream => {
  const audio = document.createElement("audio");
  audio.srcObject = stream;
  audio.autoplay = true;
  applyOutputSettings(audio);
  audio.play().catch(() => {});
  return audio;
};

const removeRemoteScreen = userId => {
  if (!userId || !remoteScreens[userId]) return;
  const { [userId]: removed, ...rest } = remoteScreens;
  remoteScreens = rest;
  notify();
};

const destroyPeer = socketId => {
  const entry = peers[socketId];
  if (!entry) return;
  delete peers[socketId];
  entry.peer.destroy();
  if (entry.audio) {
    entry.audio.pause();
    entry.audio.srcObject = null;
  }
  removeRemoteScreen(entry.userId);
};

const createPeer = (socket, socketId, userId, initiator) => {
  const streams = screenStream ? [localStream, screenStream] : [localStream];
  const peer = new Peer({ initiator, trickle: false, streams });
  const entry = { peer, audio: null, userId };
  peers[socketId] = entry;

  peer.on("signal", signal => {
    if (!current) return;
    socket.emit("voiceSignal", { to: socketId, signal, ...current });
  });
  peer.on("stream", stream => {
    // A stream with video is that member's screen share; the other one is their voice
    if (stream.getVideoTracks().length > 0) {
      remoteScreens = { ...remoteScreens, [entry.userId]: stream };
      notify();
      return;
    }
    entry.audio = playRemoteStream(stream);
  });
  // simple-peer throws on an "error" event nobody listens to
  peer.on("error", error => {
    console.error(error);
  });
  peer.on("close", () => {
    if (peers[socketId] === entry) destroyPeer(socketId);
  });
  return entry;
};

const isCurrentChannel = ({ serverID, channelID }) =>
  current && current.serverID === serverID && current.channelID === channelID;

// ---- microphone

const handleSpeakingChange = value => {
  setSpeaking(currentUserId, value);
  if (voiceSocket && current) voiceSocket.emit("voiceSpeaking", { speaking: value });
};

const useMicrophone = opened => {
  mic = opened;
  mic.setTransmitting(false);
  detachInputMode = attachInputMode(mic, handleSpeakingChange);
};

// Swaps in a freshly opened microphone without dropping the connections
const restartMicrophone = async settings => {
  const generation = ++micGeneration;
  let next;
  try {
    next = await openMicrophone(settings);
  } catch (error) {
    console.error(error);
    return;
  }

  // The call ended, or another change started a newer restart, while waiting
  if (generation !== micGeneration || !localStream) {
    next.stop();
    return;
  }

  const oldTrack = localStream.getAudioTracks()[0];
  const newTrack = next.stream.getAudioTracks()[0];
  Object.values(peers).forEach(({ peer }) => {
    try {
      peer.replaceTrack(oldTrack, newTrack, localStream);
    } catch (error) {
      console.error(error);
    }
  });
  localStream.removeTrack(oldTrack);
  localStream.addTrack(newTrack);

  detachInputMode();
  mic.stop();
  useMicrophone(next);
};

const handleSettingsChange = settings => {
  if (!mic) return;
  mic.setVolume(settings.inputVolume);
  Object.values(peers).forEach(entry =>
    applyOutputSettings(entry.audio, settings)
  );
  const microphoneChanged = MICROPHONE_SETTINGS.some(
    key => settings[key] !== lastSettings[key]
  );
  const muteChanged =
    settings.selfMute !== lastSettings.selfMute ||
    settings.selfDeaf !== lastSettings.selfDeaf;
  lastSettings = settings;
  // Shown to the others as icons next to our name
  if (muteChanged && voiceSocket && current) {
    voiceSocket.emit("voiceState", {
      selfMute: settings.selfMute,
      selfDeaf: settings.selfDeaf,
    });
  }
  if (microphoneChanged) restartMicrophone(settings);
};

// ---- screen sharing

export const stopScreenShare = () => {
  if (!screenStream) return;
  const stream = screenStream;
  screenStream = null;
  Object.values(peers).forEach(({ peer }) => {
    try {
      peer.removeStream(stream);
    } catch (error) {
      console.error(error);
    }
  });
  stream.getTracks().forEach(track => track.stop());
  if (voiceSocket && current) voiceSocket.emit("voiceScreenShare", { sharing: false });
  if (watching && watching.userId === currentUserId) watching = null;
  notify();
};

export const startScreenShare = async () => {
  if (!current || screenStream) return;
  let stream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 },
      audio: true,
    });
  } catch (error) {
    // The user closed the picker
    return;
  }

  // Left the channel (or started another share) while the picker was open
  if (!current || screenStream) {
    stream.getTracks().forEach(track => track.stop());
    return;
  }

  screenStream = stream;
  const videoTrack = stream.getVideoTracks()[0];
  // Keep text readable: on a weak connection drop frame rate before resolution
  videoTrack.contentHint = "detail";
  // The browser's own "Stop sharing" bar ends the video track
  videoTrack.addEventListener("ended", stopScreenShare);
  Object.values(peers).forEach(({ peer }) => {
    try {
      peer.addStream(stream);
    } catch (error) {
      console.error(error);
    }
  });
  voiceSocket.emit("voiceScreenShare", { sharing: true });
  notify();
};

// ---- joining and leaving

export const stopVoiceChannel = () => {
  joinAttempt++;
  micGeneration++;
  // Tell the others we stopped streaming and talking while still in the channel
  stopScreenShare();
  if (detachInputMode) detachInputMode();
  Object.keys(peers).forEach(destroyPeer);
  if (unsubscribeSettings) unsubscribeSettings();
  if (mic) mic.stop();
  unsubscribeSettings = null;
  detachInputMode = null;
  mic = null;
  localStream = null;
  current = null;
  remoteScreens = {};
  watching = null;
  notify();
};

const listen = socket => {
  if (listening) return;
  listening = true;

  // Sent to us right after we joined: call everyone already in the channel
  socket.on("voiceChannelMembers", data => {
    if (!isCurrentChannel(data) || !localStream) return;
    data.members.forEach(({ socketId, userId }) => {
      if (socketId === socket.id || peers[socketId]) return;
      createPeer(socket, socketId, userId, true);
    });
  });

  socket.on("voiceSignal", data => {
    if (!isCurrentChannel(data) || !localStream || !data.signal) return;
    const { from, fromUserId, signal } = data;
    let entry = peers[from];

    // Both sides called each other at the same time: the lower socket id keeps
    // its call. Once connected, offers are renegotiations (e.g. a screen share).
    if (
      entry &&
      signal.type === "offer" &&
      entry.peer.initiator &&
      !entry.peer.connected
    ) {
      if (socket.id < from) return;
      destroyPeer(from);
      entry = null;
    }

    if (!entry) {
      if (signal.type !== "offer") return;
      entry = createPeer(socket, from, fromUserId, false);
    }
    entry.peer.signal(signal);
  });

  socket.on("voicePeerLeft", ({ socketId }) => {
    destroyPeer(socketId);
  });

  socket.on("voiceScreenShare", ({ userId, sharing }) => {
    if (!sharing) removeRemoteScreen(userId);
  });

  socket.on("closeStreamDevices", stopVoiceChannel);

  // The server drops us from the channel when the connection is lost
  socket.on("disconnect", stopVoiceChannel);
};

export const joinVoiceChannel = async (socket, serverID, channelID, userId) => {
  if (isCurrentChannel({ serverID, channelID })) return;
  listen(socket);
  stopVoiceChannel();
  voiceSocket = socket;
  currentUserId = userId;

  const attempt = joinAttempt;
  let opened;
  try {
    opened = await openMicrophone(getVoiceSettings());
  } catch (error) {
    console.error(error);
    socket.emit("hata", error.message);
    return;
  }

  // Another channel was clicked (or the call was left) while waiting for the microphone
  if (attempt !== joinAttempt) {
    opened.stop();
    return;
  }

  localStream = new MediaStream(opened.stream.getAudioTracks());
  useMicrophone(opened);
  lastSettings = getVoiceSettings();
  unsubscribeSettings = subscribeVoiceSettings(handleSettingsChange);

  current = { serverID, channelID };
  socket.emit("joinVoiceChannel", {
    serverID,
    channelID,
    selfMute: lastSettings.selfMute,
    selfDeaf: lastSettings.selfDeaf,
  });
  notify();
};
