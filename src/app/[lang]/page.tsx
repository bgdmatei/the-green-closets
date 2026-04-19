import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategoriesByLocale, getPostsByLocale } from "@/features/blog/api/blog.services";
import { BlogCard } from "@/features/blog/components/blog-card";
import { getEnv } from "@/lib/env";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import Image from "next/image";

export const revalidate = 300;

interface LocalePageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Generates metadata for the locale homepage.
 */
export const generateMetadata = async ({ params }: LocalePageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const env = getEnv();
  return buildPageMetadata(env.NEXT_PUBLIC_SITE_URL, {
    title: "Frontend Blog",
    description: "A small multilingual frontend-only blog built with Next.js.",
    locale: lang,
    path: "/",
  });
};

export default async function LocaleHomepage({ params }: LocalePageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const [posts, categories] = await Promise.all([
    getPostsByLocale(locale),
    getCategoriesByLocale(locale),
  ]);

  return (
    <section className="space-y-8">
      <div>
        <div className="space-y-3">
          <Image className="rounded-lg" src='/images/homepage/flowers.jpg' alt="Flower basket" width={565} height={338} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100"
            key={category.slug}
            href={`/${locale}/category/${category.slug}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-zinc-500">
            No posts available for this locale yet.
          </p>
        ) : (
          posts.map((post) => <BlogCard key={post.slug} locale={locale} post={post} />)
        )}
      </div>
    </section>
  );
}
