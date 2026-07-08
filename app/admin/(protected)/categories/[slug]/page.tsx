import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { adminGetCategory } from "@/lib/admin-queries";
import { CategoryForm } from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await adminGetCategory(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/categories" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
        <ChevronLeft className="h-4 w-4" /> Categories
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">Edit category</h1>
      <p className="mb-6 mt-1 text-sm text-muted">{category.title}</p>
      <CategoryForm category={category} />
    </div>
  );
}
