import React, { useState } from "react";

// Link previews attached to a message by the server

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M8 5v14l11-7z" />
  </svg>
);

const YouTubeEmbed = ({ embed }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="embed-media embed-video">
      {playing ? (
        <iframe
          title={embed.title || "YouTube"}
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(embed.videoId)}?autoplay=1`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className="embed-video-cover" onClick={() => setPlaying(true)} title="Oynat">
          <img src={embed.image} alt="" loading="lazy" />
          <span className="embed-video-play">
            <PlayIcon />
          </span>
        </button>
      )}
    </div>
  );
};

const MessageEmbed = ({ embed }) => {
  const [imageFailed, setImageFailed] = useState(false);

  if (embed.type === "image") {
    return (
      <a className="embed-image-only" href={embed.url} target="_blank" rel="noopener noreferrer">
        <img src={embed.image} alt="" loading="lazy" />
      </a>
    );
  }

  return (
    <div className="embed" style={{ borderLeftColor: embed.color || "#202225" }}>
      {embed.siteName && <div className="embed-site">{embed.siteName}</div>}
      {embed.author && <div className="embed-author">{embed.author}</div>}
      {embed.title && (
        <a className="embed-title" href={embed.url} target="_blank" rel="noopener noreferrer">
          {embed.title}
        </a>
      )}
      {embed.description && <div className="embed-description">{embed.description}</div>}
      {embed.type === "video" && embed.provider === "youtube" ? (
        <YouTubeEmbed embed={embed} />
      ) : (
        embed.image &&
        !imageFailed && (
          <a className="embed-media" href={embed.url} target="_blank" rel="noopener noreferrer">
            <img src={embed.image} alt="" loading="lazy" onError={() => setImageFailed(true)} />
          </a>
        )
      )}
    </div>
  );
};

export default MessageEmbed;
