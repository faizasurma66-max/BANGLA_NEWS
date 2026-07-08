import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/categories" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
        <ChevronLeft className="h-4 w-4" /> Categories
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">New category</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Create a directory section.</p>
      <CategoryForm category={null} />
    </div>
  );
}
