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
import ChannelModal from "components/modal/ChannelModal";

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

// Channel groups are stored with English names
const GROUP_LABELS = { "Text Channels": "METİN KANALLARI", "Voice Channels": "SES KANALLARI" };
const groupType = (group, channels) =>
  group === "Voice Channels" || (channels[0] && channels[0].type === "voice") ? "voice" : "text";

const GearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
    />
  </svg>
);

const SidebarServerChannels = () => {
  const location = useLocation();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const serverList = useSelector(state => state.server.items);
  const channelList = useSelector(state => state.channels.items);
  const userId = useSelector(state => state.user.id);
  const [server, setServer] = useState({});
  // { channel } to edit one, { type } to create one
  const [modal, setModal] = useState(null);
  const serverId = location.pathname.split("/")[2];
  const activeChannelId = location.pathname.split("/")[3];
  const currentServer = serverList.find(item => item._id === serverId);
  const isOwner = !!currentServer && !!userId && currentServer.ownerID === userId;

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
    // Both groups stay visible when empty, so a channel can be added to them again
    const empty = { "Text Channels": [], "Voice Channels": [] };
    const result = parsed[0].fixedChannels.reduce((r, a) => {
      r[a.group] = r[a.group] || [];
      r[a.group].push(a);
      return r;
    }, Object.assign(Object.create(null), empty));

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
                    <div className="channels-group-header-text">{GROUP_LABELS[group] || group}</div>
                  </div>
                  {isOwner && (
                    <button
                      type="button"
                      className="channels-group-header-add"
                      title="Kanal Oluştur"
                      onClick={() => setModal({ type: groupType(group, server[group]) })}
                    >
                      <AddIcon />
                    </button>
                  )}
                </div>
                <div className="channels-group-body">
                  {server[group].map(channel => {
                    return (
                      <div key={channel._id}>
                        <div
                          className={`channel-wrapper${channel._id === activeChannelId ? " active" : ""}`}
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
                          <div className="channel-name">{channel.channelname}</div>
                          {isOwner && (
                            <button
                              type="button"
                              className="channel-settings"
                              title="Kanalı Düzenle"
                              onClick={event => {
                                event.stopPropagation();
                                setModal({ channel });
                              }}
                            >
                              <GearIcon />
                            </button>
                          )}
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
      {modal && (
        <ChannelModal
          serverID={serverId}
          channel={modal.channel}
          initialType={modal.type}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
};

export default SidebarServerChannels;
