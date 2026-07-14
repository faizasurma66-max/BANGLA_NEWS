import { getDivisions, getHomePosts } from "@/lib/queries";
import { SectionHeader } from "@/components/site/section-header";
import { DivisionTiles } from "@/components/site/division-tiles";
import { BlogGrid } from "@/components/site/blog-grid";

export const revalidate = 3600;

export default async function HomePage() {
  const [homePosts, divisions] = await Promise.all([
    getHomePosts(6),
    getDivisions(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* From the Blog — the home page lead */}
      <section id="blog" className="scroll-mt-24">
        <SectionHeader
          kicker="Journal"
          title="From the Blog"
          titleBn="ব্লগ"
          description="News, guides and updates on the Bangla media landscape."
          href="/blog"
          hrefLabel="All articles"
        />
        <div className="mt-6">
          <BlogGrid posts={homePosts} />
        </div>
      </section>

      {/* Local Newspapers by division */}
      <section id="local" className="mt-14 scroll-mt-24">
        <SectionHeader
          kicker="Regional"
          title="Local Newspapers"
          titleBn="স্থানীয় পত্রিকা"
          description="Regional dailies from all eight divisions of Bangladesh."
          href="/local"
          hrefLabel="All divisions"
        />
        <div className="mt-6">
          <DivisionTiles divisions={divisions} />
        </div>
      </section>
    </div>
  );
}
