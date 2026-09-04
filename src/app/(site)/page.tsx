import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { List, ListItem } from "@/components/ui/list";
import { MediaTile } from "@/components/ui/media-tile";
import { SectionHeader } from "@/components/ui/section-header";
import { getFeaturedPosts } from "@/features/blog/api/blog.services";
import { FeaturedPostCard } from "@/features/blog/components/featured-post-card";
import { getNewArrivals } from "@/features/shop/api/shop.services";
import { ProductGrid } from "@/features/shop/components/product-grid";
import { buildPageMetadata } from "@/lib/metadata";

export const generateMetadata = async (): Promise<Metadata> =>
  buildPageMetadata({
    title: "The Green Closets — ethical shop",
    description:
      "An independent shop stitching together live product feeds from fashion brands we curate and rate ourselves.",
    path: "/",
  });

export default async function Homepage() {
  const [newArrivals, featured] = await Promise.all([
    getNewArrivals(8),
    getFeaturedPosts(2),
  ]);

  return (
    <>
      <section className="border-b border-border py-6 md:py-8">
        <Container>
          <h1 className="sr-only">The Green Closets — ethical shop</h1>
          <div className="grid gap-6 md:grid-cols-2">
            <MediaTile
              href="/journal"
              src="/images/banners/blog.jpg"
              eyebrow="The journal"
              title="Read the"
              accent="journal"
              action="Guides & interviews"
              priority
              sizes="(min-width: 768px) 604px, 100vw"
            />
            <MediaTile
              href="/shop"
              src="/images/banners/shop.jpg"
              eyebrow="The shop"
              title="Shop"
              accent="every brand"
              action="Browse the edit"
              priority
              sizes="(min-width: 768px) 604px, 100vw"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-6 md:py-8">
        <Container>
          <MediaTile
            href="/week-picks"
            src="/images/banners/weekly.jpg"
            ratio="banner"
            eyebrow="Fresh every Monday"
            title="This week's"
            accent="picks"
            action="See the edit"
            actionAsButton
            sizes="(min-width: 1280px) 1232px, 100vw"
          />
        </Container>
      </section>

      {/* Only rendered when something is actually featured. */}
      {featured.length > 0 ? (
        <section
          className="border-b border-border py-14 md:py-20"
          aria-labelledby="featured-heading"
        >
          <Container className="space-y-10">
            <SectionHeader
              id="featured-heading"
              title="From the"
              accent="journal"
              action={{ href: "/journal", label: "All stories" }}
            />
            <List layout="grid" gap="lg" columns={2}>
              {featured.map((post, index) => (
                <ListItem key={post.slug}>
                  <FeaturedPostCard post={post} priority={index === 0} />
                </ListItem>
              ))}
            </List>
          </Container>
        </section>
      ) : null}

      <section className="py-14 md:py-20" aria-labelledby="new-in-heading">
        <Container className="space-y-10">
          <SectionHeader
            id="new-in-heading"
            title="New in the"
            accent="closet"
            action={{ href: "/shop", label: "View all" }}
          />
          <ProductGrid products={newArrivals} priorityCount={4} />
        </Container>
      </section>
    </>
  );
}
