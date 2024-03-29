import React, { useContext, useEffect, useRef, useState } from "react";
import AvatarPicture from "components/AvatarPicture";
import { useDispatch, useSelector } from "react-redux";
import { streamActions } from "store";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "controller/Context";
import callingAudio from "assets/audio/Dubstep_call_tone.mp3.mpeg";

const useAudio = url => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = e => setPlaying(e);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const CallRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myStoreStream = useSelector(state => state.stream.items);
  const socket = useContext(SocketContext);
  const [playing, setToggle] = useAudio(callingAudio);
  const [receiver, setReceiver] = useState(null);

  const rejectCall = () => {
    dispatch(streamActions.update({ name: "calling", value: false }));
    socket.emit("rejectCall", myStoreStream);
  };

  const acceptCall = () => {
    navigate(`/channels/@me/${myStoreStream.userId}`);
    dispatch(streamActions.update({ name: "calling", value: false }));

    socket.emit("answerCall", {
      receiver: myStoreStream.callerId,
      chatType: myStoreStream.chatType,
    });
  };

  useEffect(() => {
    if (myStoreStream.calling) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [myStoreStream.calling]);

  useEffect(() => {
    socket.on("callStarted", data => {
      setReceiver(data);
    });

    socket.on("callCanceled", data => {
      dispatch(streamActions.delete());
    });
  });
  return (
    <>
      <div className="modal-container">
        <div
          className={`mymodal${myStoreStream.calling ? " active" : ""}`}
          style={{ background: "transparent", width: 220 }}
        >
          <div style={{}}>
            <div
              style={{
                padding: 20,
                background: "#18191d",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 9,
              }}
            >
              <div style={{ height: 50, margin: "auto" }}>
                <AvatarPicture state={false} />
              </div>
              <div
                style={{
                  height: 30,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  color: "#fff",
                }}
              >
                {myStoreStream.callerName}
              </div>
              <div
                style={{
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  color: "white",
                }}
              >
                Gelen Arama
              </div>
              <div
                style={{
                  height: 50,
                  display: "flex",
                  justifyContent: "center",
                  columnGap: 10,
                }}
              >
                <div
                  onClick={rejectCall}
                  style={{
                    height: 50,
                    width: "max-content",
                    borderRadius: "5px",
                    background: "#f04846",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "#fff",
                    padding: 10,
                  }}
                >
                  Reddet
                </div>
                <div
                  onClick={acceptCall}
                  style={{
                    height: 50,
                    width: "max-content",
                    borderRadius: "5px",
                    background: "#3fb17d",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "#fff",
                    padding: 10,
                  }}
                >
                  Kabul Et
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallRequest;
