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
import { GROUPS } from "@/lib/site-config";

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
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Directory" },
          { label: category.title },
        ]}
        kicker={GROUPS[category.group]}
        title={category.title}
        titleBn={category.title_bn}
        description={category.description}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CategoryFilter outlets={outlets} globalOpenExternal={globalOpenExternal} />
      </div>
    </>
  );
}
