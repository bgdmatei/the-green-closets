import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import {
  getCategories,
  getCategoryBySlug,
  getPostsByCategory,
} from "@/features/blog/api/blog.services";
import { PostCard } from "@/features/blog/components/post-card";
import { buildPageMetadata } from "@/lib/metadata";

export const dynamicParams = false;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async (): Promise<
  Array<{ slug: string }>
> => {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
};

export const generateMetadata = async ({
  params,
}: CategoryPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category not found" };
  }

  return buildPageMetadata({
    title: category.name,
    description: `Articles filed under ${category.name}.`,
    path: `/category/${category.slug}`,
  });
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug),
  ]);

  if (!category || posts.length === 0) {
    notFound();
  }

  return (
    <Container as="section" className="space-y-8">
      <TextLink href="/" tone="muted" size="xs">
        &larr; All articles
      </TextLink>

      <header className="space-y-2">
        <Heading as="h1" size="lg">
          {category.name}
        </Heading>
        <Text size="sm" tone="muted">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </Text>
      </header>

      <Divider />

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug} className="contents">
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
