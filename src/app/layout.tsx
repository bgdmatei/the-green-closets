import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-sans",
  subsets: ["latin"],
});
const source = Source_Serif_4({
  variable: "--font-sans-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "THE GREEN CLOSETS",
    template: "%s | THE GREEN CLOSETS",
  },
  description: "SUSTAINABLE STYLE MADE EASY",
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
      className={`${playfair.variable} ${source.variable} h-full w-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
