import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Text } from "@/features/blog/components/shadcn/Text";

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
      <body className="min-h-full">
        <div className="mx-auto min-h-screen w-full lg:max-w-6xl py-10 bg-background overflow-clip md:overflow-visible">
          <header className="mb-8 flex flex-col items-center justify-center pb-4 gap-2">
            <Link
              className="text-secondary text-4xl font-normal uppercase"
              href="/"
            >
              THE GREEN CLOSETS
            </Link>
            <Text
              as="p"
              size="sm"
              weight="light"
              className="text-secondary uppercase"
            >
              Sustainable style made easy
            </Text>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
