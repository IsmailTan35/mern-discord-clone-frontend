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
    const userID = location.pathname.split("/")[2];
    const channelID = location.pathname.split("/")[3];
    const parsedLocation = location.pathname.split("/");

    let data = {};
    if (parsedLocation.includes("channels")) {
      data = channelList.filter(user => user.id !== channelID);
    } else {
      data = userList.filter(user => user.id !== userID);
    }
    if (!data || data.length === 0) return;
    setUser(data[0]);
  }, [location, userList, channelList]);

  useLayoutEffect(() => {
    const rawLocation = location.pathname.split("/");
    const messageType = rawLocation.includes("@me");

    const userId = rawLocation[2];
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
