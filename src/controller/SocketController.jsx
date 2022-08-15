import { useEffect, useContext } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { messageActions } from "store";
import { userActions } from "store";
import { friendsActions, streamActions, friendRequestActions } from "store";
import { SocketContext } from "./Context";
import { useLocation } from "react-router-dom";
import { serversActions } from "store";
import { userListActions } from "store";

const SocketController = () => {
  const socket = useContext(SocketContext);
  const token = useSelector(state => state.user.token);
  const location = useLocation();
  const dispatch = useDispatch();

  const connectSocket = () => {
    socket.on("connect", () => {
      if (location.pathname !== "/") {
        socket.emit("configuration", {
          token: localStorage.getItem("accessToken"),
        });
      }
    });

    socket.on("disconnect", () => {});

    socket.on("reconnect", () => {
      if (location.pathname !== "/") {
        socket.emit("configuration", {
          token: localStorage.getItem("accessToken"),
        });
      }
    });

    socket.on("reconnect_attempt", () => {});

    socket.on("newMessage", message => {
      dispatch(messageActions.overWrite({ name: "items", value: message }));
    });

    socket.on("data", data => {
      dispatch(
        friendsActions.refresh({ name: "onlineUsers", value: data.onlineUsers })
      );
      dispatch(userActions.refresh({ name: "id", value: data.userId }));
      dispatch(userActions.refresh({ name: "name", value: data.name }));
      dispatch(userActions.refresh({ name: "code", value: data.code }));
      // dispatch(
      //   friendsActions.update({ type: "add", name: "onlineUsers", value: data })
      // );
    });

    socket.on("friendLeft", user => {
      dispatch(
        friendsActions.update({
          type: "remove",
          name: "onlineUsers",
          value: user,
        })
      );
    });

    socket.on("friendJoin", user => {
      if (!user.userId) return;
      dispatch(
        friendsActions.update({ type: "add", name: "onlineUsers", value: user })
      );
    });

    socket.on("calling", user => {
      dispatch(streamActions.update({ name: "calling", value: true }));
      dispatch(streamActions.update({ name: "callerId", value: user.from }));
      dispatch(streamActions.update({ name: "callerName", value: user.name }));
      dispatch(streamActions.update({ name: "userId", value: user.id }));
      dispatch(
        streamActions.update({ name: "chatType", value: user.chatType })
      );
    });

    socket.on("friendRequests", data => {
      dispatch(
        friendsActions.refresh({ type: "add", name: "requests", value: data })
      );
    });

    socket.on("friendRequestsRemove", data => {
      dispatch(
        friendsActions.update({ type: "remove", name: "requests", value: data })
      );
    });

    socket.on("newFriendRequest", data => {
      dispatch(
        friendsActions.update({ type: "add", name: "requests", value: data })
      );
    });

    socket.on("friends", data => {
      dispatch(
        friendsActions.refresh({ type: "add", name: "all", value: data })
      );
    });

    socket.on("friendUnFriend", data => {
      dispatch(
        friendsActions.update({ type: "remove", name: "all", value: data })
      );
    });

    socket.on("newFriend", data => {
      dispatch(
        friendsActions.update({ type: "add", name: "all", value: data })
      );
    });

    socket.on("friendBlockeds", data => {
      dispatch(
        friendsActions.refresh({ type: "add", name: "blocked", value: data })
      );
    });

    socket.on("friendAll", data => {
      dispatch(
        friendsActions.refresh({ type: "add", name: "all", value: data })
      );
    });

    socket.on("serverList", data => {
      dispatch(
        serversActions.refresh({ type: "add", name: "items", value: data })
      );
    });

    socket.on("newServer", data => {
      dispatch(
        serversActions.update({ type: "add", name: "items", value: data })
      );
    });

    socket.on("newUserInfo", data => {
      dispatch(
        userListActions.update({ type: "add", name: "items", value: data })
      );
    });

    socket.on("serverUsers", data => {
      dispatch(
        userListActions.mutation({ type: "add", name: "items", value: data })
      );
    });

    socket.on("joinUserVoiceChannel", data => {
      console.log();
    });
  };

  useEffect(() => {
    if (!token) return;
    connectSocket();
  }, [token, socket.connected]);

  return null;
};

export default connect()(SocketController);
