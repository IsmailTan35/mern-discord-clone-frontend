import { useContext, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { SocketContext } from "controller/Context";
import ChatMessage from "components/chat/ChatMessage";

const ChatBody = ({ user }) => {
  const ref = useRef(null);
  const location = useLocation();

  const [friendName, setFriendName] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);
  const myUser = useSelector(state => state.user);
  const rawMessages = useSelector(state => state.message.items);
  const userList = useSelector(state => state.userList.items);

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!location.pathname.split("/")[3]) return;
    const userId = location.pathname.split("/")[3];
    setFriendName(userId);
  }, [location]);

  useEffect(() => {
    const parsedLocation = location.pathname.split("/");
    if (parsedLocation.includes("@me")) {
      const res = userList.find(user => user.id === parsedLocation[3]);
      if (!res) socket.emit("getUserInfo", { userId: parsedLocation[3] });
      const data = rawMessages.filter(
        message =>
          message.sender === parsedLocation[3] ||
          message.receiver === parsedLocation[3] ||
          message.sender === myUser.id ||
          message.receiver === myUser.id
      );
      setMessages(data);
    } else {
      const data = rawMessages.filter(
        message =>
          message.serverName == parsedLocation[2] &&
          message.channelName == parsedLocation[3]
      );
      setMessages(data);
    }
  }, [rawMessages, location]);

  return (
    <>
      <div className="chat-body-wrapper" ref={ref}>
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage message={message} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatBody;
