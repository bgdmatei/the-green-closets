import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { getPostBySlug, getPosts } from "@/features/blog/api/blog.services";
import { PostContent } from "@/features/blog/components/post-content";
import { formatPublishedDate } from "@/features/blog/lib/format-date";
import { buildPageMetadata } from "@/lib/metadata";

// The content set is closed, so anything not prerendered is a genuine 404.
export const dynamicParams = false;

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
    <Container as="article" width="prose" className="space-y-8">
      <TextLink href="/" tone="muted" size="xs">
        &larr; All articles
      </TextLink>

      <header className="space-y-4">
        <TextLink href={`/category/${post.categorySlug}`} underline="never">
          <Badge>{post.categoryName}</Badge>
        </TextLink>
        <Heading as="h1" size="lg" className="text-pretty">
          {post.title}
        </Heading>
        <Text as="time" size="sm" tone="muted" dateTime={post.publishedAt}>
          {formatPublishedDate(post.publishedAt)}
        </Text>
      </header>

      <Divider />

      <PostContent contentHtml={post.contentHtml} />
    </Container>
  );
}
