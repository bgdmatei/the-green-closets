import { describe, expect, it } from "vitest";

import { renderMarkdown } from "@/lib/markdown";

describe("renderMarkdown", () => {
  it("renders ordinary markdown", () => {
    const html = renderMarkdown("# Title\n\nSome **bold** text.\n\n- one\n- two");

    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<li>one</li>");
  });

  it("supports GFM tables and strikethrough", () => {
    const html = renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |\n\n~~gone~~");

    expect(html).toContain("<table>");
    expect(html).toContain("<td>1</td>");
    expect(html).toMatch(/<del>gone<\/del>/);
  });
});

describe("renderMarkdown strips anything dangerous", () => {
  // Markdown permits raw HTML passthrough, so authored content genuinely can
  // contain these. The sanitizer is what makes the editor safe to use.
  it("removes script tags", () => {
    const html = renderMarkdown("Hello <script>alert('xss')</script> there");

    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(");
  });

  it("removes event handler attributes", () => {
    const html = renderMarkdown('<p onclick="steal()">click</p>');

    expect(html).not.toContain("onclick");
    expect(html).not.toContain("steal");
  });

  it("removes javascript: URLs", () => {
    const html = renderMarkdown("[click me](javascript:alert(1))");

    expect(html).not.toContain("javascript:");
  });

  it("removes iframes and style blocks", () => {
    const html = renderMarkdown(
      '<iframe src="https://evil.example"></iframe><style>body{display:none}</style>',
    );

    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("<style");
  });

  it("removes an img with an onerror handler but keeps a plain image", () => {
    const dangerous = renderMarkdown('<img src="x" onerror="alert(1)">');
    expect(dangerous).not.toContain("onerror");

    const fine = renderMarkdown("![a cat](https://example.com/cat.jpg)");
    expect(fine).toContain('src="https://example.com/cat.jpg"');
    expect(fine).toContain('loading="lazy"');
  });

  it("marks outbound links noopener and opens them in a new tab", () => {
    const html = renderMarkdown("[out](https://example.com)");

    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });

  it("survives content that is only an attack", () => {
    expect(renderMarkdown('<script>alert(1)</script>').trim()).toBe("");
  });
});
