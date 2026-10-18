import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as HashIcon } from "assets/img/hashIcon.svg";
import { ReactComponent as VoiceIcon } from "assets/img/voiceIcon.svg";
import { ReactComponent as AddIcon } from "assets/img/addIcon.svg";
import { ReactComponent as ArrowIcon } from "assets/img/arrowIcon.svg";

import { ReactComponent as Logo } from "assets/img/discordLogo.svg";

import "assets/css/channels.css";
import { useContext } from "react";
import { SocketContext } from "controller/Context";
import { joinVoiceChannel, watchStream } from "controller/voiceChannel";
import { useSpeaking } from "controller/speaking";
import { HeadphonesIcon, MicrophoneIcon } from "components/VoiceIcons";

// Discord's default avatar colours, picked by the user's tag
const AVATAR_COLORS = ["#5865f2", "#757e8a", "#3ba55c", "#faa61a", "#ed4245"];
const avatarColor = code => AVATAR_COLORS[Math.abs(Number(code) || 0) % 5];

const VoiceUser = ({ user, serverID, channelID }) => {
  const speaking = useSpeaking(user._id);

  const watch = () => {
    if (!user.streaming) return;
    watchStream({ userId: user._id, username: user.username, serverID, channelID });
  };

  return (
    <div
      className={`voice-user${user.streaming ? " streaming" : ""}`}
      title={user.streaming ? "Yayını izle" : undefined}
      onClick={watch}
    >
      <div
        className={`voice-user-avatar${speaking ? " speaking" : ""}`}
        style={{ backgroundColor: avatarColor(user.code) }}
      >
        <Logo />
      </div>
      <div className="voice-user-name">{user.username}</div>
      {user.streaming && <div className="voice-user-live">CANLI</div>}
      {(user.selfMute || user.selfDeaf) && (
        <div className="voice-user-icons">
          <span title="Susturuldu">
            <MicrophoneIcon muted size={16} strike="currentColor" />
          </span>
          {user.selfDeaf && (
            <span title="Sağırlaştırıldı">
              <HeadphonesIcon deafened size={16} strike="currentColor" />
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const SidebarServerChannels = () => {
  const location = useLocation();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const serverList = useSelector(state => state.server.items);
  const channelList = useSelector(state => state.channels.items);
  const userId = useSelector(state => state.user.id);
  const [server, setServer] = useState({});
  const serverId = location.pathname.split("/")[2];

  const handleClick = (e, serverID, channel) => {
    const direction = `/channels/${serverId}/${channel._id}`;
    if (channel.type !== "voice") {
      navigate(direction);
      return;
    }
    joinVoiceChannel(socket, serverID, channel._id, userId);
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

  return (
    <>
      <div className="channels-wrapper">
        {/* <video ref={ref} style={{ width: 50, height: 50 }}></video> */}
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
                          <div
                            style={{
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
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
                          </div>
                          <div
                            style={{
                              flex: "1 1",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {channel.channelname}
                          </div>
                        </div>
                        {(channel.onlineUser || []).length > 0 && (
                          <div className="voice-users">
                            {channel.onlineUser.map(user => (
                              <VoiceUser
                                key={user._id}
                                user={user}
                                serverID={serverId}
                                channelID={channel._id}
                              />
                            ))}
                          </div>
                        )}
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
