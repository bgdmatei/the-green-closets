import Link from "next/link";
import { Text } from "@/components/ui/text";

import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { PostCover } from "@/features/blog/components/post-cover";
import { formatPublishedMonth } from "@/features/blog/lib/format-date";
import type { BlogPost } from "@/features/blog/types/blog.types";

interface FeaturedPostCardProps {
  post: BlogPost;
  priority?: boolean;
}

/**
 * A featured post on the front page.
 *
 * Falls back to a tonal panel when the post has no cover image, so featuring
 * one is never blocked on finding a picture — the image is optional by design.
 */
export const FeaturedPostCard = ({ post, priority }: FeaturedPostCardProps) => (
  <article>
    <Link
      href={`/articles/${post.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {post.coverImageUrl ? (
        <PostCover
          url={post.coverImageUrl}
          alt={post.coverImageAlt}
          priority={priority}
          className="aspect-[4/3] w-full"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-surface-raised" />
      )}

      <div className="mt-4 flex items-baseline gap-x-4">
        <Eyebrow as="span">{post.categoryName}</Eyebrow>
        <Eyebrow as="time" dateTime={post.publishedAt} className="ml-auto">
          {formatPublishedMonth(post.publishedAt)}
        </Eyebrow>
      </div>

      <Heading
        as="h3"
        size="sm"
        className="mt-2 group-hover:underline underline-offset-[6px] decoration-from-font"
      >
        {post.title}
      </Heading>

      <Text size="sm" leading="relaxed" tone="muted" className="mt-2">
        {post.excerpt}
      </Text>
    </Link>
  </article>
);
