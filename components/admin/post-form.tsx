"use client";

import { useActionState } from "react";
import { upsertPost, type FormState } from "@/lib/actions/admin";
import { Field, TextArea, Checkbox, SubmitBar, ErrorBanner } from "./form-kit";
import type { Post } from "@/lib/types";

export function PostForm({ post }: { post: Post | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(upsertPost, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="max-w-3xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <ErrorBanner message={state.error} />
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" name="title" required defaultValue={post?.title} error={fe.title} placeholder="Post title" />
        <Field label="Slug" name="slug" required defaultValue={post?.slug} error={fe.slug} hint="lowercase-with-hyphens" placeholder="my-first-post" />
        <div className="sm:col-span-2">
          <Field label="Cover image URL" name="cover_image" defaultValue={post?.cover_image} error={fe.cover_image} placeholder="https://…/cover.jpg" />
        </div>
        <div className="sm:col-span-2">
          <TextArea label="Excerpt" name="excerpt" defaultValue={post?.excerpt} error={fe.excerpt} rows={2} placeholder="Short summary shown in the blog list." />
        </div>
        <div className="sm:col-span-2">
          <TextArea label="Content (Markdown)" name="content" defaultValue={post?.content} error={fe.content} rows={16} mono placeholder={"# Heading\n\nWrite in **Markdown**…"} />
        </div>
        <Checkbox label="Published (visible on /blog)" name="published" defaultChecked={post?.published ?? false} />
      </div>

      <SubmitBar pending={pending} label={post ? "Update post" : "Create post"} cancelHref="/admin/posts" />
    </form>
  );
}
