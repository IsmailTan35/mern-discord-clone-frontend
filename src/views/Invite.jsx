import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext, url } from "controller/Context";
import { withRedirect } from "common/redirect";

import "assets/css/auth.css";
import "assets/css/invite.css";

const initials = name =>
  String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(word => word[0])
    .join("");

// What an invite link opens: the server's card and a button to join it.
// Works logged out too; joining then goes through the login page and back.
const Invite = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | invalid
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  // Joined, waiting for the server to arrive over the socket before opening it
  const [joined, setJoined] = useState(null);
  const socket = useContext(SocketContext);
  const serverList = useSelector(state => state.server.items);
  const loggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    let active = true;
    axios
      .get(`/invite/${encodeURIComponent(code)}`)
      .then(res => {
        if (!active) return;
        setInvite(res.data);
        setStatus("ready");
      })
      .catch(() => active && setStatus("invalid"));
    return () => {
      active = false;
    };
  }, [code]);

  const goToServer = (serverID, channelID) =>
    navigate(channelID ? `/channels/${serverID}/${channelID}` : "/channels/@me");

  // The server page sends visitors of unknown servers away, so open it only
  // once the new server is in our list (asking for the list again if needed)
  useEffect(() => {
    if (!joined) return;
    if (serverList.some(server => server._id === joined.serverID)) {
      goToServer(joined.serverID, joined.channelID);
      return;
    }
    const timer = setTimeout(() => socket.emit("getServerList"), 1500);
    return () => clearTimeout(timer);
  }, [joined, serverList]);

  const join = () => {
    if (!loggedIn) {
      navigate(withRedirect("/auth/login", `/invite/${code}`));
      return;
    }
    if (invite.isMember) {
      goToServer(invite.serverID, invite.channelID);
      return;
    }
    setJoining(true);
    setError("");
    axios
      .post("/server/join", { inviteCode: code })
      .then(res => setJoined({ serverID: res.data.serverID, channelID: res.data.channelID }))
      .catch(err => {
        setJoining(false);
        setError(
          err.response && err.response.status === 401
            ? "Oturumun sona ermiş, tekrar giriş yap."
            : "Sunucuya katılınamadı, tekrar dene."
        );
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="invite-card">
        {status === "loading" && <div className="invite-loading">Davet yükleniyor...</div>}

        {status === "invalid" && (
          <>
            <div className="invite-icon invalid">?</div>
            <h3 className="invite-title">Davet Geçersiz</h3>
            <p className="invite-text">
              Bu davetin süresi dolmuş olabilir ya da bu davete katılma iznin olmayabilir.
            </p>
            <button type="button" className="auth-button" onClick={() => navigate(loggedIn ? "/channels/@me" : "/")}>
              Discord'a Devam Et
            </button>
          </>
        )}

        {status === "ready" && (
          <>
            {invite.serverpicture ? (
              <img
                className="invite-icon"
                src={`${url}icon/server/${invite.serverpicture}`}
                alt=""
              />
            ) : (
              <div className="invite-icon">{initials(invite.servername)}</div>
            )}
            <div className="invite-subtitle">
              {invite.isMember ? "Zaten bu sunucunun üyesisin" : "Bir sunucuya katılmaya davet edildin"}
            </div>
            <h3 className="invite-title">{invite.servername}</h3>
            <div className="invite-counts">
              <span>
                <span className="invite-dot online" />
                {invite.onlineCount} Çevrimiçi
              </span>
              <span>
                <span className="invite-dot" />
                {invite.memberCount} Üye
              </span>
            </div>
            <button type="button" className="auth-button" disabled={joining} onClick={join}>
              {!loggedIn
                ? "Katılmak için Giriş Yap"
                : invite.isMember
                ? "Sunucuya Git"
                : joining
                ? "Katılınıyor..."
                : "Davete Katıl"}
            </button>
            {!loggedIn && (
              <button
                type="button"
                className="auth-links-button invite-register"
                onClick={() => navigate(withRedirect("/auth/register", `/invite/${code}`))}
              >
                Hesabın yok mu? Kaydol
              </button>
            )}
            {error && <div className="invite-error">{error}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default Invite;
