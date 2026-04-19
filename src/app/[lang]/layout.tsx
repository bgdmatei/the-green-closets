import Link from "next/link";
import { notFound } from "next/navigation";

import { isValidLocale, locales, type Locale } from "@/lib/i18n";
import { Text } from "@/features/blog/components/shadcn/Text";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

/**
 * Generates static locale segments.
 */
export const generateStaticParams = (): Array<{ lang: Locale }> => {
  return locales.map((lang) => ({ lang }));
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6 bg-background">
      <header className="mb-8 flex flex-col items-center justify-center pb-4 gap-2">
        <Link className="text-secondary text-4xl font-bold uppercase" href={`/${lang}`}>
          THE GREEN CLOSETS
        </Link>
        <Text as='p' size='sm' weight='semibold' className="text-secondary uppercase">Sustainable style made easy</Text>
        {/* <nav className="flex items-center gap-4 text-sm">
          {locales.map((item) => (
            <Link
              key={item}
              className={item === lang ? "font-semibold text-zinc-900" : "text-zinc-500"}
              href={`/${item}`}
            >
              {item.toUpperCase()}
            </Link>
          ))}
          <Link className="text-zinc-500 hover:text-zinc-900" href={`/${defaultLocale}`}>
            Home
          </Link>
        </nav> */}
      </header>
      <main>{children}</main>
    </div>
  );
}
