import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { SocketContext } from "controller/Context";
import { cancelReply, onFocusRequest, useReplyTarget } from "controller/composer";
import { keyForPath, useTyping } from "controller/typing";
import { useServerMembers } from "controller/serverMembers";
import { replaceShortcodes, searchEmoji } from "common/emojiData";
import EmojiPicker from "components/EmojiPicker";
import AvatarPicture from "components/AvatarPicture";
import { useNameOf } from "components/chat/ChatMessage";

import "assets/css/chat.css";

const MAX_LENGTH = 2000;
// Show how many characters are left once this close to the limit
const COUNTER_FROM = 1800;
// How often "typing" is sent while typing; the others show it for 8 seconds
const TYPING_INTERVAL_MS = 3000;
const SUGGESTION_LIMIT = 8;

const SPECIAL_MENTIONS = [
  { id: "everyone", name: "everyone", description: "Bu kanalı görebilen herkese bildirim gönder." },
  { id: "here", name: "here", description: "Bu kanalda çevrimiçi olan herkese bildirim gönder." },
];

const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// "@name" written for a known person becomes <@id> when the message is sent
const encodeMentions = (text, people) =>
  [...people]
    .sort((a, b) => b.name.length - a.name.length)
    .reduce(
      (result, person) =>
        result.replace(
          new RegExp(`(^|[\\s(])@${escapeRegExp(person.name)}(?=$|[\\s.,!?:;)])`, "gi"),
          `$1<@${person.id}>`
        ),
      text
    );

// The @mention or :emoji being typed just before the caret
const findTrigger = (text, caret) => {
  const before = text.slice(0, caret);
  const mention = before.match(/(^|\s)@([^\s@]{0,32})$/);
  if (mention) return { type: "mention", query: mention[2], start: caret - mention[2].length - 1 };
  const emoji = before.match(/(^|\s):([a-z0-9_+-]{2,})$/i);
  if (emoji) return { type: "emoji", query: emoji[2], start: caret - emoji[2].length - 1 };
  return null;
};

const EmojiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-3.5 6a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 18c-2.582 0-4.737-1.774-5.341-4h10.682c-.604 2.226-2.759 4-5.341 4z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z"
    />
  </svg>
);

const GiftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M16.886 7.999H20C21.104 7.999 22 8.896 22 9.999V11.999H2V9.999C2 8.896 2.897 7.999 4 7.999H7.114C6.663 7.764 6.236 7.477 5.879 7.121C4.709 5.951 4.709 4.048 5.879 2.879C7.012 1.746 8.986 1.746 10.121 2.877C11.758 4.514 11.979 7.595 11.998 7.941H12.002C12.022 7.596 12.242 4.515 13.879 2.878C15.014 1.745 16.986 1.746 18.121 2.877C19.29 4.049 19.29 5.952 18.121 7.121C17.764 7.477 17.337 7.764 16.886 7.999ZM3 13.999V19.999C3 21.102 3.897 21.999 5 21.999H11V13.999H3ZM13 13.999V21.999H19C20.104 21.999 21 21.102 21 19.999V13.999H13Z"
    />
  </svg>
);

const GifIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M2 2C0.895431 2 0 2.89543 0 4V20C0 21.1046 0.89543 22 2 22H22C23.1046 22 24 21.1046 24 20V4C24 2.89543 23.1046 2 22 2H2ZM9.76445 11.448V15.48C8.90045 16.044 7.88045 16.356 6.74045 16.356C4.11245 16.356 2.66045 14.628 2.66045 12.072C2.66045 9.504 4.23245 7.764 6.78845 7.764C7.80845 7.764 8.66045 8.004 9.32045 8.376L9.04445 10.164C8.42045 9.768 7.68845 9.456 6.83645 9.456C5.40845 9.456 4.71245 10.512 4.71245 12.06C4.71245 13.62 5.43245 14.712 6.86045 14.712C7.31645 14.712 7.64045 14.616 7.97645 14.448V12.972H6.42845V11.448H9.76445ZM11.5481 7.92H13.6001V16.2H11.5481V7.92ZM20.4724 7.92V9.636H17.5564V11.328H19.8604V13.044H17.5564V16.2H15.5164V7.92H20.4724Z"
    />
  </svg>
);

const TypingIndicator = ({ conversationKey, myId }) => {
  const typing = useTyping(conversationKey);
  const names = Object.entries(typing)
    .filter(([userId]) => userId !== myId)
    .map(([, name]) => name);
  if (names.length === 0) return <div className="chat-typing" />;

  let text;
  if (names.length === 1) text = <><strong>{names[0]}</strong> yazıyor...</>;
  else if (names.length === 2) text = <><strong>{names[0]}</strong> ve <strong>{names[1]}</strong> yazıyor...</>;
  else if (names.length === 3)
    text = <><strong>{names[0]}</strong>, <strong>{names[1]}</strong> ve <strong>{names[2]}</strong> yazıyor...</>;
  else text = "Birkaç kişi yazıyor...";

  return (
    <div className="chat-typing" aria-live="polite">
      <span className="chat-typing-dots">
        <span />
        <span />
        <span />
      </span>
      <span>{text}</span>
    </div>
  );
};

const Suggestions = ({ suggestion, selected, onPick, onHover }) => (
  <div className="chat-suggestions" role="listbox">
    <div className="chat-suggestions-title">
      {suggestion.type === "mention" ? "Üyeler" : `:${suggestion.query} ile eşleşen emojiler`}
    </div>
    {suggestion.items.map((item, index) => (
      <div
        key={item.id || item.name}
        role="option"
        aria-selected={index === selected}
        className={`chat-suggestion${index === selected ? " selected" : ""}`}
        onMouseDown={event => {
          // Keep the focus in the text box
          event.preventDefault();
          onPick(item);
        }}
        onMouseEnter={() => onHover(index)}
      >
        {suggestion.type === "mention" ? (
          item.special ? (
            <>
              <span className="chat-suggestion-name">@{item.name}</span>
              <span className="chat-suggestion-detail">{item.description}</span>
            </>
          ) : (
            <>
              <span className="chat-suggestion-avatar">
                <AvatarPicture />
              </span>
              <span className="chat-suggestion-name">{item.name}</span>
              <span className="chat-suggestion-detail">{item.code ? `${item.name}#${item.code}` : ""}</span>
            </>
          )
        ) : (
          <>
            <span className="chat-suggestion-emoji">{item.emoji}</span>
            <span className="chat-suggestion-name">:{item.name}:</span>
          </>
        )}
      </div>
    ))}
  </div>
);

const ChatInput = ({ user }) => {
  const socket = useContext(SocketContext);
  const location = useLocation();
  const myUser = useSelector(state => state.user);
  const userList = useSelector(state => state.userList.items);
  const nameOf = useNameOf();
  const [message, setMessage] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [selected, setSelected] = useState(0);
  const [picker, setPicker] = useState(false);
  const textRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const lastTypingAt = useRef(0);

  const parsedLocation = location.pathname.split("/");
  const isDirect = parsedLocation.includes("@me");
  const serverID = parsedLocation[2];
  const targetId = parsedLocation[3];
  const conversationKey = keyForPath(location.pathname);
  const replyTo = useReplyTarget(conversationKey);
  const serverMembers = useServerMembers(isDirect ? null : serverID);

  // The people who can be mentioned here
  const people = useMemo(() => {
    if (!isDirect) return serverMembers.map(member => ({ id: member.id, name: member.name, code: member.code }));
    const friend = userList.find(item => item.id === targetId);
    return [
      ...(friend ? [{ id: friend.id, name: friend.name, code: friend.code }] : []),
      ...(myUser.id ? [{ id: myUser.id, name: myUser.name, code: myUser.code }] : []),
    ];
  }, [isDirect, serverMembers, userList, targetId, myUser.id, myUser.name, myUser.code]);

  // Each conversation starts with an empty box
  useEffect(() => {
    setMessage("");
    setSuggestion(null);
    lastTypingAt.current = 0;
  }, [conversationKey]);

  useEffect(() => onFocusRequest(() => textRef.current && textRef.current.focus()), []);

  // The box grows with its text, up to half the window
  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, window.innerHeight / 2)}px`;
  }, [message]);

  const conversation = isDirect
    ? { receiver: targetId }
    : { serverName: serverID, channelName: targetId };

  const sendTyping = () => {
    const now = Date.now();
    if (now - lastTypingAt.current < TYPING_INTERVAL_MS) return;
    lastTypingAt.current = now;
    socket.emit("typing", conversation);
  };

  const updateSuggestions = (text, caret) => {
    const trigger = findTrigger(text, caret);
    if (!trigger) return setSuggestion(null);
    let items;
    if (trigger.type === "mention") {
      const q = trigger.query.toLocaleLowerCase("tr");
      items = [
        ...people.filter(person => person.name.toLocaleLowerCase("tr").startsWith(q)),
        ...(isDirect ? [] : SPECIAL_MENTIONS.filter(item => item.name.startsWith(q)).map(item => ({ ...item, special: true }))),
      ].slice(0, SUGGESTION_LIMIT);
    } else {
      items = searchEmoji(trigger.query, SUGGESTION_LIMIT);
    }
    if (items.length === 0) return setSuggestion(null);
    setSuggestion({ ...trigger, items });
    setSelected(0);
  };

  const insertAt = (start, end, text) => {
    const next = message.slice(0, start) + text + message.slice(end);
    const caret = start + text.length;
    setMessage(next);
    requestAnimationFrame(() => {
      const element = textRef.current;
      if (!element) return;
      element.focus();
      element.setSelectionRange(caret, caret);
    });
  };

  const pickSuggestion = item => {
    const caret = textRef.current ? textRef.current.selectionStart : message.length;
    if (suggestion.type === "mention") insertAt(suggestion.start, caret, `@${item.name} `);
    else insertAt(suggestion.start, caret, item.emoji);
    setSuggestion(null);
  };

  const send = () => {
    const text = message.trim();
    if (!text || text.length > MAX_LENGTH || !user) return;
    socket.emit("sendMessage", {
      ...(isDirect ? { receiver: targetId, serverName: null, channelName: null } : { receiver: null, ...conversation }),
      message: replaceShortcodes(encodeMentions(text, people)),
      replyTo: replyTo ? replyTo._id || replyTo.messageId : null,
    });
    setMessage("");
    setSuggestion(null);
    cancelReply();
    lastTypingAt.current = 0;
  };

  const handleKeyDown = event => {
    if (suggestion) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        setSelected(index => (index + step + suggestion.items.length) % suggestion.items.length);
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        pickSuggestion(suggestion.items[selected]);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setSuggestion(null);
        return;
      }
    }
    if (event.key === "Escape" && replyTo) {
      event.stopPropagation();
      cancelReply();
      return;
    }
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  };

  const handleChange = event => {
    const text = event.target.value;
    setMessage(text);
    if (text.trim()) sendTyping();
    updateSuggestions(text, event.target.selectionStart);
  };

  const insertEmoji = emoji => {
    const element = textRef.current;
    const start = element ? element.selectionStart : message.length;
    const end = element ? element.selectionEnd : message.length;
    insertAt(start, end, emoji);
  };

  const placeholder = isDirect
    ? `@${user && user.name ? user.name : ""} kişisine mesaj gönder`
    : `#${user && user.channelname ? user.channelname : ""} kanalına mesaj gönder`;
  const remaining = MAX_LENGTH - message.length;

  return (
    <div className="chat-input-wrapper">
      {suggestion && (
        <Suggestions suggestion={suggestion} selected={selected} onPick={pickSuggestion} onHover={setSelected} />
      )}
      {replyTo && (
        <div className="chat-reply-bar">
          <span>
            <strong>{nameOf(replyTo.sender) || "bilinmeyen-kullanıcı"}</strong> kişisine yanıt veriliyor
          </span>
          <button type="button" className="chat-reply-cancel" title="Yanıtı iptal et" onClick={cancelReply}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.7 13.3l-1.4 1.4L12 13.4l-3.3 3.3-1.4-1.4L10.6 12 7.3 8.7l1.4-1.4L12 10.6l3.3-3.3 1.4 1.4L13.4 12l3.3 3.3z" />
            </svg>
          </button>
        </div>
      )}
      <div className={`chat-input-second-wrapper${replyTo ? " replying" : ""}`}>
        <div className="chat-input-icon disabled" title="Yakında">
          <PlusIcon />
        </div>
        <div className="chat-input">
          <textarea
            ref={textRef}
            rows={1}
            placeholder={placeholder}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onClick={event => updateSuggestions(message, event.target.selectionStart)}
            onBlur={() => setSuggestion(null)}
            aria-label={placeholder}
          />
        </div>
        {message.length > COUNTER_FROM && (
          <div className={`chat-input-counter${remaining < 0 ? " over" : ""}`} title="Kalan karakter">
            {remaining}
          </div>
        )}
        <div className="chat-input-icons">
          <div className="chat-input-icon disabled" title="Yakında">
            <GiftIcon />
          </div>
          <div className="chat-input-icon disabled" title="Yakında">
            <GifIcon />
          </div>
          <button
            ref={emojiButtonRef}
            type="button"
            className={`chat-input-icon emoji${picker ? " active" : ""}`}
            title="Emoji seç"
            onClick={() => setPicker(open => !open)}
          >
            <EmojiIcon />
          </button>
        </div>
      </div>
      <TypingIndicator conversationKey={conversationKey} myId={myUser.id} />
      {picker && (
        <EmojiPicker anchor={emojiButtonRef.current} onSelect={insertEmoji} onClose={() => setPicker(false)} />
      )}
    </div>
  );
};

export default ChatInput;
