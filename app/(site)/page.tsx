import { getHomeSections, getHomePosts } from "@/lib/queries";
import { SectionHeader } from "@/components/site/section-header";
import { OutletGrid } from "@/components/site/outlet-grid";
import { DivisionTiles } from "@/components/site/division-tiles";
import { BlogGrid } from "@/components/site/blog-grid";

export const revalidate = 3600;

const PREVIEW_LIMIT = 12;

export default async function HomePage() {
  const [sections, homePosts] = await Promise.all([
    getHomeSections(),
    getHomePosts(3),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {sections.map(({ category, outlets, children }) => {
        // Division row (Local Newspapers)
        if (category.section_type === "division_grid") {
          return (
            <section key={category.slug} id={category.slug} className="scroll-mt-24">
              <SectionHeader
                title={category.title}
                titleBn={category.title_bn}
                href="/local"
                hrefLabel="All divisions"
              />
              <div className="mt-5">
                <DivisionTiles divisions={children ?? []} />
              </div>
            </section>
          );
        }

        // Category with its newspapers shown as small boxes directly below.
        if (outlets.length === 0) return null;
        return (
          <section key={category.slug} id={category.slug} className="scroll-mt-24">
            <SectionHeader
              title={category.title}
              titleBn={category.title_bn}
              href={`/category/${category.slug}`}
              hrefLabel={
                outlets.length > PREVIEW_LIMIT ? `View all ${outlets.length}` : "Open"
              }
            />
            <div className="mt-5">
              <OutletGrid outlets={outlets} limit={PREVIEW_LIMIT} compact />
            </div>
          </section>
        );
      })}

      {/* From the Blog — a short preview; full list lives at /blog */}
      {homePosts.length > 0 && (
        <section id="blog" className="scroll-mt-24">
          <SectionHeader
            title="From the Blog"
            titleBn="ব্লগ"
            description="News, guides and updates on the Bangla media landscape."
            href="/blog"
            hrefLabel="All articles"
          />
          <div className="mt-5">
            <BlogGrid posts={homePosts} />
          </div>
        </section>
      )}
    </div>
  );
}
