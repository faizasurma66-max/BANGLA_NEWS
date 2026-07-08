import { Check, X, ExternalLink } from "lucide-react";
import { adminListSubmissions, adminListCategories } from "@/lib/admin-queries";
import { approveSubmission, rejectSubmission } from "@/lib/actions/admin";
import { hasServiceRole } from "@/lib/env";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
  const [subs, cats] = await Promise.all([
    adminListSubmissions(),
    adminListCategories(),
  ]);
  const catOptions = cats.filter((c) => c.section_type !== "division_grid");
  const pending = subs.filter((s) => s.status === "pending");
  const handled = subs.filter((s) => s.status !== "pending");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-2xl font-semibold text-ink">Submissions</h1>
      <p className="mt-1 text-sm text-muted">
        {pending.length} pending · {handled.length} handled
      </p>

      {!hasServiceRole() ? (
        <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-6 text-sm text-amber-900">
          Connect Supabase to receive and moderate submissions.
        </div>
      ) : pending.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line bg-surface px-4 py-12 text-center text-sm text-muted">
          No submissions waiting for review. 🎉
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {pending.map((s) => (
            <div key={s.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{s.outlet_name}</p>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-0.5 inline-flex items-center gap-1 text-sm text-accent hover:underline"
                  >
                    {s.url} <ExternalLink className="h-3 w-3" />
                  </a>
                  {s.notes && <p className="mt-2 text-sm text-muted">{s.notes}</p>}
                  <p className="mt-2 text-xs text-faint">
                    {s.submitter_email ? `${s.submitter_email} · ` : ""}
                    {formatDate(s.created_at)}
                    {s.category_suggestion ? ` · suggested: ${s.category_suggestion}` : ""}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <form action={approveSubmission} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={s.id} />
                  <select
                    name="category_slug"
                    required
                    defaultValue=""
                    className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
                  >
                    <option value="" disabled>
                      Publish into…
                    </option>
                    {catOptions.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                </form>
                <form action={rejectSubmission}>
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-band"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {handled.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-faint">History</h2>
          <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
            {handled.slice(0, 20).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{s.outlet_name}</p>
                  <p className="truncate text-xs text-faint">{s.url}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-band text-muted"
                  }`}
                >
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
