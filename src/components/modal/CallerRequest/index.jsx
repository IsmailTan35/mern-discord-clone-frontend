import React, { useContext, useEffect, useRef, useState } from "react";
import AvatarPicture from "components/AvatarPicture";
import { useDispatch, useSelector } from "react-redux";
import { streamActions } from "store";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "controller/Context";

const CallerRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    socket.on("callStarted", data => {
      setReceiver(data);
    });
    socket.on("acceptedCall", data => {
      setReceiver(null);
    });
  });

  const callCancel = () => {
    socket.emit("callCancel", receiver);
    setReceiver(null);
  };

  return (
    <>
      <div className="modal-container">
        <div
          className={`mymodal${receiver ? " active" : ""}`}
          style={{ background: "transparent", width: 200 }}
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
                {receiver ? receiver.name : ""}
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
                Giden Arama
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
                  onClick={callCancel}
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
                    padding: "10px",
                  }}
                >
                  Sonlandır
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallerRequest;
