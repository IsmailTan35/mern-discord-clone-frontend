import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as HashIcon } from "assets/img/hashIcon.svg";
import { ReactComponent as VoiceIcon } from "assets/img/voiceIcon.svg";
import { SocketContext } from "controller/Context";
import DiscordModal, { ModalField } from "components/modal/DiscordModal";
import serverError from "common/serverErrors";

const TYPES = [
  {
    type: "text",
    title: "Metin",
    description: "Mesaj, resim, emoji, fikir ve şaka gönder",
    Icon: HashIcon,
  },
  {
    type: "voice",
    title: "Ses",
    description: "Sesli konuşun ve ekran paylaşın",
    Icon: VoiceIcon,
  },
];

const iconStyle = { width: 20, height: 20 };

// What the server will store: text channels are lower case with dashes
const previewName = (name, type) =>
  type === "voice"
    ? name
    : name.toLocaleLowerCase("tr").replace(/\s+/g, "-");

// Creates a channel (`channel` empty) or renames / deletes `channel`.
// Only the server owner sees the buttons that open this.
const ChannelModal = ({ serverID, channel, initialType = "text", onClose }) => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const editing = !!channel;
  const [type, setType] = useState(editing ? channel.type : initialType);
  const [name, setName] = useState(editing ? channel.channelname : "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const request = (event, data, onDone) => {
    setBusy(true);
    setError("");
    socket.timeout(8000).emit(event, data, (timeoutError, result) => {
      setBusy(false);
      if (timeoutError || !result) return setError("Sunucu yanıt vermedi, tekrar dene.");
      if (!result.ok) return setError(serverError(result));
      onDone(result);
    });
  };

  const submit = event => {
    event.preventDefault();
    if (!name.trim()) return setError("Bir kanal adı gir.");
    if (editing) {
      request("updateChannel", { channelID: channel._id, name }, onClose);
    } else {
      request("createChannel", { serverID, name, type }, result => {
        onClose();
        // A new text channel opens right away, like in Discord
        if (result.channel && result.channel.type === "text")
          navigate(`/channels/${serverID}/${result.channel._id}`);
      });
    }
  };

  if (confirmDelete) {
    return (
      <DiscordModal
        title="Kanalı Sil"
        onClose={onClose}
        footer={
          <>
            <button type="button" className="dmodal-button link" onClick={() => setConfirmDelete(false)}>
              İptal
            </button>
            <button
              type="button"
              className="dmodal-button danger"
              disabled={busy}
              onClick={() => request("deleteChannel", { channelID: channel._id }, onClose)}
            >
              Kanalı Sil
            </button>
          </>
        }
      >
        <p className="dmodal-text">
          <strong>{channel.type === "text" ? "#" : ""}{channel.channelname}</strong> kanalını silmek
          istediğinden emin misin? Bu işlem geri alınamaz
          {channel.type === "text" ? " ve kanalın bütün mesajları da silinir." : "."}
        </p>
        {error && <p className="dmodal-text" style={{ color: "#fa777c", marginTop: 12 }}>{error}</p>}
      </DiscordModal>
    );
  }

  const Icon = type === "voice" ? VoiceIcon : HashIcon;

  return (
    <DiscordModal
      title={editing ? "Kanalı Düzenle" : "Kanal Oluştur"}
      subtitle={editing ? null : type === "voice" ? "Ses Kanalları kategorisinde" : "Metin Kanalları kategorisinde"}
      onClose={onClose}
      footer={
        <>
          {editing && (
            <button type="button" className="dmodal-button link danger-text" onClick={() => setConfirmDelete(true)}>
              Kanalı Sil
            </button>
          )}
          <button type="button" className="dmodal-button link" onClick={onClose}>
            İptal
          </button>
          <button type="submit" form="channel-form" className="dmodal-button" disabled={busy || !name.trim()}>
            {editing ? "Değişiklikleri Kaydet" : "Kanal Oluştur"}
          </button>
        </>
      }
    >
      <form id="channel-form" onSubmit={submit}>
        {!editing && (
          <div className="dmodal-field">
            <span className="dmodal-label">Kanal Türü</span>
            {TYPES.map(option => (
              <div
                key={option.type}
                role="radio"
                aria-checked={type === option.type}
                tabIndex={0}
                className={`dmodal-choice${type === option.type ? " selected" : ""}`}
                onClick={() => setType(option.type)}
                onKeyDown={event => (event.key === " " || event.key === "Enter") && setType(option.type)}
              >
                <span className="dmodal-choice-icon">
                  <option.Icon style={iconStyle} />
                </span>
                <span className="dmodal-choice-text">
                  <div className="dmodal-choice-title">{option.title}</div>
                  <div className="dmodal-choice-description">{option.description}</div>
                </span>
                <span className="dmodal-radio" />
              </div>
            ))}
          </div>
        )}
        <ModalField label="Kanal Adı" error={error}>
          <div className="dmodal-input-prefixed">
            <Icon style={{ width: 16, height: 16 }} />
            <input
              autoFocus
              className="dmodal-input"
              maxLength={100}
              placeholder={type === "voice" ? "Yeni Ses Kanalı" : "yeni-kanal"}
              value={name}
              onChange={event => setName(previewName(event.target.value, type))}
            />
          </div>
        </ModalField>
      </form>
    </DiscordModal>
  );
};

export default ChannelModal;
