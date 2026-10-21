import { useEffect, useState } from "react";

// The member list of each server as the member sidebar last received it, so the
// message box can suggest people for @mentions without asking again
let members = {}; // serverId -> [{ id, name, code, online }]
const listeners = new Set();

export const setServerMembers = (serverId, list) => {
  if (!serverId) return;
  members = { ...members, [serverId]: list || [] };
  listeners.forEach(listener => listener(members));
};

export const clearServerMembers = () => {
  members = {};
  listeners.forEach(listener => listener(members));
};

export const useServerMembers = serverId => {
  const [value, setValue] = useState(() => members[serverId] || []);
  useEffect(() => {
    setValue(members[serverId] || []);
    const listener = next => setValue(next[serverId] || []);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [serverId]);
  return value;
};
