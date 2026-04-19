import { sanitizeRichHtml } from "@/lib/sanitize-html";

interface PostContentProps {
  contentHtml: string;
}

export const PostContent = ({ contentHtml }: PostContentProps) => {
  const safeHtml = sanitizeRichHtml(contentHtml);

  return (
    <div
      className="prose prose-zinc max-w-none prose-a:text-blue-700"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
};
