import type { Metadata } from "next";
import { getAllCategories } from "@/lib/queries";
import { PageHero } from "@/components/site/page-hero";
import { SubmitForm } from "@/components/site/submit-form";

export const metadata: Metadata = {
  title: "Submit a Site",
  description:
    "Suggest a Bangla newspaper, online portal, radio station or ePaper for the directory. Submissions are reviewed before publishing.",
};

export default async function SubmitPage() {
  const cats = await getAllCategories();
  const categories = cats
    .filter((c) => c.section_type !== "division_grid")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Submit a Site" }]}
        kicker="Contribute"
        title="Submit your site"
        description="Know a Bangla newspaper, portal, radio station or ePaper we're missing? Send it over — every submission is reviewed before it goes live."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <SubmitForm categories={categories} />
      </div>
    </>
  );
}
