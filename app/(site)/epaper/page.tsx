import type { Metadata } from "next";
import { getCategory, getOutletsByCategory } from "@/lib/queries";
import { PageHero } from "@/components/site/page-hero";
import { CategoryFilter } from "@/components/site/category-filter";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bangla ePaper Editions",
  description:
    "Digital replica ePaper editions of the leading Bangla daily newspapers — read the printed paper online.",
};

export default async function EpaperPage() {
  const [category, outlets] = await Promise.all([
    getCategory("epaper"),
    getOutletsByCategory("epaper"),
  ]);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Bangla ePaper" }]}
        kicker="Digital Editions"
        title={category?.title ?? "Bangla ePaper Editions"}
        titleBn={category?.title_bn}
        description={category?.description}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CategoryFilter outlets={outlets} />
      </div>
    </>
  );
}
