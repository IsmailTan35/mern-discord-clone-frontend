import AvatarPicture from "components/AvatarPicture";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const delay = { show: 50, hide: 0 };

const ChatMessage = ({ message }) => {
  const [userName, setUserName] = useState("");
  const [friendName, setFriendName] = useState("");

  const myUser = useSelector(state => state.user);
  const userList = useSelector(state => state.userList.items);

  useEffect(() => {
    if (!myUser.id || !message.sender || userList.length <= 0) return;
    if (message.sender == myUser.id) {
      setUserName(myUser.name);
    } else {
      const res = userList.find(item => item.id === message.sender);
      if (!res) return;
      setUserName(res.name);
    }
  }, [myUser, message, userList]);

  return (
    <div className="chat-body-message">
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
          <div className="chat-body-message-text-name">{userName}</div>
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
              <div>{format(new Date(message.timestamps), "dd.MM.yyyy")}</div>
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
  );
};

export default ChatMessage;
