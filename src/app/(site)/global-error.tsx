"use client";

/**
 * Replaces the root layout when it is the layout itself that failed, so this
 * file must render its own <html> and <body> and cannot use the design system —
 * the stylesheet is part of what may have failed to load.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "Georgia, 'Times New Roman', serif",
          background: "#f2f1ee",
          color: "#26403f",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 400, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ margin: 0, opacity: 0.75 }}>
          The page could not be displayed.
          {error.digest ? ` Reference: ${error.digest}` : null}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: "1px solid currentColor",
            borderRadius: "0.375rem",
            background: "transparent",
            color: "inherit",
            padding: "0.5rem 1rem",
            font: "inherit",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
