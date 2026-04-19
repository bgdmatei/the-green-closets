import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Playfair_Display({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "THE GREEN CLOSETS",
    template: "%s | THE GREEN CLOSETS",
  },
  description: "SUSTAINABLE STYLE MADE EASY",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-zinc-50 text-zinc-900">{children}</body>
    </html>
  );
}
