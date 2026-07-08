import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { adminListPosts } from "@/lib/admin-queries";
import { deletePost } from "@/lib/actions/admin";
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
          <p className="mt-1 text-sm text-muted">{posts.length} total</p>
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
          {posts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{p.title}</p>
                <p className="truncate text-xs text-faint">
                  /{p.slug} · {formatDate(p.created_at)}
                </p>
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
