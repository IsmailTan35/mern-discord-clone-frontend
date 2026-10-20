import React, { useState } from "react";
import { emojiForShortcode } from "common/emojiData";

// Discord's message formatting, rendered to React elements (never to HTML
// strings, so message text can not inject markup).
//
// Blocks: ```code```, > quote, >>> quote to the end, # / ## / ### headings,
// - and 1. lists. Inline: `code`, **bold**, *italic* / _italic_, __underline__,
// ~~strike~~, ||spoiler||, links, <@userId> mentions, @everyone / @here,
// :shortcode: emoji, and \ to escape a character.

const Spoiler = ({ children }) => {
  const [shown, setShown] = useState(false);
  return (
    <span
      className={`md-spoiler${shown ? " shown" : ""}`}
      onClick={() => setShown(true)}
      title={shown ? undefined : "Spoiler"}
    >
      <span className="md-spoiler-text">{children}</span>
    </span>
  );
};

// ---------------------------------------------------------------- inline

const TRAILING_PUNCTUATION = /[.,!?:;'"\]}>*_~|]$/;

const matchUrl = text => {
  const match = /^https?:\/\/[^\s<]+/.exec(text);
  if (!match) return null;
  let url = match[0];
  for (;;) {
    if (TRAILING_PUNCTUATION.test(url)) url = url.slice(0, -1);
    else if (url.endsWith(")") && url.split("(").length < url.split(")").length)
      url = url.slice(0, -1);
    else break;
  }
  return /^https?:\/\/[^/\s]+/.test(url) ? [url] : null;
};

const link = (url, key) => (
  <a key={key} className="md-link" href={url} target="_blank" rel="noopener noreferrer">
    {url}
  </a>
);

const isWordChar = char => /[\p{L}\p{N}_]/u.test(char || "");

const RULES = [
  {
    // \* shows a literal *
    match: text => /^\\([^\s\p{L}\p{N}])/u.exec(text),
    render: match => match[1],
  },
  {
    match: text => /^(`+)([\s\S]*?[^`])\1(?!`)/.exec(text),
    render: (match, ctx, key) => (
      <code key={key} className="md-inline-code">
        {match[2]}
      </code>
    ),
  },
  {
    match: text => /^<@!?([0-9a-f]{24})>/i.exec(text),
    render: (match, ctx, key) => {
      const name = ctx.mentionName ? ctx.mentionName(match[1]) : null;
      return (
        <span key={key} className="md-mention" title={name || undefined}>
          @{name || "bilinmeyen-kullanıcı"}
        </span>
      );
    },
  },
  {
    // <https://...> is a link without a preview
    match: text => /^<(https?:\/\/[^\s>]+)>/.exec(text),
    render: (match, ctx, key) => link(match[1], key),
  },
  {
    match: matchUrl,
    render: (match, ctx, key) => link(match[0], key),
  },
  {
    match: (text, previous) =>
      !isWordChar(previous) && /^@(everyone|here)(?![\p{L}\p{N}_])/u.exec(text),
    render: (match, ctx, key) => (
      <span key={key} className="md-mention">
        {match[0]}
      </span>
    ),
  },
  {
    match: text => /^\|\|([\s\S]+?)\|\|/.exec(text),
    render: (match, ctx, key) => (
      <Spoiler key={key}>{parseInline(match[1], ctx)}</Spoiler>
    ),
  },
  {
    match: text => /^\*\*([\s\S]+?)\*\*(?!\*)/.exec(text),
    render: (match, ctx, key) => <strong key={key}>{parseInline(match[1], ctx)}</strong>,
  },
  {
    match: text => /^__([\s\S]+?)__(?!_)/.exec(text),
    render: (match, ctx, key) => <u key={key}>{parseInline(match[1], ctx)}</u>,
  },
  {
    match: text => /^\*(?=\S)([\s\S]*?\S)\*(?!\*)/.exec(text),
    render: (match, ctx, key) => <em key={key}>{parseInline(match[1], ctx)}</em>,
  },
  {
    // snake_case_words stay as they are
    match: (text, previous) =>
      !isWordChar(previous) && /^_(?=\S)([\s\S]*?\S)_(?![\p{L}\p{N}_])/u.exec(text),
    render: (match, ctx, key) => <em key={key}>{parseInline(match[1], ctx)}</em>,
  },
  {
    match: text => /^~~([\s\S]+?)~~/.exec(text),
    render: (match, ctx, key) => <s key={key}>{parseInline(match[1], ctx)}</s>,
  },
  {
    match: text => {
      const match = /^:([a-z0-9_+-]+):/i.exec(text);
      return match && emojiForShortcode(match[1]) ? match : null;
    },
    render: (match, ctx, key) => (
      <span key={key} className="md-emoji" title={match[0]}>
        {emojiForShortcode(match[1])}
      </span>
    ),
  },
];

const SPECIAL = /[\\`<h@|*_~:]/;

const parseInline = (text, ctx) => {
  const nodes = [];
  let buffer = "";
  let i = 0;
  const flush = () => {
    if (buffer) nodes.push(buffer);
    buffer = "";
  };
  while (i < text.length) {
    if (SPECIAL.test(text[i])) {
      const rest = text.slice(i);
      const previous = text[i - 1];
      let matched = null;
      let rule = null;
      for (rule of RULES) {
        matched = rule.match(rest, previous);
        if (matched) break;
      }
      if (matched) {
        flush();
        nodes.push(rule.render(matched, ctx, `i${ctx.next()}`));
        i += matched[0].length;
        continue;
      }
    }
    buffer += text[i];
    i += 1;
  }
  flush();
  return nodes;
};

// ---------------------------------------------------------------- blocks

const QUOTE_LINE = /^> ?(.*)$/;
const BULLET = /^\s*[-*] (.*)$/;
const NUMBERED = /^\s*(\d{1,3})\. (.*)$/;
const HEADING = /^(#{1,3}) (.+)$/;

const parseBlocks = (text, ctx, allowQuotes = true) => {
  const lines = text.split("\n");
  const blocks = [];
  let paragraph = [];

  const endParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(
      <div key={`p${ctx.next()}`} className="md-p">
        {parseInline(paragraph.join("\n"), ctx)}
      </div>
    );
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (allowQuotes && /^>>> ?/.test(line)) {
      endParagraph();
      const rest = [line.replace(/^>>> ?/, ""), ...lines.slice(i + 1)].join("\n");
      blocks.push(
        <blockquote key={`q${ctx.next()}`} className="md-quote">
          {parseBlocks(rest, ctx, false)}
        </blockquote>
      );
      break;
    }

    if (allowQuotes && /^>( |$)/.test(line)) {
      endParagraph();
      const quoted = [];
      while (i < lines.length && /^>( |$)/.test(lines[i])) {
        quoted.push(lines[i].match(QUOTE_LINE)[1]);
        i += 1;
      }
      i -= 1;
      blocks.push(
        <blockquote key={`q${ctx.next()}`} className="md-quote">
          {parseBlocks(quoted.join("\n"), ctx, false)}
        </blockquote>
      );
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      endParagraph();
      const Tag = `h${heading[1].length}`;
      blocks.push(
        <Tag key={`h${ctx.next()}`} className="md-heading">
          {parseInline(heading[2], ctx)}
        </Tag>
      );
      continue;
    }

    if (BULLET.test(line) || NUMBERED.test(line)) {
      endParagraph();
      const numbered = NUMBERED.test(line);
      const pattern = numbered ? NUMBERED : BULLET;
      const items = [];
      const start = numbered ? Number(line.match(NUMBERED)[1]) : undefined;
      while (i < lines.length && pattern.test(lines[i])) {
        const match = lines[i].match(pattern);
        items.push(
          <li key={`li${ctx.next()}`}>{parseInline(numbered ? match[2] : match[1], ctx)}</li>
        );
        i += 1;
      }
      i -= 1;
      blocks.push(
        numbered ? (
          <ol key={`ol${ctx.next()}`} className="md-list" start={start}>
            {items}
          </ol>
        ) : (
          <ul key={`ul${ctx.next()}`} className="md-list">
            {items}
          </ul>
        )
      );
      continue;
    }

    paragraph.push(line);
  }
  endParagraph();
  return blocks;
};

const CODE_BLOCK = /```(?:([\w+#-]+)\n)?\n?([\s\S]*?)```/g;

// `options.mentionName(userId)` returns the name to show for a mention
export const renderMarkdown = (text, options = {}) => {
  let counter = 0;
  const ctx = { ...options, next: () => counter++ };
  const source = String(text || "");
  const nodes = [];
  let last = 0;
  let match;
  CODE_BLOCK.lastIndex = 0;
  while ((match = CODE_BLOCK.exec(source))) {
    const before = source.slice(last, match.index).replace(/\n$/, "");
    if (before) nodes.push(...parseBlocks(before, ctx));
    nodes.push(
      <pre key={`c${ctx.next()}`} className="md-code-block">
        <code data-language={match[1] || undefined}>{match[2].replace(/\n$/, "")}</code>
      </pre>
    );
    last = match.index + match[0].length;
  }
  const after = source.slice(last).replace(/^\n/, "");
  if (after || nodes.length === 0) nodes.push(...parseBlocks(after, ctx));
  return nodes;
};

// One line of plain text, for reply previews and notifications
export const toPlainText = (text, mentionName = () => null) =>
  String(text || "")
    .replace(/```(?:[\w+#-]+\n)?([\s\S]*?)```/g, "$1")
    .replace(/<@!?([0-9a-f]{24})>/gi, (whole, id) => `@${mentionName(id) || "bilinmeyen-kullanıcı"}`)
    .replace(/:([a-z0-9_+-]+):/gi, (whole, name) => emojiForShortcode(name) || whole)
    .replace(/(\*\*|__|~~|\|\||`)/g, "")
    .replace(/^(>>> ?|> ?|#{1,3} )/gm, "")
    .replace(/\s+/g, " ")
    .trim();

// A message of only emoji (up to 27, like Discord) is shown large
const EMOJI_SEQUENCE =
  "(?:\\p{Regional_Indicator}{2}|[#*0-9]\\uFE0F?\\u20E3|\\p{Extended_Pictographic}(?:\\uFE0F|\\p{Emoji_Modifier})?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\p{Emoji_Modifier})?)*)";
const ONLY_EMOJI = new RegExp(`^(?:\\s*${EMOJI_SEQUENCE})+\\s*$`, "u");
const ANY_EMOJI = new RegExp(EMOJI_SEQUENCE, "gu");

export const isJumboEmoji = text => {
  const source = String(text || "").replace(
    /:([a-z0-9_+-]+):/gi,
    (whole, name) => emojiForShortcode(name) || whole
  );
  if (!ONLY_EMOJI.test(source)) return false;
  return (source.match(ANY_EMOJI) || []).length <= 27;
};
