import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { adminListCategories } from "@/lib/admin-queries";
import { deleteCategory } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import { hasServiceRole } from "@/lib/env";
import { GROUPS } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await adminListCategories();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Categories</h1>
          <p className="mt-1 text-sm text-muted">{categories.length} total</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          <Plus className="h-4 w-4" /> New category
        </Link>
      </div>

      {!hasServiceRole() ? (
        <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-6 text-sm text-amber-900">
          Connect Supabase to manage categories.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Group</th>
                <th className="px-4 py-3 font-semibold">Home</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {categories.map((c) => (
                <tr key={c.slug} className="hover:bg-band/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{c.title}</p>
                    <p className="text-xs text-faint">/{c.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{GROUPS[c.group] ?? c.group}</td>
                  <td className="px-4 py-3 text-muted">{c.home ? "Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/categories/${c.slug}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-band"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <DeleteButton action={deleteCategory} hidden={{ slug: c.slug }} confirmText={`Delete “${c.title}”? Outlets in it may be affected.`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
