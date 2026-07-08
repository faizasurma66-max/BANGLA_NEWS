import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  getHomeSections,
  getAllOutlets,
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

export const revalidate = 3600;

const PREVIEW_LIMIT = 10;

/** Number of sections to render eagerly (above-the-fold). */
const EAGER_SECTIONS = 2;

export default async function HomePage() {
  const [sections, allOutlets, divisions, globalOpenExternal] = await Promise.all([
    getHomeSections(),
    getAllOutlets(),
    getDivisions(),
    getDefaultOpenExternal(),
  ]);

  const searchItems: SearchItem[] = allOutlets.map((o) => ({
    id: o.id,
    name: o.name,
    name_bn: o.name_bn,
    url: o.url,
    category_slug: o.category_slug,
    open_external: o.open_external,
  }));

  const totalOutlets = allOutlets.length;
  const totalCategories = sections.length;
  const featured = allOutlets.filter((o) => o.is_featured).slice(0, 12);

  return (
    <>
      {/* Hero */}
      <section className="bg-grain border-b border-line">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              The curated Bangla media directory
            </span>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Every Bangla newspaper,
              <br className="hidden sm:block" />
              <span className="text-accent"> in one fast index.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              National dailies, online portals, FM radio, ePapers, government
              sites, job boards and regional papers — organised, searchable and a
              single click away.
            </p>

            <div className="mt-8">
              <OutletSearch items={searchItems} globalOpenExternal={globalOpenExternal} />
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Stat value={`${totalOutlets}+`} label="Media outlets" />
              <Stat value={`${totalCategories}`} label="Categories" />
              <Stat value="8" label="Divisions covered" />
            </dl>

            <div className="mt-8">
              <LogoStrip outlets={featured} />
            </div>
          </div>
        </div>
      </section>

      {/* Directory sections */}
      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {sections.map(({ category, outlets, children }, idx) => {
          const sectionContent = (
            <section key={category.slug} id={category.slug} className="scroll-mt-24">
              {category.section_type === "division_grid" ? (
                <>
                  <SectionHeader
                    kicker="Regional"
                    title={category.title}
                    titleBn={category.title_bn}
                    description={category.description}
                    href="/local"
                    hrefLabel="All divisions"
                  />
                  <div className="mt-6">
                    <DivisionTiles divisions={children ?? divisions} />
                  </div>
                </>
              ) : (
                <>
                  <SectionHeader
                    kicker={kickerFor(category.group)}
                    title={category.title}
                    titleBn={category.title_bn}
                    description={category.description}
                    href={`/category/${category.slug}`}
                    hrefLabel={
                      outlets.length > PREVIEW_LIMIT
                        ? `All ${outlets.length}`
                        : "Open category"
                    }
                  />
                  <div className="mt-6">
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

          // First N sections render eagerly (above the fold)
          if (idx < EAGER_SECTIONS) {
            return <div key={category.slug}>{sectionContent}</div>;
          }

          // Below-fold sections lazy-render with skeleton placeholders
          return (
            <LazySection
              key={category.slug}
              skeleton={
                <div>
                  <SkeletonSectionHeader />
                  <div className="mt-6">
                    <SkeletonGrid count={PREVIEW_LIMIT} />
                  </div>
                </div>
              }
            >
              {sectionContent}
            </LazySection>
          );
        })}

        {/* Converter CTA */}
        <section className="overflow-hidden rounded-3xl border border-line bg-ink text-white">
          <div className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="max-w-xl">
              <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                Type in English, read in বাংলা
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                A free phonetic converter, Bijoy ⇌ Unicode tools and Bangla digit
                conversion — right here, no install.
              </p>
            </div>
            <Link
              href="/converter"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              Open Bangla Converter
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="flex items-baseline gap-2">
        <span className="font-serif text-2xl font-semibold text-ink">{value}</span>
        <span className="text-sm text-muted">{label}</span>
      </dd>
    </div>
  );
}

function kickerFor(group: string): string {
  const map: Record<string, string> = {
    newspapers: "Daily Press",
    portals: "Online",
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
