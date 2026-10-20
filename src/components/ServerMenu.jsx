import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ChannelModal from "components/modal/ChannelModal";
import DiscordModal from "components/modal/DiscordModal";

import "assets/css/servermenu.css";

export const inviteLink = code => `${window.location.origin}/invite/${code}`;

const copy = text => {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  return Promise.reject(new Error("no clipboard"));
};

const Chevron = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    {open ? (
      <path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z" />
    ) : (
      <path fill="currentColor" d="M16.59 8.59003L12 13.17L7.41 8.59003L6 10L12 16L18 10L16.59 8.59003Z" />
    )}
  </svg>
);

const InviteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M21 3H24V5H21V8H19V5H16V3H19V0H21V3ZM10 12C12.205 12 14 10.205 14 8C14 5.795 12.205 4 10 4C7.795 4 6 5.795 6 8C6 10.205 7.795 12 10 12ZM10 13C5.289 13 2 15.467 2 19V20H18V19C18 15.467 14.711 13 10 13Z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M19 2H8a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2V4a2 2 0 00-2-2zm0 14H8V4h11v12zM4 8H2v12a2 2 0 002 2h12v-2H4V8z" />
  </svg>
);

export const InviteModal = ({ server, onClose }) => {
  const [copied, setCopied] = useState(false);
  const link = inviteLink(server.inviteCode);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <DiscordModal
      title={
        <>
          Arkadaşlarını <span className="invite-server-name">{server.servername}</span> sunucusuna davet et
        </>
      }
      onClose={onClose}
    >
      <div className="dmodal-label">Bir sunucu davet bağlantısını arkadaşına gönder</div>
      <div className={`invite-link${copied ? " copied" : ""}`}>
        <input className="invite-link-input" readOnly value={link} onFocus={event => event.target.select()} />
        <button
          type="button"
          className={`dmodal-button${copied ? " success" : ""}`}
          onClick={() => copy(link).then(() => setCopied(true), () => toast.error("Kopyalanamadı, bağlantıyı elle seç."))}
        >
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>
      <div className="invite-note">Bu davet bağlantısının süresi dolmaz.</div>
    </DiscordModal>
  );
};

// The server name at the top of the channel list, opening Discord's server menu
const ServerMenu = ({ server }) => {
  const userId = useSelector(state => state.user.id);
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(null); // "invite" | "channel"
  const ref = useRef(null);
  const isOwner = !!server.ownerID && server.ownerID === userId;

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = event => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = event => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open]);

  const choose = action => () => {
    setOpen(false);
    if (action === "copy") {
      copy(server.inviteCode).then(
        () => toast.success("Davet kodu kopyalandı.", { autoClose: 1500 }),
        () => toast.error("Kopyalanamadı.")
      );
      return;
    }
    setDialog(action);
  };

  return (
    <div className="server-menu" ref={ref}>
      <button
        type="button"
        className={`dashboard-navbar-server-name server-menu-button${open ? " open" : ""}`}
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <span className="server-menu-name">{server.servername}</span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="server-menu-popout" role="menu">
          <button type="button" role="menuitem" className="server-menu-item invite" onClick={choose("invite")}>
            İnsanları Davet Et
            <InviteIcon />
          </button>
          {isOwner && (
            <button type="button" role="menuitem" className="server-menu-item" onClick={choose("channel")}>
              Kanal Oluştur
              <PlusIcon />
            </button>
          )}
          <div className="server-menu-separator" />
          <button type="button" role="menuitem" className="server-menu-item" onClick={choose("copy")}>
            Davet Kodunu Kopyala
            <CopyIcon />
          </button>
        </div>
      )}
      {dialog === "invite" && <InviteModal server={server} onClose={() => setDialog(null)} />}
      {dialog === "channel" && <ChannelModal serverID={server._id} onClose={() => setDialog(null)} />}
    </div>
  );
};

export default ServerMenu;
