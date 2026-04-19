import Link from "next/link";

import type { BlogPost } from "@/features/blog/types/blog.types";
import type { Locale } from "@/lib/i18n";

interface BlogCardProps {
  post: BlogPost;
  locale: Locale;
}

export const BlogCard = ({ post, locale }: BlogCardProps) => {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{post.categoryName}</p>
      <h2 className="mt-2 text-xl font-semibold text-zinc-900">{post.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{post.excerpt}</p>
      <div className="mt-4 flex items-center justify-between">
        <time className="text-xs text-zinc-500">{post.publishedAt}</time>
        <Link
          className="text-sm font-medium text-blue-700 hover:underline"
          href={`/${locale}/blog/${post.slug}`}
        >
          Read article
        </Link>
      </div>
    </article>
  );
};
