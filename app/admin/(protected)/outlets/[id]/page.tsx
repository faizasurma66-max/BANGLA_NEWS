import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { adminGetOutlet, adminListCategories } from "@/lib/admin-queries";
import { OutletForm } from "@/components/admin/outlet-form";

export const dynamic = "force-dynamic";

export default async function EditOutletPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [outlet, cats] = await Promise.all([
    adminGetOutlet(id),
    adminListCategories(),
  ]);
  if (!outlet) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/outlets" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
        <ChevronLeft className="h-4 w-4" /> Outlets
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">Edit outlet</h1>
      <p className="mb-6 mt-1 text-sm text-muted">{outlet.name}</p>
      <OutletForm
        outlet={outlet}
        categories={cats
          .filter((c) => c.section_type !== "division_grid")
          .map((c) => ({ slug: c.slug, title: c.title }))}
      />
    </div>
  );
}
