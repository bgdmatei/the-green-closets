import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRightIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { FullBleed } from "@/components/ui/full-bleed";
import { Heading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { getPosts } from "@/features/blog/api/blog.services";
import { PostCard } from "@/features/blog/components/post-card";
import { formatPublishedDate } from "@/features/blog/lib/format-date";
import { ArticleTypes } from "@/features/blog/types/blog.types";
import { buildPageMetadata } from "@/lib/metadata";

export const generateMetadata = async (): Promise<Metadata> =>
  buildPageMetadata({
    title: "Sustainable style made easy",
    description:
      "Guides and essays on building a wardrobe that lasts — fibre choice, transparency, and buying less but better.",
    path: "/",
  });

export default async function Homepage() {
  const posts = await getPosts();

  const topPick = posts.find((post) => post.type === ArticleTypes.TopPick);
  // The featured post already has the hero; don't repeat it in the grid below.
  const latest = posts.filter((post) => post.slug !== topPick?.slug);

  return (
    <div className="space-y-16">
      {topPick ? (
        <Container as="section" aria-labelledby="top-pick-heading">
          <div className="md:relative">
            <Image
              className="w-full rounded-xl object-cover"
              src="/images/homepage/flowers.jpg"
              alt=""
              width={685}
              height={407}
              priority
              sizes="(min-width: 1152px) 1104px, 100vw"
            />

            <Card
              surface="raised"
              padding="lg"
              className="-mt-8 mx-4 gap-4 md:absolute md:inset-y-8 md:right-8 md:mx-0 md:mt-0 md:w-[46%] md:justify-center"
            >
              <Badge variant="inverse" className="self-start">
                {topPick.categoryName}
              </Badge>
              <Heading
                as="h1"
                id="top-pick-heading"
                size="lg"
                tone="inverse"
                className="text-pretty"
              >
                {topPick.title}
              </Heading>
              <Text size="sm" weight="light" tone="inverse" leading="relaxed">
                {topPick.excerpt}
              </Text>
              <div className="flex items-center justify-between gap-4 pt-2">
                <Text
                  as="time"
                  size="xs"
                  tone="inverse"
                  dateTime={topPick.publishedAt}
                >
                  {formatPublishedDate(topPick.publishedAt)}
                </Text>
                <TextLink
                  href={`/articles/${topPick.slug}`}
                  size="xs"
                  tone="inverse"
                  underline="always"
                >
                  Read more
                  <ChevronRightIcon aria-hidden width={14} height={14} />
                  <span className="sr-only">: {topPick.title}</span>
                </TextLink>
              </div>
            </Card>
          </div>
        </Container>
      ) : null}

      <FullBleed aria-labelledby="latest-heading">
        <Container className="space-y-8">
          <Divider />
          <Heading
            as="h2"
            id="latest-heading"
            size="md"
            tone="brand"
            uppercase
            align="center"
          >
            Latest articles
          </Heading>
          <ul className="grid gap-6 md:grid-cols-3">
            {latest.map((post) => (
              <li key={post.slug} className="contents">
                <PostCard post={post} variant="feature" />
              </li>
            ))}
          </ul>
        </Container>
      </FullBleed>

      <FullBleed aria-labelledby="connected-heading">
        <Container className="space-y-8">
          <Divider />
          <Heading
            as="h2"
            id="connected-heading"
            size="md"
            tone="brand"
            uppercase
            align="center"
          >
            Let&apos;s stay connected
          </Heading>
        </Container>
      </FullBleed>
    </div>
  );
}
