import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { SectionHeader } from "@/components/ui/section-header";
import { TextLink } from "@/components/ui/link";
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
    <section className="py-14 md:py-20">
      <Container className="space-y-10">
        <TextLink href="/journal" tone="muted" size="sm" underline="hover">
          <span aria-hidden>&larr;</span> Journal
        </TextLink>

        <SectionHeader
          as="h1"
          title="Filed under"
          accent={category.name}
          action={{ href: "/journal", label: "All stories" }}
        />

        <Divider />

        <ul className="grid gap-x-8 gap-y-12 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug} className="contents">
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
