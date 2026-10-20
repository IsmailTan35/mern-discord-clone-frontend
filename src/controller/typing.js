import { useEffect, useState } from "react";

// Who is typing where, fed by the server's "typing" events. Kept out of Redux:
// it changes every few seconds. A conversation is "dm:<the other user's id>"
// or "ch:<server id>:<channel id>".

// Typing events arrive every few seconds while someone types; without one for
// this long they are considered to have stopped
const TYPING_TIMEOUT_MS = 8000;

let typing = {}; // conversation -> { userId: name }
const timers = new Map();
const listeners = new Set();

const publish = next => {
  typing = next;
  listeners.forEach(listener => listener(typing));
};

export const dmKey = userId => `dm:${userId}`;
export const channelKey = (serverID, channelID) => `ch:${serverID}:${channelID}`;

// The conversation of a /channels/@me/<user> or /channels/<server>/<channel> page
export const keyForPath = pathname => {
  const [, , first, second] = pathname.split("/");
  if (!second) return null;
  return first === "@me" ? dmKey(second) : channelKey(first, second);
};

export const stopTyping = (key, userId) => {
  const id = `${key}|${userId}`;
  clearTimeout(timers.get(id));
  timers.delete(id);
  if (!typing[key] || !(userId in typing[key])) return;
  const { [userId]: removed, ...rest } = typing[key];
  publish({ ...typing, [key]: rest });
};

export const startTyping = (key, userId, name) => {
  const id = `${key}|${userId}`;
  clearTimeout(timers.get(id));
  timers.set(id, setTimeout(() => stopTyping(key, userId), TYPING_TIMEOUT_MS));
  if (typing[key] && typing[key][userId] === name) return;
  publish({ ...typing, [key]: { ...(typing[key] || {}), [userId]: name } });
};

export const clearTyping = () => {
  timers.forEach(timer => clearTimeout(timer));
  timers.clear();
  if (Object.keys(typing).length > 0) publish({});
};

// { userId: name } of the people typing in a conversation
export const useTyping = key => {
  const [value, setValue] = useState(() => typing[key] || {});
  useEffect(() => {
    setValue(typing[key] || {});
    const listener = next => setValue(next[key] || {});
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [key]);
  return value;
};
