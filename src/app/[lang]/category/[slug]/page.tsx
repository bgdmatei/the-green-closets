import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostsByCategory } from "@/features/blog/api/blog.services";
import { BlogCard } from "@/features/blog/components/blog-card";
import { getEnv } from "@/lib/env";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * Generates metadata for a category page.
 */
export const generateMetadata = async ({ params }: CategoryPageProps): Promise<Metadata> => {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const env = getEnv();
  return buildPageMetadata(env.NEXT_PUBLIC_SITE_URL, {
    title: `Category: ${slug}`,
    description: `Articles in category ${slug}.`,
    locale: lang,
    path: `/category/${slug}`,
  });
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const posts = await getPostsByCategory(locale, slug);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <Link className="text-sm text-blue-700 hover:underline" href={`/${locale}`}>
        Back to all categories
      </Link>
      <h1 className="text-3xl font-bold">Category: {posts[0].categoryName}</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <BlogCard key={post.slug} locale={locale} post={post} />
        ))}
      </div>
    </section>
  );
}
