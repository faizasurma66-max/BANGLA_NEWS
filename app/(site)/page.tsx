import { Sparkles } from "lucide-react";
import {
  getHomeSections,
  getAllOutlets,
  getAllCategories,
  getDivisions,
  getDefaultOpenExternal,
} from "@/lib/queries";
import { SectionHeader } from "@/components/site/section-header";
import { OutletGrid } from "@/components/site/outlet-grid";
import { DivisionTiles } from "@/components/site/division-tiles";
import { OutletSearch, type SearchItem } from "@/components/site/outlet-search";
import { LogoStrip } from "@/components/site/logo-strip";
import { LazySection } from "@/components/site/lazy-section";
import { SkeletonGrid, SkeletonSectionHeader } from "@/components/site/skeleton";
import {
  CategoryDirectory,
  type DirectoryItem,
} from "@/components/site/category-directory";
import { Converter } from "@/components/converter/converter";

export const revalidate = 3600;

const PREVIEW_LIMIT = 12;
const EAGER_SECTIONS = 2;

export default async function HomePage() {
  const [sections, allOutlets, cats, divisions, globalOpenExternal] =
    await Promise.all([
      getHomeSections(),
      getAllOutlets(),
      getAllCategories(),
      getDivisions(),
      getDefaultOpenExternal(),
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

  // Counts per category (divisions rolled up into "local-newspaper").
  const countBy: Record<string, number> = {};
  for (const o of allOutlets) {
    countBy[o.category_slug] = (countBy[o.category_slug] ?? 0) + 1;
  }
  const divisionTotal = cats
    .filter((c) => c.parent_slug === "local-newspaper")
    .reduce((n, c) => n + (countBy[c.slug] ?? 0), 0);

  const directory: DirectoryItem[] = cats
    .filter((c) => !c.parent_slug)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      title_bn: c.title_bn,
      href: c.section_type === "division_grid" ? "/local" : `/category/${c.slug}`,
      count: c.section_type === "division_grid" ? divisionTotal : countBy[c.slug] ?? 0,
    }));

  const totalOutlets = allOutlets.length;
  const totalCategories = directory.length;
  const featured = allOutlets.filter((o) => o.is_featured).slice(0, 14);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-band px-3 py-1 text-xs font-medium text-ink-soft">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              The curated Bangla media directory
            </span>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              Every Bangla newspaper,
              <span className="text-accent"> in one place.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
              National dailies, online portals, TV &amp; FM, ePapers, government
              sites, jobs and regional papers — organised, searchable and one tap
              away.
            </p>

            <div className="mx-auto mt-6 flex justify-center">
              <OutletSearch items={searchItems} globalOpenExternal={globalOpenExternal} />
            </div>

            <dl className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              <Stat value={`${totalOutlets}+`} label="Media outlets" />
              <Stat value={`${totalCategories}`} label="Categories" />
              <Stat value="8" label="Divisions" />
            </dl>

            <div className="mt-6 flex justify-center">
              <LogoStrip outlets={featured} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Category directory */}
        <section aria-labelledby="dir-heading">
          <SectionHeader
            kicker="Directory"
            title="Browse by category"
            description="Jump straight to any part of the Bangla media landscape."
          />
          <div className="mt-5">
            <CategoryDirectory items={directory} />
          </div>
        </section>

        {/* Outlet sections */}
        <div className="mt-14 space-y-12">
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

        {/* Bangla Converter — an integrated feature, not a separate tool */}
        <section id="converter" className="mt-14 scroll-mt-24">
          <SectionHeader
            kicker="Free Tool"
            title="Bangla Converter"
            titleBn="বাংলা কনভার্টার"
            description="Type in English and read in বাংলা, convert Bijoy ⇌ Unicode, and switch digits — right here."
            href="/converter"
            hrefLabel="Open full tool"
          />
          <div className="mt-5">
            <Converter />
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="sr-only">{label}</dt>
      <dd className="font-serif text-xl font-semibold text-ink">{value}</dd>
      <span className="text-sm text-muted">{label}</span>
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
