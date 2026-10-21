import axios from "axios";
import { userActions } from "store";
import { stopVoiceChannel } from "controller/voiceChannel";
import { clearTyping } from "controller/typing";
import { clearSpeaking } from "controller/speaking";
import { clearServerMembers } from "controller/serverMembers";
import { cancelReply } from "controller/composer";
import { updateVoiceSettings } from "common/voiceSettings";

// Per-user data kept in this browser; device settings (voiceSettings) stay
const USER_KEYS = ["accessToken", "refreshToken", "user", "emojiRecent"];

// Everything that belongs to the logged-in user goes: the session, every
// Redux slice, the voice call, and what the socket is known as on the server.
// `tellServer` is false when the server already ended the session.
export const logout = ({ socket, dispatch, navigate, tellServer = true }) => {
  const token = localStorage.getItem("accessToken");
  if (tellServer && token) axios.post("/auth/logout", { token }).catch(() => {});

  USER_KEYS.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {}
  });
  delete axios.defaults.headers.common["Authorization"];

  stopVoiceChannel();
  clearTyping();
  clearSpeaking();
  clearServerMembers();
  cancelReply();
  // The next person should not start out muted by someone else's buttons
  updateVoiceSettings({ selfMute: false, selfDeaf: false });

  // Empties every slice (see store/index.jsx)
  dispatch(userActions.delete());

  // The server keeps a socket's user until it disconnects: without a new
  // connection it would go on sending this user's messages here and show
  // them online
  if (socket && token) {
    socket.disconnect();
    socket.connect();
  }

  navigate("/auth/login");
};
