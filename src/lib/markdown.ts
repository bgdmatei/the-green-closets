import { marked } from "marked";

import { sanitizeRichHtml } from "@/lib/sanitize-html";

/**
 * Renders Markdown to safe HTML.
 *
 * The order matters: Markdown is converted first, then the result is
 * sanitized. Sanitizing the Markdown source instead would be useless, because
 * the dangerous constructs only exist once it is HTML — and Markdown allows
 * raw HTML passthrough, so the output genuinely can contain anything.
 */
export const renderMarkdown = (markdown: string): string => {
  const html = marked.parse(markdown, {
    async: false,
    gfm: true,
    breaks: false,
  });

  return sanitizeRichHtml(html);
};
