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

  // Every peer (and its microphone stream) of the current voice channel
  const voicePeers = useRef([]);

  const stopVoicePeers = () => {
    voicePeers.current.forEach(({ peer, stream }) => {
      stream.getTracks().forEach(track => track.stop());
      peer.destroy();
    });
    voicePeers.current = [];
  };

  const trackVoicePeer = (peer, stream) => {
    voicePeers.current.push({ peer, stream });
    peer.on("stream", remoteStream => {
      const audio = document.createElement("video");
      audio.srcObject = remoteStream;
      audio.play().catch(() => {});
    });
    peer.on("connect", () => {
      console.info("connected");
    });
    // simple-peer throws on an "error" event nobody listens to
    peer.on("error", error => {
      console.error(error);
    });
    peer.on("close", () => {
      stream.getTracks().forEach(track => track.stop());
      voicePeers.current = voicePeers.current.filter(item => item.peer !== peer);
    });
  };

  // Answers the offer of a member who joined after us
  async function addPeer(data, serverID, channel) {
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
      trackVoicePeer(peer, myPeerStream);

      peer.on("signal", signal => {
        socket.emit("channelReturningSignal", {
          serverID,
          channelID: channel._id,
          signal,
          userID: data._id,
        });
      });

      peer.signal(data.signal);
    } catch (error) {
      console.error(error);
    }
  }

  async function createPeer(serverID, channel) {
    try {
      // Switching channels: drop the peers of the previous one
      stopVoicePeers();

      socket.emit("joinVoiceChannel", {
        serverID,
        channelID: channel._id,
      });

      const myPeerStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: myPeerStream,
      });
      trackVoicePeer(peer, myPeerStream);
      let answered = false;

      // Replace the handlers of a previously joined channel instead of stacking them
      socket.off("closeStreamDevices");
      socket.off("userJoinedChannel");
      socket.off("channelReturningSignalListener");

      socket.on("closeStreamDevices", () => {
        stopVoicePeers();
      });

      socket.on("userJoinedChannel", data => {
        if (user.id == data._id) return;
        addPeer(data, serverID, channel);
      });

      // A member already in the channel answered our offer
      socket.on("channelReturningSignalListener", data => {
        if (user.id == data._id || answered || peer.destroyed) return;
        answered = true;
        peer.signal(data.signal);
      });

      peer.on("signal", signal => {
        socket.emit("channelSendingSignal", {
          serverID,
          channelID: channel._id,
          signal,
        });
      });
    } catch (error) {
      socket.emit("hata", error.value);
      console.error(error);
    }
  }

  const handleClick = (e, serverID, channel) => {
    const direction = `/channels/${serverId}/${channel._id}`;
    if (channel.type !== "voice") {
      navigate(direction);
      return;
    }
    const alreadyJoined = (channel.onlineUser || []).some(
      onlineUser => onlineUser._id === user.id
    );
    if (alreadyJoined) return;
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
                          {(channel.onlineUser || []).map((user, index) => (
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
