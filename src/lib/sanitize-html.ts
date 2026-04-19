import sanitizeHtml from "sanitize-html";

const defaultAllowedTags = [
  "h1",
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "a",
  "strong",
  "em",
] as const;

/**
 * Sanitizes rich text content from external content sources.
 */
export const sanitizeRichHtml = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: [...defaultAllowedTags],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
};
