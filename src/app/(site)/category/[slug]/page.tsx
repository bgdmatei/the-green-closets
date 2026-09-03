import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Accent, Heading } from "@/components/ui/heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { TextLink } from "@/components/ui/link";
import {
  getCategories,
  getCategoryBySlug,
  getPostsByCategory,
} from "@/features/blog/api/blog.services";
import { PostListItem } from "@/features/blog/components/post-list-item";
import { buildPageMetadata } from "@/lib/metadata";

/**
 * Posts are published from the backoffice, so the set is open: a slug that did
 * not exist at build time must still render. Next renders it on demand and
 * caches the result. `generateStaticParams` still prerenders everything that
 * exists at build time, so this only affects posts added afterwards.
 */
export const dynamicParams = true;

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
    <Container width="prose" className="py-16 md:py-24">
      <header>
        <Eyebrow>Category</Eyebrow>
        <Heading as="h1" size="lg" className="mt-4">
          Filed under <Accent>{category.name}</Accent>
        </Heading>
        <p className="mt-6 max-w-xl text-lede leading-relaxed text-ink-muted">
          {posts.length} {posts.length === 1 ? "story" : "stories"} in this
          corner of the journal.
        </p>
        <TextLink
          href="/journal"
          tone="muted"
          size="sm"
          underline="hover"
          className="mt-6"
        >
          <span aria-hidden>&larr;</span> All stories
        </TextLink>
      </header>

      <ul className="mt-16 divide-y divide-border md:mt-24">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostListItem post={post} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
