import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminListCategories } from "@/lib/admin-queries";
import { OutletForm } from "@/components/admin/outlet-form";

export const dynamic = "force-dynamic";

export default async function NewOutletPage() {
  const cats = (await adminListCategories()).filter(
    (c) => c.section_type !== "division_grid",
  );

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/outlets" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
        <ChevronLeft className="h-4 w-4" /> Outlets
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">New outlet</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Add a newspaper, portal, radio station or ePaper.</p>
      <OutletForm outlet={null} categories={cats.map((c) => ({ slug: c.slug, title: c.title }))} />
    </div>
  );
}
