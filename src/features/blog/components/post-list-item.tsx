import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { formatPublishedMonth } from "@/features/blog/lib/format-date";
import type { BlogPost } from "@/features/blog/types/blog.types";

interface PostListItemProps {
  post: BlogPost;
}

/**
 * One entry in the journal index: month label, title, standfirst.
 *
 * Deliberately image-free and full-width rather than a card — the index reads
 * as a contents page, and the article itself supplies the imagery.
 */
export const PostListItem = ({ post }: PostListItemProps) => {
  return (
    <article>
      <Link
        href={`/articles/${post.slug}`}
        className="group block py-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
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

        <p className="mt-2 text-step-1 leading-normal text-ink-muted">
          {post.excerpt}
        </p>
      </Link>
    </article>
  );
};
