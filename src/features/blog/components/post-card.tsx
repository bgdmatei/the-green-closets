import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import { Heading } from "@/components/ui/heading";
import { formatPublishedDate } from "@/features/blog/lib/format-date";
import type { BlogPost } from "@/features/blog/types/blog.types";

interface PostCardProps {
  post: BlogPost;
  /** `feature` gives the lead article a larger display size. */
  variant?: "default" | "feature";
}

export const PostCard = ({ post, variant = "default" }: PostCardProps) => {
  const isFeature = variant === "feature";

  return (
    <article className="h-full">
      <Link
        href={`/articles/${post.slug}`}
        className="group flex h-full flex-col gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="flex items-baseline justify-between gap-3">
          <Eyebrow as="span">{post.categoryName}</Eyebrow>
          <time className="text-step--2 text-ink-muted" dateTime={post.publishedAt}>
            {formatPublishedDate(post.publishedAt)}
          </time>
        </div>

        <Heading
          as="h3"
          size={isFeature ? "md" : "sm"}
          className="group-hover:underline underline-offset-[6px] decoration-from-font"
        >
          {post.title}
        </Heading>

        <p className="text-step-0 leading-relaxed text-ink-muted">
          {post.excerpt}
        </p>

        <span className="mt-auto pt-4 font-display text-step-1 italic text-ink">
          Read more <span aria-hidden>&rarr;</span>
        </span>
      </Link>
    </article>
  );
};
