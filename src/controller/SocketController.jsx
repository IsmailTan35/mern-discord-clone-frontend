import { useEffect, useContext } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { messageActions } from "store";
import { userActions } from "store";
import { friendsActions, streamActions } from "store";
import { SocketContext } from "./Context";
import { useLocation } from "react-router-dom";
import { serversActions } from "store";
import { userListActions } from "store";
import messageSound from "assets/audio/discordMessage.mp3";
import joinSound from "assets/audio/discordJoin.wav";
import leaveSound from "assets/audio/discordLeave.mp3";

import { channelsActions } from "store";
import { toast } from "react-toastify";

// Browsers reject play() until the user has interacted with the page
const playSound = audio => {
  audio.play().catch(() => {});
};

// Registers every handler and returns a cleanup that removes exactly those handlers
const subscribe = (emitter, handlers) => {
  Object.entries(handlers).forEach(([event, handler]) =>
    emitter.on(event, handler)
  );
  return () => {
    Object.entries(handlers).forEach(([event, handler]) =>
      emitter.off(event, handler)
    );
  };
};

const SocketController = () => {
  const socket = useContext(SocketContext);
  const token = useSelector(state => state.user.token);
  const userID = useSelector(state => state.user.id);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname !== "/") {
      socket.emit("configuration", {
        token: localStorage.getItem("accessToken"),
      });
    }
    if (!token || !socket.connected || !userID) return;

    const audio = new Audio(messageSound);
    const discordJoin = new Audio(joinSound);
    const discordLeave = new Audio(leaveSound);

    return subscribe(socket, {
      connect: () => {
        if (location.pathname !== "/") {
          socket.emit("configuration", {
            token: localStorage.getItem("accessToken"),
          });
        }
      },

      allMessage: messages => {
        dispatch(messageActions.overWrite({ name: "items", value: messages }));
      },

      newMessage: message => {
        playSound(audio);
        dispatch(messageActions.overWrite({ name: "items", value: message }));
      },

      friendLeft: user => {
        dispatch(
          friendsActions.update({
            type: "remove",
            name: "onlineUsers",
            value: user,
          })
        );
      },

      friendJoin: user => {
        if (!user.userId) return;
        dispatch(
          friendsActions.update({
            type: "add",
            name: "onlineUsers",
            value: user,
          })
        );
      },

      calling: user => {
        dispatch(streamActions.update({ name: "calling", value: true }));
        dispatch(streamActions.update({ name: "callerId", value: user.from }));
        dispatch(
          streamActions.update({ name: "callerName", value: user.name })
        );
        dispatch(streamActions.update({ name: "userId", value: user.id }));
        dispatch(
          streamActions.update({ name: "chatType", value: user.chatType })
        );
      },

      friendRequests: data => {
        dispatch(
          friendsActions.refresh({ type: "add", name: "requests", value: data })
        );
      },

      friendRequestsRemove: data => {
        dispatch(
          friendsActions.update({
            type: "remove",
            name: "requests",
            value: data,
          })
        );
      },

      newFriendRequest: data => {
        dispatch(
          friendsActions.update({ type: "add", name: "requests", value: data })
        );
      },

      friends: data => {
        dispatch(
          friendsActions.refresh({ type: "add", name: "all", value: data })
        );
      },

      friendUnFriend: data => {
        dispatch(
          friendsActions.update({ type: "remove", name: "all", value: data })
        );
        dispatch(
          friendsActions.update({
            type: "remove",
            name: "onlineUsers",
            value: data,
          })
        );
      },

      newFriend: data => {
        dispatch(
          friendsActions.update({ type: "add", name: "all", value: data })
        );
      },

      friendBlockeds: data => {
        dispatch(
          friendsActions.refresh({ type: "add", name: "blocked", value: data })
        );
      },

      friendAll: data => {
        dispatch(
          friendsActions.refresh({ type: "add", name: "all", value: data })
        );
      },

      serverList: data => {
        dispatch(
          serversActions.refresh({ type: "add", name: "items", value: data })
        );
      },

      channelList: data => {
        dispatch(
          channelsActions.refresh({ type: "add", name: "items", value: data })
        );
      },

      newChannel: data => {
        dispatch(
          channelsActions.update({
            type: "add",
            name: "items",
            value: data,
          })
        );
      },

      newServer: data => {
        dispatch(
          serversActions.update({ type: "add", name: "items", value: data })
        );
      },

      newUserInfo: data => {
        dispatch(
          userListActions.update({ type: "add", name: "items", value: data })
        );
      },

      serverUsers: data => {
        data.forEach(user => {
          dispatch(
            userListActions.update({ type: "add", name: "items", value: user })
          );
        });
      },

      joinUserVoiceChannelInChannel: data => {
        dispatch(
          channelsActions.mutationOnlineUser({
            type: "add",
            name: "items",
            value: data,
          })
        );
        playSound(discordJoin);
      },

      leftUserVoiceChannelInChannel: data => {
        dispatch(
          channelsActions.mutationOnlineUser({
            type: "remove",
            name: "items",
            value: data,
          })
        );
        playSound(discordLeave);
      },
    });
  }, [token, socket.connected, userID]);

  useEffect(() => {
    let mount = true;
    let id = null;

    const unsubscribeSocket = subscribe(socket, {
      disconnect: () => {
        toast.error("Server ile bağlantı kesildi.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },

      data: data => {
        dispatch(
          friendsActions.refresh({
            name: "onlineUsers",
            value: data.onlineUsers,
          })
        );
        dispatch(userActions.refresh({ name: "id", value: data.userId }));
        dispatch(userActions.refresh({ name: "name", value: data.name }));
        dispatch(userActions.refresh({ name: "code", value: data.code }));
      },
    });

    const unsubscribeManager = subscribe(socket.io, {
      reconnect_attempt: () => {
        if (!mount) return;
        id = toast.loading("Server'a bağlanılmaya çalışılıyor.", {
          position: "bottom-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        mount = false;
      },

      reconnect: () => {
        if (mount) return;
        setTimeout(() => {
          toast.update(id, {
            render: "Server ile bağlantı tekrar kuruldu",
            type: toast.TYPE.SUCCESS,
            isLoading: false,
            autoClose: 1500,
          });
        }, 1000);
        socket.emit("configuration", {
          token: localStorage.getItem("accessToken"),
        });
        mount = true;
      },
    });

    return () => {
      unsubscribeSocket();
      unsubscribeManager();
    };
  }, []);
  return null;
};

export default connect()(SocketController);
