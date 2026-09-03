import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Root layout for the backoffice.
 *
 * A sibling of the public site's root layout, not a child of it — there is no
 * `app/layout.tsx`, so neither knows the other exists. The backoffice therefore
 * shares the design tokens but none of the chrome: no site header, no footer,
 * and no display serif. It should read as a tool, not as the magazine.
 *
 * Navigating between the two triggers a full page load, which is the intent:
 * a hard boundary with no shared client state.
 */
export const metadata: Metadata = {
  title: {
    default: "Backoffice",
    template: "%s · Backoffice",
  },
  // The backoffice must never appear in search results, and unlike the public
  // site it is deliberately absent from sitemap.ts.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Pinned to light: the backoffice is a tool with its own chrome, and does
    // not follow the reader-facing theme toggle.
    <html lang="en" data-theme="light" className={`${inter.variable} antialiased`}>
      <body className="min-h-dvh bg-surface-sunken font-body text-ink">
        {children}
      </body>
    </html>
  );
}
