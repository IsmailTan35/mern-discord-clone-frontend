import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as HashIcon } from "assets/img/hashIcon.svg";
import { ReactComponent as VoiceIcon } from "assets/img/voiceIcon.svg";
import { ReactComponent as AddIcon } from "assets/img/addIcon.svg";
import { ReactComponent as ArrowIcon } from "assets/img/arrowIcon.svg";

import "assets/css/channels.css";
import { socketActions } from "store/socket";
import { useContext } from "react";
import { SocketContext } from "controller/Context";

const SidebarServerChannels = () => {
  const location = useLocation();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const serverList = useSelector(state => state.server.items);
  const channelList = useSelector(state => state.channels.items);

  const [server, setServer] = useState({});
  const serverId = location.pathname.split("/")[2];

  const handleClick = (e, serverID, channel) => {
    const direction = `/channels/${serverId}/${channel._id}`;
    if (channel.type !== "voice") {
      navigate(direction);
      return;
    }
    socket.emit("joinVoiceChannel", { serverID, channelID: channel._id });
  };
  useEffect(() => {
    // if (location.pathname.split('/').length !== 4) return;
    if (serverList.length == 0 || channelList.length == 0) return;
    const parsed = serverList
      .map(server => ({
        ...server,
        fixedChannels: channelList.filter(item => item.serverID == server._id),
      }))
      .filter(server => server._id === serverId);

    if (parsed.length === 0) return;
    const result = parsed[0].fixedChannels.reduce((r, a) => {
      r[a.group] = r[a.group] || [];
      r[a.group].push(a);
      return r;
    }, Object.create(null));

    setServer(result);
  }, [location, serverList, channelList]);
  const joinVoiceChannel = (e, serverID, channel) => {};

  return (
    <>
      <div className="channels-wrapper">
        {server &&
          Object.entries(server).length > 0 &&
          Object.keys(server).map((group, index) => {
            return (
              <div key={index} className="channels-group-wrapper">
                <div className="channels-group-header">
                  <div className="channels-group-header-context">
                    <div>
                      <ArrowIcon />
                    </div>
                    <div className="channels-group-header-text">{group}</div>
                  </div>
                  <div className="channels-group-header-add">
                    <AddIcon />
                  </div>
                </div>
                <div className="channels-group-body">
                  {server[group].map(channel => {
                    return (
                      <div key={channel._id}>
                        <div
                          className="channel-wrapper"
                          onClick={e => {
                            handleClick(e, serverId, channel);
                          }}
                        >
                          {channel.type === "text" ? (
                            <HashIcon
                              style={{
                                width: "16px",
                                height: "16px",
                                marginRight: "8px",
                              }}
                            />
                          ) : (
                            <VoiceIcon
                              style={{
                                width: "16px",
                                height: "16px",
                                marginRight: "8px",
                              }}
                            />
                          )}
                          <div>{channel.channelname}</div>
                        </div>
                        <div
                          style={{
                            paddingLeft: 40,
                            display: "flex",
                            flexDirection: "column",
                            gap: 5,
                            textTransform: "none",
                          }}
                        >
                          {channel.onlineUser.map((user, index) => (
                            <div key={index}>{user.username}</div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default SidebarServerChannels;
