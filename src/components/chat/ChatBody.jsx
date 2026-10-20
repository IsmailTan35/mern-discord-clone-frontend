import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { SocketContext } from "controller/Context";
import { keyForPath } from "controller/typing";
import ChatMessage from "components/chat/ChatMessage";

// Messages from the same person within this time are shown as one group
const GROUP_WINDOW_MS = 7 * 60 * 1000;
// Closer than this to the bottom counts as "reading the newest messages"
const STICK_TO_BOTTOM_PX = 120;

const idOf = message => message._id || message.messageId;

const ChatBody = () => {
  const ref = useRef(null);
  const atBottom = useRef(true);
  const location = useLocation();
  const socket = useContext(SocketContext);
  const myUser = useSelector(state => state.user);
  const rawMessages = useSelector(state => state.message.items);
  const userList = useSelector(state => state.userList.items);
  const conversationKey = keyForPath(location.pathname);

  const parsedLocation = location.pathname.split("/");
  const isDirect = parsedLocation.includes("@me");
  const first = parsedLocation[2];
  const second = parsedLocation[3];

  useEffect(() => {
    if (!isDirect || !second) return;
    if (!userList.find(user => user.id === second)) socket.emit("getUserInfo", { userId: second });
  }, [isDirect, second, userList]);

  const messages = useMemo(
    () =>
      isDirect
        ? rawMessages.filter(
            message =>
              (message.sender === second && message.receiver === myUser.id) ||
              (message.sender === myUser.id && message.receiver === second)
          )
        : rawMessages.filter(
            message => message.serverName == first && message.channelName == second
          ),
    [rawMessages, isDirect, first, second, myUser.id]
  );

  const byId = useMemo(() => new Map(messages.map(message => [idOf(message), message])), [messages]);

  // A new conversation opens at its newest message
  useLayoutEffect(() => {
    atBottom.current = true;
  }, [conversationKey]);

  // New messages and link previews keep the view at the bottom, unless the
  // user scrolled up to read older ones
  useLayoutEffect(() => {
    if (atBottom.current && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  const handleScroll = () => {
    const element = ref.current;
    atBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < STICK_TO_BOTTOM_PX;
  };

  // Clicking a reply's preview scrolls to the original and flashes it
  const jumpTo = useCallback(id => {
    const target = ref.current && ref.current.querySelector(`[data-message-id="${id}"]`);
    if (!target) return;
    target.scrollIntoView({ block: "center", behavior: "smooth" });
    target.classList.remove("flash");
    void target.offsetWidth;
    target.classList.add("flash");
  }, []);

  return (
    <div className="chat-body-wrapper" ref={ref} onScroll={handleScroll}>
      <div className="chat-body-spacer" />
      {messages.map((message, index) => {
        const previous = messages[index - 1];
        const compact =
          !!previous &&
          previous.sender === message.sender &&
          new Date(message.timestamps) - new Date(previous.timestamps) < GROUP_WINDOW_MS;
        const replied = message.replyTo ? byId.get(message.replyTo) || null : undefined;
        return (
          <ChatMessage
            key={idOf(message)}
            message={message}
            compact={compact}
            replied={replied}
            conversationKey={conversationKey}
            onJump={jumpTo}
          />
        );
      })}
    </div>
  );
};

export default ChatBody;
