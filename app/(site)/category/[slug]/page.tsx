import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getCategory,
  getOutletsByCategory,
  getDefaultOpenExternal,
} from "@/lib/queries";
import { PageHero } from "@/components/site/page-hero";
import { CategoryFilter } from "@/components/site/category-filter";

export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const cats = await getAllCategories();
  return cats
    .filter((c) => c.section_type !== "division_grid")
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.title,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  if (category.section_type === "division_grid") redirect("/local");

  const [outlets, globalOpenExternal] = await Promise.all([
    getOutletsByCategory(slug),
    getDefaultOpenExternal(),
  ]);

  return (
    <>
      {/* No kicker: the group label ("NATIONAL NEWSPAPERS") restated the page
          title in smaller type and cost a whole line above the fold. The title
          alone carries it, the way /local reads as "Local Newspaper by Division". */}
      <PageHero
        title={category.title}
        titleBn={category.title_bn}
        description={category.description}
      />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <CategoryFilter outlets={outlets} globalOpenExternal={globalOpenExternal} />
      </div>
    </>
  );
}
