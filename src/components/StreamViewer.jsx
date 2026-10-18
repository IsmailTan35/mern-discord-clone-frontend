import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "controller/Context";
import {
  closeStream,
  joinVoiceChannel,
  useVoiceState,
} from "controller/voiceChannel";
import {
  applyOutputSettings,
  subscribeVoiceSettings,
} from "common/voiceSettings";

import "assets/css/streamviewer.css";

// Watching someone's screen share in a voice channel
const StreamViewer = () => {
  const socket = useContext(SocketContext);
  const myUserId = useSelector(state => state.user.id);
  const channels = useSelector(state => state.channels.items);
  const voice = useVoiceState();
  const viewerRef = useRef(null);
  const videoRef = useRef(null);
  const { watching } = voice;

  const isMe = !!watching && watching.userId === myUserId;
  const stream = !watching
    ? null
    : isMe
    ? voice.screenStream
    : voice.remoteScreens[watching.userId] || null;
  const inChannel =
    !!watching &&
    !!voice.channel &&
    voice.channel.serverID === watching.serverID &&
    voice.channel.channelID === watching.channelID;
  const stillLive =
    !!watching &&
    channels.some(
      channel =>
        channel._id === watching.channelID &&
        (channel.onlineUser || []).some(
          user => user._id === watching.userId && user.streaming
        )
    );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = stream;
    if (stream) video.play().catch(() => {});
  }, [stream]);

  // The stream's sound follows the chosen speaker, volume and deafen button;
  // our own stream stays muted so we do not hear ourselves twice
  useEffect(() => {
    if (!watching) return;
    const options = { muted: isMe };
    applyOutputSettings(videoRef.current, undefined, options);
    return subscribeVoiceSettings(settings =>
      applyOutputSettings(videoRef.current, settings, options)
    );
  }, [watching]);

  useEffect(() => {
    if (!watching) return;
    const handleKeyDown = event => {
      if (event.key === "Escape" && !document.fullscreenElement) closeStream();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [watching]);

  if (!watching) return null;

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (viewerRef.current)
      viewerRef.current.requestFullscreen().catch(() => {});
  };

  let message = null;
  if (!stream && !stillLive) {
    message = <div>Yayın sona erdi.</div>;
  } else if (!inChannel && !isMe) {
    message = (
      <>
        <div>Yayını izlemek için ses kanalına katılman gerekiyor.</div>
        <button
          type="button"
          className="stream-viewer-join"
          onClick={() =>
            joinVoiceChannel(
              socket,
              watching.serverID,
              watching.channelID,
              myUserId
            )
          }
        >
          Kanala Katıl ve İzle
        </button>
      </>
    );
  } else if (!stream) {
    message = <div>Yayın yükleniyor…</div>;
  }

  return (
    <div className="stream-viewer-backdrop" onMouseDown={closeStream}>
      <div
        ref={viewerRef}
        className="stream-viewer"
        onMouseDown={event => event.stopPropagation()}
      >
        <div className="stream-viewer-header">
          {stream && <span className="stream-viewer-live">CANLI</span>}
          <span className="stream-viewer-title">
            {isMe ? "Senin yayının" : watching.username}
          </span>
          <button
            type="button"
            className="stream-viewer-icon"
            title="Tam ekran"
            onClick={toggleFullscreen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 3H14V5H19V10H21V5C21 3.89 20.1 3 19 3ZM19 19H14V21H19C20.1 21 21 20.1 21 19V14H19V19ZM3 5V10H5V5H10V3H5C3.9 3 3 3.89 3 5ZM5 14H3V19C3 20.1 3.9 21 5 21H10V19H5V14Z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="stream-viewer-icon"
            title="Kapat"
            onClick={closeStream}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"
              />
            </svg>
          </button>
        </div>
        <div className="stream-viewer-body">
          {/* Our own stream is shown muted so we do not hear ourselves twice */}
          <video
            ref={videoRef}
            className="stream-viewer-video"
            autoPlay
            playsInline
            muted={isMe}
            style={{ visibility: stream ? "visible" : "hidden" }}
          />
          {message && <div className="stream-viewer-message">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default StreamViewer;
