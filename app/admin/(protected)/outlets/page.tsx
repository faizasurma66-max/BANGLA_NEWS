import Link from "next/link";
import {
  Plus,
  Pencil,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { adminListOutlets, adminListCategories } from "@/lib/admin-queries";
import type { AdminOutlet } from "@/lib/admin-queries";
import { deleteOutlet, moveOutlet } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import { hasServiceRole } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function OutletsPage() {
  const [outlets, categories] = await Promise.all([
    adminListOutlets(),
    adminListCategories(),
  ]);

  // Group outlets by category (outlets already come sorted by sort_order asc).
  const groups = new Map<string, AdminOutlet[]>();
  for (const o of outlets) {
    const key = o.category_slug ?? "__uncategorized";
    const arr = groups.get(key) ?? [];
    arr.push(o);
    groups.set(key, arr);
  }

  // Order the groups by the category list; append any leftover keys at the end.
  const ordered = categories
    .filter((c) => c.section_type !== "division_grid" && groups.has(c.slug))
    .map((c) => ({ slug: c.slug, title: c.title, items: groups.get(c.slug)! }));
  const known = new Set(ordered.map((g) => g.slug));
  for (const [slug, items] of groups) {
    if (!known.has(slug)) {
      const title =
        categories.find((c) => c.slug === slug)?.title ??
        (slug === "__uncategorized" ? "Uncategorized" : slug);
      ordered.push({ slug, title, items });
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Outlets</h1>
          <p className="mt-1 text-sm text-muted">
            {outlets.length} total · grouped by category · use ↑ ↓ to reorder within a category
          </p>
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
        <div className="mt-6 space-y-8">
          {ordered.map((group) => (
            <section key={group.slug}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-ink">
                  {group.title}
                  <span className="ml-2 text-xs font-normal text-faint">
                    {group.items.length}
                  </span>
                </h2>
                {group.slug !== "__uncategorized" && (
                  <Link
                    href={`/admin/outlets/new?category=${group.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add here
                  </Link>
                )}
              </div>
              <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-line">
                    {group.items.map((o, i) => (
                      <tr key={o.id} className="hover:bg-band/50">
                        <td className="w-12 py-2.5 pl-3 pr-1">
                          <div className="flex flex-col">
                            <MoveBtn id={o.id} dir="up" disabled={i === 0} />
                            <MoveBtn
                              id={o.id}
                              dir="down"
                              disabled={i === group.items.length - 1}
                            />
                          </div>
                        </td>
                        <td className="px-2 py-2.5">
                          <p className="font-medium text-ink">{o.name}</p>
                          {o.name_bn && (
                            <p className="font-bangla text-xs text-muted">{o.name_bn}</p>
                          )}
                        </td>
                        <td className="px-2 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            <Badge tone={o.is_active ? "green" : "grey"}>
                              {o.is_active ? "Active" : "Hidden"}
                            </Badge>
                            {o.is_featured && <Badge tone="red">Top</Badge>}
                          </div>
                        </td>
                        <td className="px-2 py-2.5 text-right tabular-nums text-muted">
                          {o.click_count}
                        </td>
                        <td className="px-2 py-2.5">
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
                            <DeleteButton
                              action={deleteOutlet}
                              hidden={{ id: o.id }}
                              confirmText={`Delete “${o.name}”?`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function MoveBtn({
  id,
  dir,
  disabled,
}: {
  id: string;
  dir: "up" | "down";
  disabled: boolean;
}) {
  return (
    <form action={moveOutlet}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={dir === "up" ? "Move up" : "Move down"}
        className="grid h-4 w-5 place-items-center rounded text-muted transition hover:bg-band hover:text-accent disabled:opacity-30"
      >
        {dir === "up" ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>
    </form>
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
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {children}
    </span>
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
