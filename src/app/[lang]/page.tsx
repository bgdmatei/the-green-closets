import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon } from "@radix-ui/react-icons";

import {
  getCategoriesByLocale,
  getPosts,
} from "@/features/blog/api/blog.services";
import { BlogCard } from "@/features/blog/components/blog-card";
import { getEnv } from "@/lib/env";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/metadata";
import Image from "next/image";
import { Text } from "@/features/blog/components/shadcn/Text";
import { ArticleTypes } from "@/features/blog/data/posts";
import { Divider } from "@/features/blog/components/shadcn/Divider";
import { LatestCard } from "@/features/blog/components/latest-card";

export const revalidate = 300;

interface LocalePageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Generates metadata for the locale homepage.
 */
export const generateMetadata = async ({
  params,
}: LocalePageProps): Promise<Metadata> => {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const env = getEnv();
  return buildPageMetadata(env.NEXT_PUBLIC_SITE_URL, {
    title: "Frontend Blog",
    description: "A small multilingual frontend-only blog built with Next.js.",
    locale: lang,
    path: "/",
  });
};

export default async function Homepage({ params }: LocalePageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const locale: Locale = lang;
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategoriesByLocale(locale),
  ]);

  const topPick = posts?.find((post) => post?.type === ArticleTypes.TopPage);

  return (
    <section className="space-y-10">
      <div className="relative p-4">
        <div>
          <Image
            className="rounded-lg"
            src="/images/homepage/flowers.jpg"
            alt="Flower basket"
            width={565}
            height={338}
          />
        </div>
        <div className="bg-foreground md:absolute md:w-[50%] top-[25%] left-[30%] rounded-lg px-6 py-4 mt-4">
          <Text
            as="h4"
            size="5xl"
            weight="normal"
            leading="tight"
            className="mb-6"
          >
            {topPick?.title}
          </Text>
          <Text as="h4" size="sm" weight="normal">
            {topPick?.excerpt}
          </Text>
          <div className="flex justify-between mt-4">
            <Text as="span" size="xxs" weight="normal">
              {topPick?.publishedAt}
            </Text>
            <Link
              className="flex text-primary text-xs underline"
              href={`/articles/${topPick?.slug}`}
            >
              Read More{" "}
              <Text as="span" size="xxs">
                <ChevronRightIcon className="mt-[2px]" width={16} height={16} />
              </Text>
            </Link>
          </div>
        </div>
      </div>

      <div className="md:-mx-[calc((100vw-72rem)/2)] w-screen space-y-4">
        <Divider orientation="horizontal" className="w-[98%] mr-4 ml-4" />
        <Text
          as="h1"
          size="3xl"
          variant="secondary"
          className="text-center uppercase font-title"
        >
          Latest Articles
        </Text>
        <div className="grid md:grid-cols-3 md:gap-6 gap-4 px-4">
          {posts &&
            posts.map((post) => <LatestCard key={post.slug} post={post} />)}
        </div>
      </div>

      <div className="md:-mx-[calc((100vw-72rem)/2)] w-screen space-y-4">
        <Divider orientation="horizontal" className="w-[98%] mr-4 ml-4" />
        <Text
          as="h1"
          size="3xl"
          variant="secondary"
          className="text-center uppercase font-title"
        >
          Let's stay connected
        </Text>
        <div className="bg-foreground"></div>
      </div>

      {/* <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100"
            key={category.slug}
            href={`/${locale}/category/${category.slug}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-zinc-500">
            No posts available for this locale yet.
          </p>
        ) : (
          posts.map((post) => <BlogCard key={post.slug} locale={locale} post={post} />)
        )}
      </div> */}
    </section>
  );
}
