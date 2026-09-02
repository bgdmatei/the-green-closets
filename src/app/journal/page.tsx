import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { MediaTile } from "@/components/ui/media-tile";
import { SectionHeader } from "@/components/ui/section-header";
import { getCategories, getPosts } from "@/features/blog/api/blog.services";
import { PostCard } from "@/features/blog/components/post-card";
import { TextLink } from "@/components/ui/link";
import { buildPageMetadata } from "@/lib/metadata";

export const generateMetadata = async (): Promise<Metadata> =>
  buildPageMetadata({
    title: "Journal",
    description:
      "Guides and interviews on building a wardrobe that lasts — fibre choice, transparency, and buying less but better.",
    path: "/journal",
  });

export default async function JournalPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  return (
    <>
      <section className="border-b border-border py-6 md:py-8">
        <Container>
          <h1 className="sr-only">Journal</h1>
          <MediaTile
            href={`/articles/${posts[0].slug}`}
            src="/images/banners/blog.jpg"
            ratio="banner"
            eyebrow="The journal"
            title="Read the"
            accent="journal"
            action="Guides & interviews"
            priority
            sizes="(min-width: 1280px) 1232px, 100vw"
          />
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="space-y-10">
          <SectionHeader title="Every" accent="story" />

          <nav aria-label="Categories">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <TextLink
                    href={`/category/${category.slug}`}
                    tone="muted"
                    underline="hover"
                  >
                    {category.name}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>

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
    </>
  );
}
