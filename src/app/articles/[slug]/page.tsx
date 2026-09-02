import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostBySlug, getPosts } from "@/features/blog/api/blog.services";
import { PostContent } from "@/features/blog/components/post-content";
import { getEnv } from "@/lib/env";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 300;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generates static params for all posts.
 */
export const generateStaticParams = async (): Promise<Array<{ slug: string }>> => {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
};

/**
 * Generates metadata for a blog detail page.
 */
export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const env = getEnv();
  return buildPageMetadata(env.NEXT_PUBLIC_SITE_URL, {
    title: post.title,
    description: post.excerpt,
    path: `/articles/${post.slug}`,
  });
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-6">
      <Link className="text-sm text-blue-700 hover:underline" href="/">
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
