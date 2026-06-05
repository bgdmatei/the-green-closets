import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostBySlug, getPosts } from "@/features/blog/api/blog.services";
import { PostContent } from "@/features/blog/components/post-content";
import { getEnv } from "@/lib/env";
import { isValidLocale, locales, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import { BlogPost } from "@/features/blog/types/blog.types";

export const revalidate = 300;

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * Generates static params for all locale/post combinations.
 */
export const generateStaticParams = async (): Promise<
  Array<{ lang: Locale; slug: string }>
> => {
  const combinations = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getPosts();
      return posts.map((post: BlogPost) => ({ lang: locale, slug: post.slug }));
    }),
  );
  return combinations.flat();
};

/**
 * Generates metadata for a blog detail page.
 */
export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const post = await getPostBySlug(lang, slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const env = getEnv();
  return buildPageMetadata(env.NEXT_PUBLIC_SITE_URL, {
    title: post.title,
    description: post.excerpt,
    locale: lang,
    path: `/articles/${post.slug}`,
  });
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const post = await getPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <Link
        className="text-sm text-blue-700 hover:underline"
        href={`/${locale}`}
      >
        Back to articles
      </Link>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          {post.categoryName}
        </p>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-zinc-500">{post.publishedAt}</p>
      </div>
      <PostContent contentHtml={post.contentHtml} />
    </article>
  );
}
