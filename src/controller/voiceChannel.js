import Peer from "simple-peer";

// Voice channels use a full mesh: one WebRTC connection per other member,
// keyed by that member's socket id. Kept at module level so the call survives
// navigating away from the server page.
let localStream = null;
let current = null; // { serverID, channelID }
let peers = {}; // socketId -> { peer, audio }
let joinAttempt = 0;
let listening = false;

const playRemoteStream = stream => {
  const audio = document.createElement("audio");
  audio.srcObject = stream;
  audio.autoplay = true;
  audio.play().catch(() => {});
  return audio;
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
};

const createPeer = (socket, socketId, initiator) => {
  const peer = new Peer({ initiator, trickle: false, stream: localStream });
  const entry = { peer, audio: null };
  peers[socketId] = entry;

  peer.on("signal", signal => {
    if (!current) return;
    socket.emit("voiceSignal", { to: socketId, signal, ...current });
  });
  peer.on("stream", stream => {
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

export const stopVoiceChannel = () => {
  joinAttempt++;
  Object.keys(peers).forEach(destroyPeer);
  if (localStream) localStream.getTracks().forEach(track => track.stop());
  localStream = null;
  current = null;
};

const listen = socket => {
  if (listening) return;
  listening = true;

  // Sent to us right after we joined: call everyone already in the channel
  socket.on("voiceChannelMembers", data => {
    if (!isCurrentChannel(data) || !localStream) return;
    data.members.forEach(socketId => {
      if (socketId === socket.id || peers[socketId]) return;
      createPeer(socket, socketId, true);
    });
  });

  socket.on("voiceSignal", data => {
    if (!isCurrentChannel(data) || !localStream || !data.signal) return;
    const { from, signal } = data;
    let entry = peers[from];

    // Both sides called each other at the same time: the lower socket id keeps its call
    if (entry && signal.type === "offer" && entry.peer.initiator) {
      if (socket.id < from) return;
      destroyPeer(from);
      entry = null;
    }

    if (!entry) {
      if (signal.type !== "offer") return;
      entry = createPeer(socket, from, false);
    }
    entry.peer.signal(signal);
  });

  socket.on("voicePeerLeft", ({ socketId }) => {
    destroyPeer(socketId);
  });

  socket.on("closeStreamDevices", stopVoiceChannel);

  // The server drops us from the channel when the connection is lost
  socket.on("disconnect", stopVoiceChannel);
};

export const joinVoiceChannel = async (socket, serverID, channelID) => {
  if (isCurrentChannel({ serverID, channelID })) return;
  listen(socket);
  stopVoiceChannel();

  const attempt = joinAttempt;
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
  } catch (error) {
    console.error(error);
    socket.emit("hata", error.message);
    return;
  }

  // Another channel was clicked (or the call was left) while waiting for the microphone
  if (attempt !== joinAttempt) {
    stream.getTracks().forEach(track => track.stop());
    return;
  }

  localStream = stream;
  current = { serverID, channelID };
  socket.emit("joinVoiceChannel", { serverID, channelID });
};
