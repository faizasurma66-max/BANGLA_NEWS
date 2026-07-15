"use client";

import { useActionState } from "react";
import { upsertOutlet, type FormState } from "@/lib/actions/admin";
import { Field, TextArea, Select, Checkbox, SubmitBar, ErrorBanner } from "./form-kit";
import type { AdminOutlet } from "@/lib/admin-queries";

export function OutletForm({
  outlet,
  categories,
  defaultCategory = "",
}: {
  outlet: AdminOutlet | null;
  categories: { slug: string; title: string }[];
  defaultCategory?: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(upsertOutlet, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="max-w-2xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <ErrorBanner message={state.error} />
      {outlet && <input type="hidden" name="id" value={outlet.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" required defaultValue={outlet?.name} error={fe.name} placeholder="e.g. Prothom Alo" />
        <Field label="Bangla name" name="name_bn" defaultValue={outlet?.name_bn} error={fe.name_bn} placeholder="প্রথম আলো" />
        <div className="sm:col-span-2">
          <Field label="Website URL" name="url" required type="url" defaultValue={outlet?.url} error={fe.url} placeholder="https://example.com" />
        </div>
        <Select
          label="Category"
          name="category_slug"
          required
          defaultValue={outlet?.category_slug ?? defaultCategory ?? ""}
          error={fe.category_slug}
          options={[
            { value: "", label: "— Choose category —" },
            ...categories.map((c) => ({ value: c.slug, label: c.title })),
          ]}
        />
        <Field
          label="Sort order"
          name="sort_order"
          type="number"
          defaultValue={outlet?.sort_order ?? ""}
          error={fe.sort_order}
          hint={outlet ? undefined : "Leave blank to add at the end of the category."}
        />

        <div className="sm:col-span-2">
          <Field label="Logo URL" name="logo_url" defaultValue={outlet?.logo_url} error={fe.logo_url} hint="Paste a logo URL, or upload a file below (upload wins)." placeholder="https://…/logo.png" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="logo_file" className="text-sm font-medium text-ink-soft">
            Upload logo (optional)
          </label>
          <input
            id="logo_file"
            name="logo_file"
            type="file"
            accept="image/*"
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-band file:px-3 file:py-1.5 file:text-sm file:text-ink"
          />
          <p className="mt-1 text-xs text-faint">Stored in the Supabase “logos” bucket.</p>
        </div>

        <div className="sm:col-span-2">
          <TextArea label="Description" name="description" defaultValue={outlet?.description} error={fe.description} rows={3} />
        </div>

        <Checkbox label="Featured (Top badge)" name="is_featured" defaultChecked={outlet?.is_featured ?? false} />
        <Checkbox label="Open externally (skip viewer)" name="open_external" defaultChecked={outlet?.open_external ?? false} />
        <Checkbox label="Active (visible on site)" name="is_active" defaultChecked={outlet?.is_active ?? true} />
      </div>

      <SubmitBar pending={pending} label={outlet ? "Update outlet" : "Create outlet"} cancelHref="/admin/outlets" />
    </form>
  );
}
