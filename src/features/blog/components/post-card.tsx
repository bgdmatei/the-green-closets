import { ChevronRightIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { TextLink } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { formatPublishedDate } from "@/features/blog/lib/format-date";
import type { BlogPost } from "@/features/blog/types/blog.types";

interface PostCardProps {
  post: BlogPost;
  /**
   * `feature` is the house-green panel used for the homepage grid; `default`
   * is the lighter card used in category listings.
   */
  variant?: "default" | "feature";
}

export const PostCard = ({ post, variant = "default" }: PostCardProps) => {
  const isFeature = variant === "feature";

  return (
    <Card
      as="article"
      surface={isFeature ? "raised" : "plain"}
      className="h-full gap-3"
    >
      <Badge variant={isFeature ? "inverse" : "outline"} className="self-start">
        {post.categoryName}
      </Badge>

      <Heading
        as="h3"
        size="sm"
        tone={isFeature ? "inverse" : "default"}
        className="text-pretty"
      >
        {post.title}
      </Heading>

      <Text
        size="sm"
        weight="light"
        tone={isFeature ? "inverse" : "muted"}
        leading="relaxed"
        className="line-clamp-3"
      >
        {post.excerpt}
      </Text>

      <div className="mt-auto flex items-center justify-between gap-4 pt-4">
        <Text
          as="time"
          size="xs"
          tone={isFeature ? "inverse" : "muted"}
          dateTime={post.publishedAt}
        >
          {formatPublishedDate(post.publishedAt)}
        </Text>
        <TextLink
          href={`/articles/${post.slug}`}
          size="xs"
          tone={isFeature ? "inverse" : "default"}
          underline="always"
        >
          Read more
          <ChevronRightIcon aria-hidden width={14} height={14} />
          <span className="sr-only">: {post.title}</span>
        </TextLink>
      </div>
    </Card>
  );
};
