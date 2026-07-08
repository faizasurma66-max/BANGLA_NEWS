import type { Metadata } from "next";
import { getDivisions, getCategory } from "@/lib/queries";
import { PageHero } from "@/components/site/page-hero";
import { DivisionTiles } from "@/components/site/division-tiles";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Local Newspapers by Division",
  description:
    "Regional newspapers across Bangladesh's eight divisions — Dhaka, Mymensingh, Sylhet, Chattogram, Rangpur, Khulna, Rajshahi and Barisal.",
};

export default async function LocalPage() {
  const [divisions, parent] = await Promise.all([
    getDivisions(),
    getCategory("local-newspaper"),
  ]);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Local Newspaper" }]}
        kicker="Regional"
        title={parent?.title ?? "Local Newspaper by Division"}
        titleBn={parent?.title_bn}
        description={parent?.description}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <DivisionTiles divisions={divisions} />
      </div>
    </>
  );
}
