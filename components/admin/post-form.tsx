"use client";

import { useActionState, useState } from "react";
import { upsertPost, type FormState } from "@/lib/actions/admin";
import { TextArea, Checkbox, SubmitBar, ErrorBanner } from "./form-kit";
import { RichEditor } from "./rich-editor";
import { CoverImageField } from "./cover-image-field";
import { slugify } from "@/lib/seed-data";
import type { Post } from "@/lib/types";

export function PostForm({ post }: { post: Post | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(upsertPost, {});
  const fe = state.fieldErrors ?? {};

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));

  const onTitle = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent aria-[invalid=true]:border-accent";

  return (
    <form action={action} className="max-w-3xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <ErrorBanner message={state.error} />
      {post && <input type="hidden" name="id" value={post.id} />}
      {/* Preserve homepage order (managed by ↑/↓ on the posts list). */}
      <input type="hidden" name="sort_order" value={post?.sort_order ?? 0} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-ink-soft">
            Title <span className="text-accent">*</span>
          </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            aria-invalid={!!fe.title}
            placeholder="Post title"
            className={inputCls}
          />
          {fe.title && <p className="mt-1 text-xs text-accent">{fe.title}</p>}
        </div>

        <div>
          <label htmlFor="slug" className="text-sm font-medium text-ink-soft">
            Slug <span className="text-accent">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            aria-invalid={!!fe.slug}
            placeholder="my-first-post"
            className={inputCls}
          />
          {fe.slug ? (
            <p className="mt-1 text-xs text-accent">{fe.slug}</p>
          ) : (
            <p className="mt-1 text-xs text-faint">
              Auto-filled from the title — lowercase, hyphenated.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <CoverImageField defaultValue={post?.cover_image} error={fe.cover_image} />
        </div>

        <div className="sm:col-span-2">
          <TextArea label="Excerpt" name="excerpt" defaultValue={post?.excerpt} error={fe.excerpt} rows={2} placeholder="Short summary shown in the blog list." />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-ink-soft">
            Article <span className="text-accent">*</span>
          </label>
          <div className="mt-1.5">
            <RichEditor name="content" defaultValue={post?.content ?? ""} />
          </div>
          {fe.content && <p className="mt-1 text-xs text-accent">{fe.content}</p>}
          <p className="mt-1 text-xs text-faint">
            Use the toolbar for big/small headings, bold, lists, quotes and inline images.
          </p>
        </div>

        <Checkbox label="Published (visible on /blog)" name="published" defaultChecked={post?.published ?? false} />
        <Checkbox label="Feature on homepage" name="featured" defaultChecked={post?.featured ?? false} />
      </div>

      <SubmitBar pending={pending} label={post ? "Update post" : "Create post"} cancelHref="/admin/posts" />
    </form>
  );
}
