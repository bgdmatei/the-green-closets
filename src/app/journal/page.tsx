import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Accent, Heading } from "@/components/ui/heading";
import { getPosts } from "@/features/blog/api/blog.services";
import { PostListItem } from "@/features/blog/components/post-list-item";
import { buildPageMetadata } from "@/lib/metadata";

export const generateMetadata = async (): Promise<Metadata> =>
  buildPageMetadata({
    title: "Journal",
    description:
      "Guides, interviews and honest opinions on the brands and materials worth your money.",
    path: "/journal",
  });

export default async function JournalPage() {
  const posts = await getPosts();

  return (
    <Container width="prose" className="py-16 md:py-24">
      <header>
        <Eyebrow>The journal</Eyebrow>
        <Heading as="h1" size="lg" className="mt-4">
          Notes from a <Accent>greener</Accent> closet.
        </Heading>
        <p className="mt-6 max-w-xl text-lede leading-relaxed text-ink-muted">
          Guides, interviews and honest opinions on the brands and materials
          worth your money.
        </p>
      </header>

      {/*
        A contents list, not a grid: hairlines between entries and nothing
        above the first or below the last, so the column reads as one column
        of type rather than a set of boxes.
      */}
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
