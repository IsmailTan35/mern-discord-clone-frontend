import AvatarPicture from "components/AvatarPicture";
import React, { useContext, useMemo, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { format, isToday, isYesterday } from "date-fns";
import { SocketContext } from "controller/Context";
import { startReply } from "controller/composer";
import { isJumboEmoji, renderMarkdown, toPlainText } from "common/markdown";
import EmojiPicker, {
  DEFAULT_QUICK_REACTIONS,
  getRecentEmoji,
  rememberEmoji,
} from "components/EmojiPicker";
import MessageEmbed from "components/chat/MessageEmbed";

const delay = { show: 50, hide: 0 };

// Like Discord: "Bugün 14:32", "Dün 09:10", otherwise the date
const formatTimestamp = date => {
  if (isToday(date)) return `Bugün saat ${format(date, "HH:mm")}`;
  if (isYesterday(date)) return `Dün saat ${format(date, "HH:mm")}`;
  return format(date, "dd.MM.yyyy HH:mm");
};

const AddReactionIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10h-2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8V2zm-3.5 9c.8 0 1.5-.7 1.5-1.5S9.3 8 8.5 8 7 8.7 7 9.5 7.7 11 8.5 11zm7 0c.8 0 1.5-.7 1.5-1.5S16.3 8 15.5 8 14 8.7 14 9.5s.7 1.5 1.5 1.5zM12 17.5c2.3 0 4.3-1.5 5.1-3.5H6.9c.8 2 2.8 3.5 5.1 3.5zM19 2v3h3v2h-3v3h-2V7h-3V5h3V2h2z"
    />
  </svg>
);

const ReplyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M10 8.26667V4L3 11.4667L10 18.9333V14.56C15 14.56 18.5 16.2667 21 20C20 14.6667 17 9.33333 10 8.26667Z" />
  </svg>
);

// Display names by user id, from our own user and the people we know of
export const useNameOf = () => {
  const myUser = useSelector(state => state.user);
  const userList = useSelector(state => state.userList.items);
  return useMemo(() => {
    const names = new Map(userList.map(user => [String(user.id), user.name]));
    if (myUser.id) names.set(String(myUser.id), myUser.name);
    return id => names.get(String(id)) || null;
  }, [myUser.id, myUser.name, userList]);
};

const Reactions = ({ message, myId, nameOf, onToggle, onAdd }) => (
  <div className="message-reactions">
    {message.reactions.map(reaction => {
      const users = reaction.users || [];
      const mine = users.includes(myId);
      const names = users.map(id => nameOf(id) || "biri").join(", ");
      return (
        <button
          key={reaction.emoji}
          type="button"
          className={`message-reaction${mine ? " mine" : ""}`}
          title={`${names} tepki verdi`}
          aria-pressed={mine}
          onClick={() => onToggle(reaction.emoji)}
        >
          <span className="message-reaction-emoji">{reaction.emoji}</span>
          <span className="message-reaction-count">{users.length}</span>
        </button>
      );
    })}
    <button type="button" className="message-reaction message-reaction-add" title="Tepki Ekle" onClick={onAdd}>
      <AddReactionIcon />
    </button>
  </div>
);

// `compact` messages continue the previous one from the same person: no avatar
// or name. `replied` is the message this one answers (null when it is gone).
const ChatMessage = ({ message, compact, replied, conversationKey, onJump }) => {
  const socket = useContext(SocketContext);
  const myId = useSelector(state => state.user.id);
  const nameOf = useNameOf();
  const [picker, setPicker] = useState(null); // anchor element of the open emoji picker
  const addButtonRef = useRef(null);

  const id = message._id || message.messageId;
  const date = new Date(message.timestamps);
  const userName = nameOf(message.sender) || "";
  const mentioned =
    !!myId &&
    (message.mentionEveryone ||
      (message.mentions || []).includes(myId) ||
      String(message.message).includes(`<@${myId}>`));
  const isReply = message.replyTo !== undefined && message.replyTo !== null;
  const reactions = message.reactions || [];
  const quickReactions = [...getRecentEmoji(), ...DEFAULT_QUICK_REACTIONS]
    .filter((emoji, index, list) => list.indexOf(emoji) === index)
    .slice(0, 3);

  const toggleReaction = emoji => {
    rememberEmoji(emoji);
    socket.emit("toggleReaction", { messageId: id, emoji });
  };

  const content = useMemo(
    () => renderMarkdown(message.message, { mentionName: nameOf }),
    [message.message, nameOf]
  );

  const timestamp = (
    <OverlayTrigger
      placement="top"
      delay={delay}
      overlay={props => (
        <Tooltip {...props}>{format(date, "EEEE, dd MMMM yyyy HH:mm")}</Tooltip>
      )}
    >
      <span className={compact ? "message-compact-time" : "message-time"}>
        {compact ? format(date, "HH:mm") : formatTimestamp(date)}
      </span>
    </OverlayTrigger>
  );

  return (
    <div
      className={`chat-body-message${compact && !isReply ? " compact" : ""}${mentioned ? " mentioned" : ""}${picker ? " active" : ""}`}
      data-message-id={id}
    >
      {isReply && (
        <div className="message-reply" onClick={() => replied && onJump(replied._id || replied.messageId)}>
          <span className="message-reply-spine" />
          {replied ? (
            <>
              <span className="message-reply-name">@{nameOf(replied.sender) || "bilinmeyen-kullanıcı"}</span>
              <span className="message-reply-text">{toPlainText(replied.message, nameOf)}</span>
            </>
          ) : (
            <span className="message-reply-text missing">Orijinal mesaj silindi</span>
          )}
        </div>
      )}
      <div className="message-row">
        <div className="chat-body-message-avatar">
          {compact && !isReply ? timestamp : <AvatarPicture />}
        </div>
        <div className="chat-body-message-text">
          {(!compact || isReply) && (
            <div className="message-header">
              <span className="chat-body-message-text-name">{userName}</span>
              {timestamp}
            </div>
          )}
          <div className={`chat-body-message-text-msg${isJumboEmoji(message.message) ? " jumbo" : ""}`}>
            {content}
          </div>
          {(message.embeds || []).map((embed, index) => (
            <MessageEmbed key={`${embed.url}-${index}`} embed={embed} />
          ))}
          {reactions.length > 0 && (
            <Reactions
              message={{ ...message, reactions }}
              myId={myId}
              nameOf={nameOf}
              onToggle={toggleReaction}
              onAdd={event => setPicker(event.currentTarget)}
            />
          )}
        </div>
      </div>

      <div className="message-toolbar" role="toolbar" aria-label="Mesaj işlemleri">
        {quickReactions.map(emoji => (
          <button key={emoji} type="button" className="message-toolbar-button emoji" title={`${emoji} ile tepki ver`} onClick={() => toggleReaction(emoji)}>
            {emoji}
          </button>
        ))}
        <span className="message-toolbar-divider" />
        <button
          ref={addButtonRef}
          type="button"
          className="message-toolbar-button"
          title="Tepki Ekle"
          onClick={() => setPicker(picker ? null : addButtonRef.current)}
        >
          <AddReactionIcon />
        </button>
        <button
          type="button"
          className="message-toolbar-button"
          title="Yanıtla"
          onClick={() => startReply(conversationKey, message)}
        >
          <ReplyIcon />
        </button>
      </div>

      {picker && (
        <EmojiPicker anchor={picker} onSelect={toggleReaction} onClose={() => setPicker(null)} />
      )}
    </div>
  );
};

export default React.memo(ChatMessage);
