import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as HashIcon } from "assets/img/hashIcon.svg";
import { ReactComponent as VoiceIcon } from "assets/img/voiceIcon.svg";
import { ReactComponent as AddIcon } from "assets/img/addIcon.svg";
import { ReactComponent as ArrowIcon } from "assets/img/arrowIcon.svg";

import "assets/css/channels.css";
import { useContext } from "react";
import { SocketContext } from "controller/Context";

import Peer from "simple-peer";
import hark from "hark";
import { useRef } from "react";

const SidebarServerChannels = () => {
  const ref = useRef(null);
  const location = useLocation();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const serverList = useSelector(state => state.server.items);
  const channelList = useSelector(state => state.channels.items);
  const user = useSelector(state => state.user);
  const [server, setServer] = useState({});
  const serverId = location.pathname.split("/")[2];

  async function addPeer(data, user) {
    try {
      const myPeerStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: myPeerStream,
      });
      peer.signal(data.signal);
      console.log(2);

      peer.on("stream", stream => {
        const audio = new Audio();
        audio.srcObject = myPeerStream;
        audio.play();

        const speechEvents = hark(stream, {});
        speechEvents.on("speaking", () => {
          console.log(true);
        });

        speechEvents.on("stopped_speaking", () => {
          console.log(false);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function createPeer(serverID, channel) {
    try {
      const myPeerStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: myPeerStream,
      });

      peer.on("signal", signal => {
        socket.emit("joinVoiceChannel", {
          serverID,
          channelID: channel._id,
          signal,
        });

        socket.emit("channelSendingSignal", {
          serverID,
          channelID: channel._id,
          signal,
        });

        socket.on("userJoinedChannel", data => {
          if (user.id !== data._id) {
            console.log(2);

            socket.emit("channelReturningSignal", {
              serverID,
              channelID: channel._id,
              signal,
              userID: data._id,
            });
            addPeer(data, user);
          }
        });
        socket.on("channelReturningSignalListener", data => {
          addPeer(data, user);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = (e, serverID, channel) => {
    const direction = `/channels/${serverId}/${channel._id}`;
    if (channel.type !== "voice") {
      navigate(direction);
      return;
    }
    createPeer(serverID, channel);
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
