import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";

import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getEnv } from "@/lib/env";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  // The italic is the display face's signature, not an optional extra.
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const env = getEnv();

export const metadata: Metadata = {
  // Lets every route express canonical and Open Graph URLs as relative paths.
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "The Green Closets — ethical shop",
    template: "%s | The Green Closets",
  },
  description:
    "An independent shop stitching together live product feeds from fashion brands we curate and rate ourselves.",
  applicationName: "The Green Closets",
  openGraph: {
    siteName: "The Green Closets",
    locale: "en_GB",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Light is the default and matches the prerendered HTML; the script below
      // upgrades to dark before paint when the reader has chosen it.
      data-theme="light"
      className={`${instrumentSerif.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs before the body paints, so a reader who chose dark never sees a
          flash of the light theme. It is deliberately tiny and dependency-free
          because it blocks rendering. Wrapped in try/catch: reading
          localStorage throws outright in some privacy modes.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('tgc-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-surface text-ink">
        <SiteHeader />
        {/*
          No width constraint here on purpose — each page section opts into a
          `Container`, so full-bleed bands can simply be full width.
        */}
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
