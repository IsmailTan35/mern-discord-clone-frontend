import { useContext, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { SocketContext } from "controller/Context";
import { format } from "date-fns";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import AvatarPicture from "components/AvatarPicture";

const delay = { show: 50, hide: 0 };

const ChatBody = ({ user }) => {
  const ref = useRef(null);
  const location = useLocation();
  const socket = useContext(SocketContext);

  const [friendName, setFriendName] = useState("");
  const [messages, setMessages] = useState([]);

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
          <div className="chat-body-message" key={index}>
            <div className="chat-body-message-avatar">
              <AvatarPicture />
            </div>
            <div className="chat-body-message-text">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  columnGap: "10px",
                }}
              >
                <div className="chat-body-message-text-name">
                  {userList.length < 0 &&
                  friendName &&
                  message.sender === friendName
                    ? myUser.name
                    : userList.find(item => item.id === message.sender)
                    ? userList.find(item => item.id === message.sender).name
                    : ""}
                </div>
                <div style={{ color: "hsl(214,calc( 1*4%),65.3%)" }}>
                  <OverlayTrigger
                    placement="top"
                    delay={delay}
                    overlay={props => (
                      <Tooltip {...props}>
                        {format(
                          new Date(message.timestamps),
                          "EEEE, dd MMMM yyyy HH:mm"
                        )}
                      </Tooltip>
                    )}
                  >
                    <div>
                      {format(new Date(message.timestamps), "dd.MM.yyyy")}
                    </div>
                  </OverlayTrigger>
                </div>
              </div>

              <div
                className="chat-body-message-text-msg"
                style={{ ["--deneme"]: "#dcddde" }}
              >
                {message.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatBody;
