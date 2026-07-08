import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { adminListOutlets } from "@/lib/admin-queries";
import { deleteOutlet } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import { hasServiceRole } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function OutletsPage() {
  const outlets = await adminListOutlets();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Outlets</h1>
          <p className="mt-1 text-sm text-muted">{outlets.length} total</p>
        </div>
        <Link
          href="/admin/outlets/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          <Plus className="h-4 w-4" /> New outlet
        </Link>
      </div>

      {!hasServiceRole() ? (
        <NotConfigured />
      ) : outlets.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line bg-surface px-4 py-12 text-center text-sm text-muted">
          No outlets yet. Run <code>supabase/seed.sql</code> or add one.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Clicks</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {outlets.map((o) => (
                <tr key={o.id} className="hover:bg-band/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{o.name}</p>
                    {o.name_bn && <p className="font-bangla text-xs text-muted">{o.name_bn}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted">{o.category_title ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge tone={o.is_active ? "green" : "grey"}>
                        {o.is_active ? "Active" : "Hidden"}
                      </Badge>
                      {o.is_featured && <Badge tone="red">Top</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-muted">{o.click_count}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={o.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg px-2 py-1.5 text-muted hover:bg-band"
                        title="Visit"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <Link
                        href={`/admin/outlets/${o.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-band"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <DeleteButton action={deleteOutlet} hidden={{ id: o.id }} confirmText={`Delete “${o.name}”?`} />
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

function Badge({
  tone,
  children,
}: {
  tone: "green" | "grey" | "red";
  children: React.ReactNode;
}) {
  const cls = {
    green: "bg-emerald-50 text-emerald-700",
    grey: "bg-band text-muted",
    red: "bg-accent-soft text-accent",
  }[tone];
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{children}</span>
  );
}

function NotConfigured() {
  return (
    <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-6 text-sm text-amber-900">
      Connect Supabase (set <code>SUPABASE_SERVICE_ROLE_KEY</code>) to manage outlets.
      The public site currently uses bundled seed data.
    </div>
  );
}
