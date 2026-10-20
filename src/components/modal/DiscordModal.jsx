import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import "assets/css/discordmodal.css";

// A centred dialog like Discord's: title, optional subtitle, body and a footer
// for the buttons. Closes on Escape or a click outside.
const DiscordModal = ({ title, subtitle, onClose, footer, children, width = 440, className = "" }) => {
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key !== "Escape") return;
      // Only this dialog closes, not the page behind it
      event.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="dmodal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className={`dmodal ${className}`} style={{ width }} role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="dmodal-close" aria-label="Kapat" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z" />
          </svg>
        </button>
        <div className="dmodal-header">
          <h2 className="dmodal-title">{title}</h2>
          {subtitle && <div className="dmodal-subtitle">{subtitle}</div>}
        </div>
        <div className="dmodal-body">{children}</div>
        {footer && <div className="dmodal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

// A labelled field; the error replaces nothing, it is added next to the label
export const ModalField = ({ label, error, children }) => (
  <label className={`dmodal-field${error ? " error" : ""}`}>
    <span className="dmodal-label">
      {label}
      {error && <span className="dmodal-error"> - {error}</span>}
    </span>
    {children}
  </label>
);

export default DiscordModal;
