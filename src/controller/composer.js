import { useEffect, useState } from "react";

// Shared between the messages and the message box: the message being replied
// to, and a way for a message's "Reply" button to focus the box.

let reply = null; // { key, message }
const listeners = new Set();
const focusHandlers = new Set();

const publish = next => {
  reply = next;
  listeners.forEach(listener => listener(reply));
};

export const startReply = (key, message) => {
  publish({ key, message });
  focusHandlers.forEach(handler => handler());
};

export const cancelReply = () => {
  if (reply) publish(null);
};

// The message being replied to in this conversation, if any
export const useReplyTarget = key => {
  const [value, setValue] = useState(reply);
  useEffect(() => {
    setValue(reply);
    listeners.add(setValue);
    return () => listeners.delete(setValue);
  }, []);
  return value && value.key === key ? value.message : null;
};

export const onFocusRequest = handler => {
  focusHandlers.add(handler);
  return () => focusHandlers.delete(handler);
};
