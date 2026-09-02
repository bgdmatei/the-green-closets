import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4 } from "next/font/google";

import "./globals.css";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { getEnv } from "@/lib/env";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const env = getEnv();

export const metadata: Metadata = {
  // Lets every route express canonical and Open Graph URLs as relative paths.
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "THE GREEN CLOSETS",
    template: "%s | THE GREEN CLOSETS",
  },
  description: "Sustainable style made easy.",
  applicationName: "THE GREEN CLOSETS",
  openGraph: {
    siteName: "THE GREEN CLOSETS",
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
      className={`${playfair.variable} ${sourceSerif.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-surface text-ink">
        <Container as="header" className="py-10 text-center">
          <TextLink href="/" tone="muted" underline="never" className="block">
            <Heading
              as="p"
              size="lg"
              tone="brand"
              align="center"
              uppercase
              className="font-normal"
            >
              THE GREEN CLOSETS
            </Heading>
          </TextLink>
          <Text
            size="sm"
            weight="light"
            tone="muted"
            align="center"
            uppercase
            className="mt-2"
          >
            Sustainable style made easy
          </Text>
        </Container>

        {/*
          No width constraint here on purpose — each page section opts into a
          `Container`, so full-bleed bands can simply be full width.
        */}
        <main className="flex-1 pb-16">{children}</main>
      </body>
    </html>
  );
}
