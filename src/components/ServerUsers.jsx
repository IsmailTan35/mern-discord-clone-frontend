import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "controller/Context";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import AvatarPicture from "./AvatarPicture";
import { setServerMembers } from "controller/serverMembers";

import "assets/css/serverusers.css";

const byName = (a, b) => (a.name || "").localeCompare(b.name || "", "tr");

const MemberGroup = ({ title, members, online }) =>
  members.length > 0 && (
    <>
      <div className="serverusers-group">
        {title} — {members.length}
      </div>
      {members.map(user => (
        <div
          className={`serveruser${online ? "" : " serveruser-offline"}`}
          key={user.id}
          title={online ? "Çevrimiçi" : "Çevrimdışı"}
        >
          <AvatarPicture state={online} offline={!online} />
          <div className="serveruser-name">{user.name}</div>
        </div>
      ))}
    </>
  );

const ServerUsers = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const socket = useContext(SocketContext);
  const token = useSelector(state => state.user.token);
  const serverId = location.pathname.split("/")[2];
  // Read by listeners that are registered once
  const serverIdRef = useRef(serverId);
  serverIdRef.current = serverId;

  useEffect(() => {
    if (!token) return;
    socket.emit("getServerUsers", { serverId });
  }, [token, socket.connected, serverId]);

  useEffect(() => {
    const handleServerUsers = data => {
      setUsers(data);
    };
    // A member renamed themselves on their "My Account" page
    const handleUserUpdated = ({ id, name }) => {
      setUsers(items => items.map(user => (user.id === id ? { ...user, name } : user)));
    };
    // A member of this server connected, or closed their last tab
    const handlePresence = ({ userId, online }) => {
      setUsers(items =>
        items.some(user => user.id === userId && !!user.online !== online)
          ? items.map(user => (user.id === userId ? { ...user, online } : user))
          : items
      );
    };
    // Changes may have been missed while we were reconnecting: fetch them again
    const handleConfigured = () => {
      socket.emit("getServerUsers", { serverId: serverIdRef.current });
    };
    socket.on("serverUsers", handleServerUsers);
    socket.on("userPresence", handlePresence);
    socket.on("data", handleConfigured);
    socket.on("userUpdated", handleUserUpdated);
    return () => {
      socket.off("serverUsers", handleServerUsers);
      socket.off("userPresence", handlePresence);
      socket.off("data", handleConfigured);
      socket.off("userUpdated", handleUserUpdated);
    };
  }, []);

  // The message box suggests these people for @mentions
  useEffect(() => {
    setServerMembers(serverIdRef.current, users);
  }, [users]);

  const online = users.filter(user => user.online).sort(byName);
  const offline = users.filter(user => !user.online).sort(byName);

  return (
    <div className="serverusers-wrapper">
      <MemberGroup title="ÇEVRİMİÇİ" members={online} online />
      <MemberGroup title="ÇEVRİMDIŞI" members={offline} online={false} />
    </div>
  );
};

export default ServerUsers;
