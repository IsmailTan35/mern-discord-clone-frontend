import { useEffect, useState } from "react";

// Who is talking in a voice channel right now, by user id. Fed by the server's
// "voiceSpeaking" events and, for ourselves, straight from our microphone.
// Kept out of Redux: it changes several times a second.
let speaking = new Set();
const listeners = new Set();

const publish = next => {
  speaking = next;
  listeners.forEach(listener => listener(speaking));
};

export const setSpeaking = (userId, value) => {
  if (!userId || speaking.has(userId) === !!value) return;
  const next = new Set(speaking);
  if (value) next.add(userId);
  else next.delete(userId);
  publish(next);
};

export const clearSpeaking = () => {
  if (speaking.size > 0) publish(new Set());
};

export const useSpeaking = userId => {
  const [value, setValue] = useState(() => speaking.has(userId));
  useEffect(() => {
    setValue(speaking.has(userId));
    const listener = next => setValue(next.has(userId));
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [userId]);
  return value;
};
