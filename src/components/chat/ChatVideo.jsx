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
  useEffect(() => {
    socket.on("acceptedCall", data => {});

    socket.on("user joined", data => {
      addPeer(data.signal, data.from, data.chatType);
    });

    socket.on("all users", data => {
      data.users.map(userID => {
        createPeer(userID, data.chatType);
      });
    });

    socket.on("hangup", payload => {
      removePeer(payload.from);
    });

    socket.on("receiving returned signal", payload => {
      setPeers(items =>
        items.map(item => {
          if (item.peerID == payload.from) {
            item.peer.signal(payload.signal);
          }
          return item;
        })
      );
    });
  }, []);

  const createPeer = async (receiver, chatType) => {
    let booleanChatType = chatType == "video" ? true : false;
    if (booleanChatType) {
      try {
        const streamDevices = await navigator.mediaDevices.enumerateDevices();
        const filterDeviceList = streamDevices.find(
          device => (device.kind = "videoinput")
        );
        if (filterDeviceList.length <= 0) booleanChatType = false;
      } catch (error) {}
    }

    navigator.mediaDevices
      .getUserMedia({ video: booleanChatType, audio: true })
      .then(stream => {
        const item = peers.find(p => p.peerID == receiver);
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
    let booleanChaType = chatType == "video" ? true : false;
    if (booleanChatType) {
      try {
        const streamDevices = await navigator.mediaDevices.enumerateDevices();
        const filterDeviceList = streamDevices.find(
          device => (device.kind = "videoinput")
        );
        if (filterDeviceList.length <= 0) booleanChatType = false;
      } catch (error) {}
    }
    navigator.mediaDevices
      .getUserMedia({ video: booleanChaType, audio: true })
      .then(stream => {
        const item = peers.find(p => p.peerID == receiver);
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

  const handleDisableMicrophone = () => {
    if (!peers) return;

    peers.map(item => {
      if (!item.peer || !item.peer.streams || item.peer.streams.length <= 0)
        return;
      item.peer.streams[0].getTracks().map(track => {
        if (track.kind === "audio") {
          track.enabled = !track.enabled;
        }
      });
    });
  };

  const handleDisableCamera = () => {
    if (!peers) return;
    peers.map(item => {
      if (!item.peer || !item.peer.streams || item.peer.streams.length <= 0)
        return;
      item.peer.streams[0].getTracks().map(track => {
        if (track.kind === "video") {
          track.enabled = !track.enabled;
        }
      });
    });
  };

  const handleShareScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: { cursor: true }, audio: true })
      .then(screenStream => {
        let videoTrack = screenStream.getVideoTracks()[0];

        videoTrack.onended = () => {
          console.log("first");
        };
        setPeers(items =>
          items.map(item => {
            // item.peer.addTrack(videoTrack, screenStream);
            item.peer.replaceTrack(
              item.stream.getVideoTracks()[0],
              screenStream.getVideoTracks()[0],
              item.stream
            );
            item.stream = screenStream;
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
