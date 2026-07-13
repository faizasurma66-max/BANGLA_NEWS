import Link from "next/link";
import { Plus, Pencil, ExternalLink, ChevronUp, ChevronDown, Star } from "lucide-react";
import { adminListPosts } from "@/lib/admin-queries";
import { deletePost, movePost, togglePostFeatured } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/delete-button";
import { hasServiceRole } from "@/lib/env";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await adminListPosts();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Blog Posts</h1>
          <p className="mt-1 text-sm text-muted">
            {posts.length} total · ★ features on the homepage · ↑ ↓ sets the order
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      {!hasServiceRole() ? (
        <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-6 text-sm text-amber-900">
          Connect Supabase to write and publish posts.
        </div>
      ) : posts.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line bg-surface px-4 py-12 text-center text-sm text-muted">
          No posts yet. Write your first one.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
          {posts.map((p, i) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
              <div className="flex min-w-0 items-center gap-2">
                {/* Order */}
                <div className="flex flex-col">
                  <MoveBtn id={p.id} dir="up" disabled={i === 0} />
                  <MoveBtn id={p.id} dir="down" disabled={i === posts.length - 1} />
                </div>
                {/* Feature toggle */}
                <form action={togglePostFeatured}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="next" value={p.featured ? "false" : "true"} />
                  <button
                    type="submit"
                    title={p.featured ? "Featured on homepage — click to unfeature" : "Feature on homepage"}
                    aria-pressed={!!p.featured}
                    className={`grid h-7 w-7 place-items-center rounded-lg transition ${
                      p.featured ? "bg-accent-soft text-accent" : "text-faint hover:bg-band hover:text-ink"
                    }`}
                  >
                    <Star className={`h-4 w-4 ${p.featured ? "fill-current" : ""}`} />
                  </button>
                </form>
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{p.title}</p>
                  <p className="truncate text-xs text-faint">
                    /{p.slug} · {formatDate(p.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    p.published ? "bg-emerald-50 text-emerald-700" : "bg-band text-muted"
                  }`}
                >
                  {p.published ? "Published" : "Draft"}
                </span>
                {p.published && (
                  <a
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg px-2 py-1.5 text-muted hover:bg-band"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <Link
                  href={`/admin/posts/${p.id}`}
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-band"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <DeleteButton action={deletePost} hidden={{ id: p.id }} confirmText={`Delete “${p.title}”?`} />
              </div>
            </li>
          ))}
        </ul>
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
    <form action={movePost}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={dir === "up" ? "Move up" : "Move down"}
        className="grid h-4 w-5 place-items-center rounded text-muted transition hover:bg-band hover:text-accent disabled:opacity-30"
      >
        {dir === "up" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
    </form>
  );
}
