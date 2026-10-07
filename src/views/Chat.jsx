import { useState, useContext, useLayoutEffect, useEffect } from "react";

import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "controller/Context";

import ChatBody from "components/chat/ChatBody";
import ChatInput from "components/chat/ChatInput";
import ChatVideo from "components/chat/ChatVideo";

const Chat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const socket = useContext(SocketContext);

  const [user, setUser] = useState({});
  const userList = useSelector(state => state.userList.items);
  const channelList = useSelector(state => state.channels.items);

  useEffect(() => {
    // /channels/@me/:userId or /channels/:serverID/:channelID
    const parsedLocation = location.pathname.split("/");
    const id = parsedLocation[3];

    const data = parsedLocation.includes("@me")
      ? userList.find(user => user.id === id)
      : channelList.find(channel => channel._id === id);
    if (!data) return;
    setUser(data);
  }, [location, userList, channelList]);

  useLayoutEffect(() => {
    const rawLocation = location.pathname.split("/");
    const messageType = rawLocation.includes("@me");

    const userId = rawLocation[3];
    const serverID = rawLocation[2];
    const channelID = rawLocation[3];

    setTimeout(() => {
      socket.emit("getMessages", {
        receiver: messageType ? userId : null,
        serverName: messageType ? null : serverID,
        channelName: messageType ? null : channelID,
      });
    }, 500);
  }, [location]);

  return (
    <>
      <ChatVideo user={user} />
      <ChatBody user={user} />
      <ChatInput user={user} />
    </>
  );
};

export default Chat;
