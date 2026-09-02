import { sanitizeRichHtml } from "@/lib/sanitize-html";

interface PostContentProps {
  contentHtml: string;
}

export const PostContent = ({ contentHtml }: PostContentProps) => {
  const safeHtml = sanitizeRichHtml(contentHtml);

  return (
    <div
      className="prose prose-article max-w-none font-body"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};
