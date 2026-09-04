import Link from "next/link";
import { Text } from "@/components/ui/text";

import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { PostCover } from "@/features/blog/components/post-cover";
import { formatPublishedMonth } from "@/features/blog/lib/format-date";
import type { BlogPost } from "@/features/blog/types/blog.types";

interface PostListItemProps {
  post: BlogPost;
  /**
   * Set on the first entry only. Its cover is the largest thing painted above
   * the fold, so leaving it lazy delays the Largest Contentful Paint.
   */
  priority?: boolean;
}

/**
 * One entry in the journal index: month label, title, standfirst.
 *
 * Deliberately image-free and full-width rather than a card — the index reads
 * as a contents page, and the article itself supplies the imagery.
 */
export const PostListItem = ({ post, priority }: PostListItemProps) => {
  return (
    <article>
      <Link
        href={`/articles/${post.slug}`}
        className="group block py-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {post.coverImageUrl ? (
          <PostCover
            url={post.coverImageUrl}
            alt={post.coverImageAlt}
            priority={priority}
            className="mb-5 aspect-[3/1] w-full"
            sizes="(min-width: 768px) 720px, 100vw"
          />
        ) : null}

        <Eyebrow as="time" dateTime={post.publishedAt}>
          {formatPublishedMonth(post.publishedAt)}
        </Eyebrow>

        <Heading
          as="h2"
          size="sm"
          className="mt-2 group-hover:underline underline-offset-[6px] decoration-from-font"
        >
          {post.title}
        </Heading>

        <Text tone="muted" className="mt-2 leading-normal">
          {post.excerpt}
        </Text>
      </Link>
    </article>
  );
};
