import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/link";
import { getPostBySlug, getPosts } from "@/features/blog/api/blog.services";
import { PostContent } from "@/features/blog/components/post-content";
import { formatPublishedDate } from "@/features/blog/lib/format-date";
import { buildPageMetadata } from "@/lib/metadata";

/**
 * Posts are published from the backoffice, so the set is open: a slug that did
 * not exist at build time must still render. Next renders it on demand and
 * caches the result. `generateStaticParams` still prerenders everything that
 * exists at build time, so this only affects posts added afterwards.
 */
export const dynamicParams = true;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async (): Promise<
  Array<{ slug: string }>
> => {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
};

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/articles/${post.slug}`,
    publishedTime: post.publishedAt,
  });
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-14 md:py-20">
      <Container width="prose" className="space-y-8">
        <TextLink href="/journal" tone="muted" size="sm" underline="hover">
          <span aria-hidden>&larr;</span> Journal
        </TextLink>

        <header className="space-y-5">
          <div className="flex items-baseline justify-between gap-4">
            <TextLink
              href={`/category/${post.categorySlug}`}
              tone="muted"
              underline="hover"
            >
              <Eyebrow as="span">{post.categoryName}</Eyebrow>
            </TextLink>
            <time
              className="text-step--2 uppercase tracking-[0.1em] text-ink-muted"
              dateTime={post.publishedAt}
            >
              {formatPublishedDate(post.publishedAt)}
            </time>
          </div>

          <Heading as="h1" size="lg">
            {post.title}
          </Heading>

          <p className="font-display text-step-2 italic leading-snug text-ink-muted">
            {post.excerpt}
          </p>
        </header>

        <Divider />

        <PostContent contentHtml={post.contentHtml} />
      </Container>
    </article>
  );
}
