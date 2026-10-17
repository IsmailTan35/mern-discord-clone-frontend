import {
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import Peer from "simple-peer";
import { SocketContext } from "controller/Context";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as CameraIcon } from "assets/img/stream/stream-1.svg";
import { ReactComponent as ScreenShareIcon } from "assets/img/stream/stream-2.svg";
import { ReactComponent as MicrophoneIcon } from "assets/img/stream/stream-3.svg";
import { ReactComponent as HangupIcon } from "assets/img/stream/stream-4.svg";
import hark from "hark";
import {
  applyOutputSettings,
  getAudioConstraints,
  getVideoConstraints,
  getVoiceSettings,
  requestUserMedia,
  subscribeVoiceSettings,
} from "common/voiceSettings";

// Changing any of these in Settings swaps the microphone during a call
const MICROPHONE_SETTINGS = [
  "inputDeviceId",
  "echoCancellation",
  "noiseSuppression",
  "autoGainControl",
];

import "assets/css/stream.css";

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const streamStartEvent = new Event("streamStart");
const streamEndEvent = new Event("streamEnd");

const Video = ({ peer, mute }) => {
  const ref = useRef();
  const [speaking, setSpeaking] = useState(false);

  // Speaker and volume from Settings > Voice & Video, also when they change mid-call
  useEffect(() => {
    applyOutputSettings(ref.current);
    return subscribeVoiceSettings(settings =>
      applyOutputSettings(ref.current, settings)
    );
  }, []);

  useEffect(() => {
    let isApiSubscribed = true;
    peer.on("stream", stream => {
      ref.current.srcObject = stream;

      let speechEvents = hark(stream, {});
      speechEvents.on("speaking", () => {
        if (isApiSubscribed) setSpeaking(true);
      });

      speechEvents.on("stopped_speaking", () => {
        if (isApiSubscribed) setSpeaking(false);
      });
    });
    return () => {
      isApiSubscribed = false;
    };
  }, []);

  return (
    <video
      muted={mute}
      playsInline
      autoPlay
      ref={ref}
      className={`stream-webRTC${speaking ? " active" : ""}`}
      style={{ ...videoConstraints, background: "#202225" }}
      controls={false}
    />
  );
};

const Room = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const [peers, setPeers] = useState([]);
  // Socket handlers are registered once, so they read the live list from here
  const peersRef = useRef([]);
  peersRef.current = peers;
  const [mute, setMute] = useState(false);
  const [headphone, setHeadphone] = useState(false);
  const myStoreStream = useSelector(state => state.stream.items);

  const removePeer = id => {
    setPeers(items =>
      items
        .map(item => {
          if (item.peerID == id) {
            item.peer.destroy();
            item.stream.getTracks().map(track => track.stop());
          }
          return item;
        })
        .filter(p => p.peerID != id)
    );
  };

  useEffect(() => {
    if (!peers) return;

    if (peers.length == 0) window.dispatchEvent(streamEndEvent);
    else if (!peers || peers.length > 0) {
      window.dispatchEvent(streamStartEvent);
      // close all media stream
    }
  }, [peers]);

  // Replaces our outgoing microphone or camera on every connection without
  // renegotiating, keeping its mute state
  const switchLocalTrack = async kind => {
    let replacement;
    try {
      replacement = await requestUserMedia(
        kind === "audio"
          ? { audio: getAudioConstraints(), video: false }
          : { audio: false, video: getVideoConstraints() }
      );
    } catch (error) {
      console.error(error);
      return;
    }

    const newTrack = replacement.getTracks()[0];
    let used = false;
    peersRef.current.forEach(item => {
      const oldTrack = item.stream
        .getTracks()
        .find(track => track.kind === kind);
      if (!oldTrack || item.peer.destroyed) return;
      const track = used ? newTrack.clone() : newTrack;
      track.enabled = oldTrack.enabled;
      try {
        item.peer.replaceTrack(oldTrack, track, item.stream);
      } catch (error) {
        console.error(error);
        if (track !== newTrack) track.stop();
        return;
      }
      used = true;
      item.stream.removeTrack(oldTrack);
      item.stream.addTrack(track);
      oldTrack.stop();
    });
    if (!used) newTrack.stop();
  };

  useEffect(() => {
    let last = getVoiceSettings();
    return subscribeVoiceSettings(settings => {
      const microphoneChanged = MICROPHONE_SETTINGS.some(
        key => settings[key] !== last[key]
      );
      const cameraChanged = settings.videoDeviceId !== last.videoDeviceId;
      last = settings;
      if (peersRef.current.length === 0) return;
      if (microphoneChanged) switchLocalTrack("audio");
      if (cameraChanged) switchLocalTrack("video");
    });
  }, []);
  useEffect(() => {
    const handleUserJoined = data => {
      addPeer(data.signal, data.from, data.chatType);
    };

    const handleAllUsers = data => {
      data.users.forEach(userID => {
        createPeer(userID, data.chatType);
      });
    };

    const handleHangup = payload => {
      removePeer(payload.from);
    };

    const handleReturnedSignal = payload => {
      setPeers(items =>
        items.map(item => {
          if (item.peerID == payload.from) {
            item.peer.signal(payload.signal);
          }
          return item;
        })
      );
    };

    socket.on("user joined", handleUserJoined);
    socket.on("all users", handleAllUsers);
    socket.on("hangup", handleHangup);
    socket.on("receiving returned signal", handleReturnedSignal);
    return () => {
      socket.off("user joined", handleUserJoined);
      socket.off("all users", handleAllUsers);
      socket.off("hangup", handleHangup);
      socket.off("receiving returned signal", handleReturnedSignal);
    };
  }, []);

  const createPeer = async (receiver, chatType) => {
    let booleanChatType = chatType == "video" ? true : false;
    if (booleanChatType) {
      try {
        const streamDevices = await navigator.mediaDevices.enumerateDevices();
        const filterDeviceList = streamDevices.find(
          device => device.kind == "videoinput"
        );
        if (!filterDeviceList) booleanChatType = false;
      } catch (error) {
        console.error(error);
      }
    }

    requestUserMedia({
      video: booleanChatType ? getVideoConstraints() : false,
      audio: getAudioConstraints(),
    })
      .then(stream => {
        const item = peersRef.current.find(p => p.peerID == receiver);
        if (item) return;
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
        });
        peer.on("signal", signal => {
          socket.emit("sending signal", { signal, receiver, chatType });
        });
        peer.on("close", e => {
          stream.getTracks().map(track => track.stop());
          setPeers(items => items.filter(item => item.peerID != receiver));
        });
        peer.on("error", err => {
          setPeers(items => items.filter(item => item.peerID != receiver));
        });
        setPeers(users => [
          ...users,
          { peerID: receiver, peer: peer, stream: stream },
        ]);
      });
  };

  const addPeer = async (incomingSignal, receiver, chatType) => {
    let booleanChatType = chatType == "video" ? true : false;
    if (booleanChatType) {
      try {
        const streamDevices = await navigator.mediaDevices.enumerateDevices();
        const filterDeviceList = streamDevices.find(
          device => device.kind == "videoinput"
        );
        if (!filterDeviceList) booleanChatType = false;
      } catch (error) {
        console.error(error);
      }
    }
    requestUserMedia({
      video: booleanChatType ? getVideoConstraints() : false,
      audio: getAudioConstraints(),
    })
      .then(stream => {
        const item = peersRef.current.find(p => p.peerID == receiver);
        if (item) return;

        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
        });
        peer.signal(incomingSignal);

        peer.on("signal", signal => {
          socket.emit("returning signal", {
            signal: signal,
            receiver: receiver,
          });
        });
        peer.on("close", () => {
          stream.getTracks().map(track => track.stop());
          setPeers(users => users.filter(user => user.peerID != receiver));
        });
        peer.on("error", err => {
          setPeers(items => items.filter(item => item.peerID != receiver));
        });
        setPeers(users => [
          ...users,
          { peerID: receiver, peer: peer, stream: stream },
        ]);
      });
  };

  const handleHangup = () => {
    if (!peers) return;

    socket.emit("hangupCall");
    peers.map(item => {
      if (!item.peer || !item.peer.streams || item.peer.streams.length <= 0)
        return;
      item.peer.destroy();
      item.peer.streams[0].getTracks().map(track => track.stop());
      item.stream.getTracks().map(track => track.stop());
      item.peer.removeListener("stream", () => {});
    });
    setTimeout(() => {
      setPeers([]);
    }, 250);
  };

  const handleMute = () => {
    setMute(prv => !prv);
  };

  // Mute/unmute our own outgoing tracks (peer.streams holds the remote side)
  const toggleLocalTracks = kind => {
    if (!peers) return;
    peers.forEach(item => {
      if (!item.stream) return;
      item.stream.getTracks().forEach(track => {
        if (track.kind === kind) {
          track.enabled = !track.enabled;
        }
      });
    });
  };

  const handleDisableMicrophone = () => {
    toggleLocalTracks("audio");
  };

  const handleDisableCamera = () => {
    toggleLocalTracks("video");
  };

  const handleShareScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: { cursor: true }, audio: true })
      .then(screenStream => {
        let videoTrack = screenStream.getVideoTracks()[0];

        videoTrack.onended = () => {
          console.info("first");
        };
        setPeers(items =>
          items.map(item => {
            try {
              item.peer.replaceTrack(
                item.stream.getVideoTracks()[0],
                screenStream.getVideoTracks()[0],
                item.stream
              );
              item.stream = screenStream;
            } catch (error) {}
            return item;
          })
        );
      });
  };

  return (
    <div
      className="stream-wrapper"
      style={{ display: peers && peers.length > 0 ? "flex" : "none" }}
      id="deneme"
    >
      <div className="stream">
        {peers &&
          peers
            .filter(item => item.peerID != socket.id)
            .map((item, index) => (
              <Video key={index} peer={item.peer} mute={mute} />
            ))}
      </div>
      {peers && peers.length > 0 ? (
        <>
          <div className="stream-buttons-wrapper">
            <div>
              <div></div>
            </div>
            <div className="stream-buttons">
              <div
                className="stream-button-camera"
                onClick={handleDisableCamera}
              >
                <CameraIcon />
              </div>
              <div
                className="stream-button-screen-share"
                onClick={handleShareScreen}
              >
                <ScreenShareIcon />
              </div>
              <div
                className="stream-button-microphone"
                onClick={handleDisableMicrophone}
              >
                <MicrophoneIcon />
              </div>
              <div className="stream-button-hangup" onClick={handleHangup}>
                <HangupIcon />
              </div>
            </div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Room;
