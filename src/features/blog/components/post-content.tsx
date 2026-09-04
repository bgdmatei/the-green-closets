import { renderMarkdown } from "@/lib/markdown";

interface PostContentProps {
  /** Markdown source, as written in the backoffice. */
  content: string;
}

export const PostContent = ({ content }: PostContentProps) => {
  return (
    <div
      className="prose prose-article max-w-none font-body"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};
