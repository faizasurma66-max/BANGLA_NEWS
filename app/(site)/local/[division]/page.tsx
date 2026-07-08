import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getCategory,
  getOutletsByCategory,
} from "@/lib/queries";
import { PageHero } from "@/components/site/page-hero";
import { CategoryFilter } from "@/components/site/category-filter";

export const revalidate = 3600;

type Params = { params: Promise<{ division: string }> };

export async function generateStaticParams() {
  const cats = await getAllCategories();
  return cats
    .filter((c) => c.parent_slug === "local-newspaper")
    .map((c) => ({ division: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { division } = await params;
  const category = await getCategory(division);
  if (!category) return { title: "Division" };
  return {
    title: `${category.title} Newspapers`,
    description:
      category.description ?? `Local newspapers of ${category.title}.`,
  };
}

export default async function DivisionPage({ params }: Params) {
  const { division } = await params;
  const category = await getCategory(division);
  if (!category || category.parent_slug !== "local-newspaper") notFound();

  const outlets = await getOutletsByCategory(division);

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Local Newspaper", href: "/local" },
          { label: category.title },
        ]}
        kicker="Division"
        accent={category.accent}
        title={category.title}
        titleBn={category.title_bn}
        description={
          category.description ??
          `Local and regional newspapers published across ${category.title}.`
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CategoryFilter outlets={outlets} />
      </div>
    </>
  );
}
