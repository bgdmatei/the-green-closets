import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { List, ListItem } from "@/components/ui/list";
import { Text } from "@/components/ui/text";
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
        <Text size="lede" tone="muted" leading="relaxed" className="mt-6 max-w-xl">
          Guides, interviews and honest opinions on the brands and materials
          worth your money.
        </Text>
      </header>

      {/*
        A contents list, not a grid: hairlines between entries and nothing
        above the first or below the last, so the column reads as one column
        of type rather than a set of boxes.
      */}
      <List layout="divided" gap="none" className="mt-16 md:mt-24">
        {posts.map((post, index) => (
          <ListItem key={post.slug}>
            <PostListItem post={post} priority={index === 0} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
