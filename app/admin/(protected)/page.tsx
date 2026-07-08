import Link from "next/link";
import {
  Newspaper,
  FolderTree,
  Inbox,
  FileText,
  AlertTriangle,
  ArrowRight,
  Globe,
  Monitor,
} from "lucide-react";
import { adminStats, adminListSubmissions, adminGetSetting } from "@/lib/admin-queries";
import { updateGlobalSetting } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const stats = await adminStats();
  const submissions = stats.configured ? await adminListSubmissions() : [];
  const pending = submissions.filter((s) => s.status === "pending").slice(0, 5);
  const defaultOpenExternal = stats.configured
    ? (await adminGetSetting("default_open_external")) === "true"
    : false;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Manage the directory, submissions and blog.</p>

      {!stats.configured && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Supabase is not connected yet.</p>
            <p className="mt-1 text-amber-800">
              The public site is running on bundled seed data. To enable editing,
              submissions and click tracking, set <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code> and run the SQL in{" "}
              <code>supabase/schema.sql</code> + <code>supabase/seed.sql</code>. See the README.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard href="/admin/outlets" icon={Newspaper} label="Outlets" value={stats.outlets} />
        <StatCard href="/admin/categories" icon={FolderTree} label="Categories" value={stats.categories} />
        <StatCard href="/admin/submissions" icon={Inbox} label="Pending" value={stats.pendingSubmissions} accent />
        <StatCard href="/admin/posts" icon={FileText} label="Posts" value={stats.posts} />
      </div>

      {/* Global card behaviour toggle */}
      {stats.configured && (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">Default card behaviour</h2>
          <p className="mt-1 text-sm text-muted">
            When a user taps on an outlet card, should it open in the in-site viewer or redirect to the external website?
            Individual outlets can override this.
          </p>
          <div className="mt-4 flex gap-3">
            <form action={updateGlobalSetting}>
              <input type="hidden" name="key" value="default_open_external" />
              <input type="hidden" name="value" value="false" />
              <button
                type="submit"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  !defaultOpenExternal
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line bg-paper text-ink-soft hover:border-accent-ring"
                }`}
              >
                <Monitor className="h-4 w-4" />
                Open in-site viewer
              </button>
            </form>
            <form action={updateGlobalSetting}>
              <input type="hidden" name="key" value="default_open_external" />
              <input type="hidden" name="value" value="true" />
              <button
                type="submit"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                  defaultOpenExternal
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line bg-paper text-ink-soft hover:border-accent-ring"
                }`}
              >
                <Globe className="h-4 w-4" />
                Open external website
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink">Pending submissions</h2>
          <Link href="/admin/submissions" className="inline-flex items-center gap-1 text-sm text-accent">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {pending.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Nothing waiting for review. 🎉</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {pending.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{s.outlet_name}</p>
                  <p className="truncate text-xs text-muted">{s.url}</p>
                </div>
                <span className="shrink-0 text-xs text-faint">{formatDate(s.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  href,
  icon: Icon,
  label,
  value,
  accent,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-line bg-surface p-4 transition hover:border-accent-ring hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <Icon className={accent ? "h-4 w-4 text-accent" : "h-4 w-4 text-faint"} />
      </div>
      <p className="mt-2 font-serif text-3xl font-semibold text-ink">{value}</p>
    </Link>
  );
}
