import { ImageResponse } from "next/og";

export const alt = "The Green Closets — ethical shop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide Open Graph card, generated at build time.
 *
 * Colours are hex literals rather than tokens because Satori renders this
 * outside the browser, with no access to the stylesheet or to `oklch()`.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f7f5f0",
          color: "#2b2926",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#6b675f",
          }}
        >
          Ethical shop
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 92, lineHeight: 1 }}>The Green Closets</div>
          <div style={{ fontSize: 30, color: "#6b675f" }}>
            Live product feeds from brands we curate and rate ourselves.
          </div>
        </div>
        <div style={{ width: "100%", height: 1, background: "#dcd8d0" }} />
      </div>
    ),
    size,
  );
}
