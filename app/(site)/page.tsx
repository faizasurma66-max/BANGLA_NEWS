import {
  getHomeSections,
  getAllOutlets,
  getDivisions,
  getDefaultOpenExternal,
  getHomePosts,
} from "@/lib/queries";
import { SectionHeader } from "@/components/site/section-header";
import { OutletGrid } from "@/components/site/outlet-grid";
import { DivisionTiles } from "@/components/site/division-tiles";
import { OutletSearch, type SearchItem } from "@/components/site/outlet-search";
import { LazySection } from "@/components/site/lazy-section";
import { SkeletonGrid, SkeletonSectionHeader } from "@/components/site/skeleton";
import { BlogGrid } from "@/components/site/blog-grid";

export const revalidate = 3600;

const PREVIEW_LIMIT = 12;
const EAGER_SECTIONS = 2;

export default async function HomePage() {
  const [sections, allOutlets, divisions, globalOpenExternal, homePosts] =
    await Promise.all([
      getHomeSections(),
      getAllOutlets(),
      getDivisions(),
      getDefaultOpenExternal(),
      getHomePosts(6),
    ]);

  const searchItems: SearchItem[] = allOutlets.map((o) => ({
    id: o.id,
    slug: o.slug,
    name: o.name,
    name_bn: o.name_bn,
    url: o.url,
    category_slug: o.category_slug,
    open_external: o.open_external,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Slim search — no hero */}
      <div className="mx-auto flex max-w-2xl justify-center border-b border-line pb-6">
        <OutletSearch items={searchItems} globalOpenExternal={globalOpenExternal} />
      </div>

      {/* News categories — directly */}
      <div className="mt-8 space-y-10">
        {sections.map(({ category, outlets, children }, idx) => {
          const content = (
            <section id={category.slug} className="scroll-mt-24">
              {category.section_type === "division_grid" ? (
                <>
                  <SectionHeader
                    kicker="Regional"
                    title={category.title}
                    titleBn={category.title_bn}
                    href="/local"
                    hrefLabel="All divisions"
                  />
                  <div className="mt-5">
                    <DivisionTiles divisions={children ?? divisions} />
                  </div>
                </>
              ) : (
                <>
                  <SectionHeader
                    kicker={kickerFor(category.group)}
                    title={category.title}
                    titleBn={category.title_bn}
                    href={`/category/${category.slug}`}
                    hrefLabel={
                      outlets.length > PREVIEW_LIMIT ? `All ${outlets.length}` : "Open"
                    }
                  />
                  <div className="mt-5">
                    <OutletGrid
                      outlets={outlets}
                      limit={PREVIEW_LIMIT}
                      globalOpenExternal={globalOpenExternal}
                    />
                  </div>
                </>
              )}
            </section>
          );

          if (idx < EAGER_SECTIONS) return <div key={category.slug}>{content}</div>;

          return (
            <LazySection
              key={category.slug}
              skeleton={
                <div>
                  <SkeletonSectionHeader />
                  <div className="mt-5">
                    <SkeletonGrid count={PREVIEW_LIMIT} />
                  </div>
                </div>
              }
            >
              {content}
            </LazySection>
          );
        })}
      </div>

      {/* From the Blog — admin-curated cards */}
      {homePosts.length > 0 && (
        <section id="blog" className="mt-12 scroll-mt-24">
          <SectionHeader
            kicker="Journal"
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

function kickerFor(group: string): string {
  const map: Record<string, string> = {
    newspapers: "Daily Press",
    portals: "Online",
    tv: "Television",
    english: "English",
    stock: "Business",
    radio: "On Air",
    jobs: "Careers",
    government: "Official",
    assam: "Assam, India",
    epaper: "Digital Editions",
  };
  return map[group] ?? "Directory";
}
