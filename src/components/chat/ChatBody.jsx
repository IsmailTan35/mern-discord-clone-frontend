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
      const friendId = parsedLocation[3];
      const res = userList.find(user => user.id === friendId);
      if (!res) socket.emit("getUserInfo", { userId: friendId });
      // Only the conversation between me and this friend
      const data = rawMessages.filter(
        message =>
          (message.sender === friendId && message.receiver === myUser.id) ||
          (message.sender === myUser.id && message.receiver === friendId)
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
  }, [rawMessages, location, myUser.id]);

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
