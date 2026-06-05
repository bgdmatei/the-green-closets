import Link from "next/link";
import { BlogPost } from "../types/blog.types";
import { Text } from "./shadcn/Text";
import { ChevronRightIcon } from "@radix-ui/react-icons";

interface LatestCardProps {
  post: BlogPost;
}

export const LatestCard = ({ post }: LatestCardProps) => {
  return (
    <div className="bg-foreground p-6 rounded-xl flex flex-col">
      <Text as="h2" size="2xl" weight="normal">
        {post?.title}
      </Text>
      <Text as="h4" weight="light" className="my-4 line-clamp-2 max-w-100">
        {post.contentHtml}
      </Text>
      <div className="flex justify-end align-end items-end grow">
        <Link
          className="flex text-primary text-xs underline"
          href={`/articles/${post.slug}`}
        >
          Read More{" "}
          <Text as="span" size="xxs">
            <ChevronRightIcon className="mt-[2px]" width={16} height={16} />
          </Text>
        </Link>
      </div>
    </div>
  );
};
