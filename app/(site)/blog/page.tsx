import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/queries";
import { PageHero } from "@/components/site/page-hero";
import { BlogGrid } from "@/components/site/blog-grid";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, updates and guides about Bangla newspapers, online portals and media.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        kicker="Journal"
        title="From the Blog"
        titleBn="ব্লগ"
        description="News, updates and guides on the Bangla media landscape."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <BlogGrid posts={posts} />
      </div>
    </>
  );
}
