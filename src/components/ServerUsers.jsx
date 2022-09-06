import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "controller/Context";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import AvatarPicture from "./AvatarPicture";

import "assets/css/serverusers.css";
import { userListActions } from "store";

const ServerUsers = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const socket = useContext(SocketContext);
  const token = useSelector(state => state.user.token);

  useEffect(() => {
    const parsedLocation = location.pathname.split("/");
    if (!token) return;
    socket.emit("getServerUsers", {
      serverId: parsedLocation[2],
    });
  }, [token, socket.connected, location.pathname]);

  useEffect(() => {
    socket.on("serverUsers", data => {
      setUsers(data);
    });
  }, []);

  return (
    <>
      <div className="serverusers-wrapper">
        {users &&
          users.map((user, index) => {
            return (
              <div className="serveruser" key={index}>
                <div>
                  <AvatarPicture state={true} />
                </div>
                <div>{user.name}</div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ServerUsers;
