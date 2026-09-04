import sanitizeHtml from "sanitize-html";

/**
 * Tags a Markdown renderer can legitimately produce.
 *
 * This is an allowlist, so anything not named here is stripped — including
 * `script`, `style`, `iframe` and event handler attributes. Markdown itself
 * permits raw HTML, so this is the boundary that makes authored content safe
 * regardless of what someone types into the editor.
 */
const allowedTags = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "blockquote", "code", "pre",
  "a", "img",
  "strong", "em", "del", "s",
  "table", "thead", "tbody", "tr", "th", "td",
] as const;

/**
 * Sanitizes rich text before it is rendered.
 *
 * **Render time is the security boundary, and the only one.** Posts are stored
 * as the Markdown the author actually typed — sanitizing on write would mean
 * converting to HTML and storing that, destroying the source document. So the
 * column legitimately contains whatever was written, raw HTML included, and
 * nothing downstream may assume it is clean.
 *
 * That also covers content arriving by other routes: a database fix-up, a
 * restored backup, a future import. All of them are rendered through here.
 */
export const sanitizeRichHtml = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: [...allowedTags],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      // Markdown tables carry alignment.
      th: ["align"],
      td: ["align"],
    },
    // No `javascript:` or `data:` URLs; `data:` in particular can carry script
    // in some contexts.
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
      // Author-supplied images should never block rendering of the article.
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });
};
