import { useEffect, useContext } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { messageActions } from "store";
import { userActions } from "store";
import { friendsActions, streamActions, friendRequestActions } from "store";
import { SocketContext } from "./Context";
import { useLocation } from "react-router-dom";
import { serversActions } from "store";
import { userListActions } from "store";
import messageSound from "assets/audio/discordMessage.mp3";
import joinSound from "assets/audio/discordJoin.wav";
import leaveSound from "assets/audio/discordLeave.mp3";

import { channelsActions } from "store";
import axios from "axios";
import { toast } from "react-toastify";

const SocketController = () => {
  const socket = useContext(SocketContext);
  const token = useSelector(state => state.user.token);
  const userID = useSelector(state => state.user.id);
  const serverList = useSelector(state => state.server.items);
  const location = useLocation();
  const dispatch = useDispatch();

  const connectSocket = () => {
    const audio = new Audio(messageSound);
    const discordJoin = new Audio(joinSound);
    const discordLeave = new Audio(leaveSound);

    socket.on("connect", () => {
      if (location.pathname !== "/") {
        socket.emit("configuration", {
          token: localStorage.getItem("accessToken"),
        });
      }
    });

    socket.on("reconnect", () => {
      if (location.pathname !== "/") {
        socket.emit("configuration", {
          token: localStorage.getItem("accessToken"),
        });
      }
    });

    socket.on("reconnect_attempt", () => {});

    socket.on("allMessage", messages => {
      const count = messages.filter(
        message => message.readers && !message.readers.includes(userID)
      );

      // document.title =
      //   "(" +
      //   (count.length > 99 ? "+99" : count.length) +
      //   ") " +
      //   " Yeni Mesaj " +
      //   "Discord Clone";

      dispatch(messageActions.overWrite({ name: "items", value: messages }));
    });

    socket.on("newMessage", message => {
      audio.play();
      dispatch(messageActions.overWrite({ name: "items", value: message }));
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

    socket.on("channelList", data => {
      dispatch(
        channelsActions.refresh({ type: "add", name: "items", value: data })
      );
    });

    socket.on("newChannel", data => {
      console.log(2);

      dispatch(
        channelsActions.update({
          type: "add",
          name: "items",
          value: data,
        })
      );
    });

    socket.on("newServer", async data => {
      console.log(data);
      dispatch(
        serversActions.update({ type: "add", name: "items", value: data })
      );
      try {
        const res = await axios.get("/icon/server", {
          params: { picture: data.picture },
          responseType: "arraybuffer",
        });

        let base64 = Buffer.from(res.data, "binary").toString("base64");
        let image = `data`;
      } catch (error) {
        if (error) console.error(error);
      }
    });

    socket.on("newUserInfo", data => {
      dispatch(
        userListActions.update({ type: "add", name: "items", value: data })
      );
    });

    socket.on("serverUsers", data => {
      data.map(user => {
        dispatch(
          userListActions.update({ type: "add", name: "items", value: user })
        );
      });
    });

    socket.on("joinUserVoiceChannelInChannel", data => {
      dispatch(
        channelsActions.mutationOnlineUser({
          type: "add",
          name: "items",
          value: data,
        })
      );
      discordJoin.play();
    });

    socket.on("leftUserVoiceChannelInChannel", data => {
      dispatch(
        channelsActions.mutationOnlineUser({
          type: "remove",
          name: "items",
          value: data,
        })
      );
      discordLeave.play();
    });
  };

  useEffect(() => {
    let mount = true;
    if (location.pathname !== "/") {
      socket.emit("configuration", {
        token: localStorage.getItem("accessToken"),
      });
    }
    if (!token || !socket.connected || !userID) return;
    connectSocket();
    return () => {
      mount = false;
    };
  }, [token, socket.connected, userID]);

  useEffect(() => {
    let mount = true;
    let id = null;

    socket.on("disconnect", () => {
      toast.error("Server ile bağlantı kesildi.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    socket.io.on("reconnect_attempt", data => {
      if (!mount) return;
      id = toast.loading("Server'a bağlanılmaya çalışılıyor.", {
        position: "bottom-right",
        // autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      mount = false;
    });

    socket.io.on("reconnect", data => {
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
    });

    socket.io.on(" connect_error", () => {
      toast.loading("Server'a bağlanılmaya çalışılıyor.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });

    socket.on("data", data => {
      dispatch(
        friendsActions.refresh({ name: "onlineUsers", value: data.onlineUsers })
      );
      dispatch(userActions.refresh({ name: "id", value: data.userId }));
      dispatch(userActions.refresh({ name: "name", value: data.name }));
      dispatch(userActions.refresh({ name: "code", value: data.code }));
    });
  }, []);
  return null;
};

export default connect()(SocketController);
