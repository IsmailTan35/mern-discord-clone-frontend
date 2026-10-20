import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { EMOJI_CATEGORIES, nameForEmoji, searchEmoji } from "common/emojiData";

import "assets/css/emojipicker.css";

const RECENT_KEY = "emojiRecent";
const RECENT_LIMIT = 27;
export const DEFAULT_QUICK_REACTIONS = ["👍", "❤️", "😂"];

// Most recently used first; kept per browser
export const getRecentEmoji = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(RECENT_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
};

export const rememberEmoji = emoji => {
  const next = [emoji, ...getRecentEmoji().filter(item => item !== emoji)].slice(0, RECENT_LIMIT);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch (error) {}
};

const PICKER_WIDTH = 420;
const PICKER_HEIGHT = 430;
const MARGIN = 8;

// Above the anchor if it fits, otherwise below; right edges aligned, kept on screen
const placeNear = rect => {
  const above = rect.top - PICKER_HEIGHT - MARGIN;
  const top = above >= MARGIN ? above : Math.min(rect.bottom + MARGIN, window.innerHeight - PICKER_HEIGHT - MARGIN);
  const left = Math.min(
    Math.max(MARGIN, rect.right - PICKER_WIDTH),
    window.innerWidth - PICKER_WIDTH - MARGIN
  );
  return { top: Math.max(MARGIN, top), left: Math.max(MARGIN, left) };
};

const EmojiButton = ({ entry, onPick, onHover }) => (
  <button
    type="button"
    className="emoji-picker-emoji"
    title={`:${entry.name}:`}
    onClick={event => onPick(entry.emoji, event.shiftKey)}
    onMouseEnter={() => onHover(entry)}
  >
    {entry.emoji}
  </button>
);

// `anchor` is the element the picker opens next to; `onSelect(emoji)` is called
// for each pick (the picker stays open while Shift is held, like Discord)
const EmojiPicker = ({ anchor, onSelect, onClose }) => {
  const ref = useRef(null);
  const bodyRef = useRef(null);
  const sectionRefs = useRef({});
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState(null);
  const [position, setPosition] = useState(() =>
    anchor ? placeNear(anchor.getBoundingClientRect()) : { top: MARGIN, left: MARGIN }
  );
  const recent = useMemo(() => getRecentEmoji(), []);

  useLayoutEffect(() => {
    if (anchor) setPosition(placeNear(anchor.getBoundingClientRect()));
  }, [anchor]);

  useEffect(() => {
    const handleMouseDown = event => {
      if (ref.current && ref.current.contains(event.target)) return;
      if (anchor && anchor.contains(event.target)) return;
      onClose();
    };
    const handleKeyDown = event => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
    };
    const handleResize = () => onClose();
    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [anchor, onClose]);

  const pick = (emoji, keepOpen) => {
    rememberEmoji(emoji);
    onSelect(emoji);
    if (!keepOpen) onClose();
  };

  const results = useMemo(() => (query.trim() ? searchEmoji(query, 120) : null), [query]);

  const sections = [
    ...(recent.length > 0
      ? [{
          id: "recent",
          name: "Sık Kullanılanlar",
          icon: "🕘",
          emojis: recent.map(emoji => ({ emoji, name: nameForEmoji(emoji) || "emoji" })),
        }]
      : []),
    ...EMOJI_CATEGORIES,
  ];

  const scrollTo = id => {
    setQuery("");
    const target = sectionRefs.current[id];
    if (target && bodyRef.current) bodyRef.current.scrollTop = target.offsetTop - bodyRef.current.offsetTop;
  };

  const shown = hovered || (results && results[0]) || null;

  return ReactDOM.createPortal(
    <div
      ref={ref}
      className="emoji-picker"
      style={{ top: position.top, left: position.left }}
      role="dialog"
      aria-label="Emoji seçici"
    >
      <div className="emoji-picker-header">
        <input
          autoFocus
          className="emoji-picker-search"
          placeholder="Mükemmel emojiyi bul"
          value={query}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={event => {
            if (event.key === "Enter" && results && results[0]) pick(results[0].emoji, event.shiftKey);
          }}
        />
      </div>
      <div className="emoji-picker-main">
        <nav className="emoji-picker-categories">
          {sections.map(section => (
            <button
              key={section.id}
              type="button"
              className="emoji-picker-category"
              title={section.name}
              onClick={() => scrollTo(section.id)}
            >
              {section.icon}
            </button>
          ))}
        </nav>
        <div className="emoji-picker-body" ref={bodyRef}>
          {results ? (
            results.length > 0 ? (
              <section>
                <h3 className="emoji-picker-section-title">Arama Sonuçları</h3>
                <div className="emoji-picker-grid">
                  {results.map(entry => (
                    <EmojiButton
                      key={entry.name}
                      entry={entry}
                      onHover={setHovered}
                      onPick={pick}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <div className="emoji-picker-empty">Hiçbir şey bulunamadı</div>
            )
          ) : (
            sections.map(section => (
              <section key={section.id} ref={element => (sectionRefs.current[section.id] = element)}>
                <h3 className="emoji-picker-section-title">{section.name}</h3>
                <div className="emoji-picker-grid">
                  {section.emojis.map(entry => (
                    <EmojiButton
                      key={`${section.id}-${entry.emoji}`}
                      entry={entry}
                      onHover={setHovered}
                      onPick={pick}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
      <div className="emoji-picker-footer">
        {shown ? (
          <>
            <span className="emoji-picker-footer-emoji">{shown.emoji}</span>
            <span className="emoji-picker-footer-name">:{shown.name}:</span>
          </>
        ) : (
          <span className="emoji-picker-footer-hint">Birden fazla seçmek için Shift'e basılı tut</span>
        )}
      </div>
    </div>,
    document.body
  );
};

export default EmojiPicker;
