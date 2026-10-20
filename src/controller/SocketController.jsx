import { useEffect, useContext, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { messageActions } from "store";
import { userActions } from "store";
import { friendsActions, streamActions } from "store";
import { SocketContext } from "./Context";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { channelKey, clearTyping, dmKey, startTyping, stopTyping } from "controller/typing";
import { serversActions } from "store";
import { userListActions } from "store";
import messageSound from "assets/audio/discordMessage.mp3";
import joinSound from "assets/audio/discordJoin.wav";
import leaveSound from "assets/audio/discordLeave.mp3";

import { channelsActions } from "store";
import { toast } from "react-toastify";
import { clearSpeaking, setSpeaking } from "controller/speaking";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Read by listeners that are registered once
  const userIdRef = useRef(userID);
  userIdRef.current = userID;

  useEffect(() => {
    if (location.pathname !== "/") {
      socket.emit("configuration", {
        token: localStorage.getItem("accessToken"),
      });
    }
    if (!token || !socket.connected || !userID) return;

    const audio = new Audio(messageSound);

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
        const [msg] = message;
        if (msg && msg.sender !== userID) playSound(audio);
        // Whoever sent a message has stopped typing it
        if (msg) {
          const key = msg.serverName
            ? channelKey(msg.serverName, msg.channelName)
            : dmKey(msg.sender === userID ? msg.receiver : msg.sender);
          stopTyping(key, msg.sender);
        }
        dispatch(messageActions.overWrite({ name: "items", value: message }));
      },

      // Reactions or link previews of a message changed
      messageUpdated: data => {
        dispatch(messageActions.patch(data));
      },

      typing: data => {
        const key = data.receiver
          ? dmKey(data.userId)
          : channelKey(data.serverName, data.channelName);
        startTyping(key, data.userId, data.name);
      },

      // Someone (maybe us, in another tab) changed their username
      userUpdated: data => {
        dispatch(userListActions.update({ type: "add", name: "items", value: data }));
        dispatch(friendsActions.renameUser(data));
        if (data.id === userID) dispatch(userActions.refresh({ name: "name", value: data.name }));
      },

      // The password was changed on another device
      sessionEnded: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        delete axios.defaults.headers.common["Authorization"];
        dispatch(userActions.delete());
        navigate("/auth/login");
        toast.info("Şifren değiştirildiği için bu cihazda oturumun kapatıldı.");
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

    });
  }, [token, socket.connected, userID]);

  // Server, channel and voice channel events are listened to from the start:
  // a list that arrives before our user id is known must not be dropped
  useEffect(() => {
    let mount = true;
    let id = null;
    const discordJoin = new Audio(joinSound);
    const discordLeave = new Audio(leaveSound);

    const unsubscribeSocket = subscribe(socket, {
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

      channelUpdated: data => {
        dispatch(channelsActions.rename(data));
      },

      // Pages showing the channel move on by themselves (see ServerHeader)
      channelDeleted: data => {
        dispatch(channelsActions.update({ type: "remove", name: "items", value: data }));
        dispatch(messageActions.removeChannel({ serverID: data.serverID, channelID: data._id }));
      },

      newServer: data => {
        dispatch(
          serversActions.update({ type: "add", name: "items", value: data })
        );
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
        setSpeaking(data._id, false);
        dispatch(
          channelsActions.mutationOnlineUser({
            type: "remove",
            name: "items",
            value: data,
          })
        );
        playSound(discordLeave);
      },

      // The full member list of a voice channel, sent after every join/leave:
      // replaces our copy, which also repairs anything we missed
      voiceChannelUsers: data => {
        dispatch(
          channelsActions.setChannelUsers({
            channelID: data.channelID,
            users: data.users,
          })
        );
      },

      voiceSpeaking: data => {
        // Our own ring is driven by the microphone directly, without the round trip
        if (data.userId === userIdRef.current) return;
        setSpeaking(data.userId, data.speaking);
      },

      voiceState: data => {
        dispatch(
          channelsActions.setVoiceState({
            userId: data.userId,
            selfMute: data.selfMute,
            selfDeaf: data.selfDeaf,
          })
        );
      },

      voiceScreenShare: data => {
        dispatch(
          channelsActions.setStreaming({
            userId: data.userId,
            streaming: data.sharing,
          })
        );
      },

      disconnect: () => {
        // We no longer hear about others stopping, so drop every ring
        clearSpeaking();
        clearTyping();
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
        // The server now knows who we are. Fetch the servers and voice channels
        // again: this also catches up on anything missed while reconnecting.
        socket.emit("getServerList");
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
