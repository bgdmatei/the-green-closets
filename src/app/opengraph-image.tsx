import { ImageResponse } from "next/og";

export const alt = "THE GREEN CLOSETS — Sustainable style made easy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide Open Graph card, generated at build time and inherited by every
 * route that does not define its own.
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
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#26403f",
          color: "#f2f1ee",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 76,
            letterSpacing: 10,
            textTransform: "uppercase",
          }}
        >
          The Green Closets
        </div>
        <div
          style={{
            width: 160,
            height: 1,
            background: "#f2f1ee",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Sustainable style made easy
        </div>
      </div>
    ),
    size,
  );
}
