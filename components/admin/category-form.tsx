"use client";

import { useActionState } from "react";
import { upsertCategory, type FormState } from "@/lib/actions/admin";
import { Field, TextArea, Select, Checkbox, SubmitBar, ErrorBanner } from "./form-kit";
import { GROUPS } from "@/lib/site-config";
import type { Category } from "@/lib/types";

export function CategoryForm({ category }: { category: Category | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(upsertCategory, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="max-w-2xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <ErrorBanner message={state.error} />
      {category && <input type="hidden" name="original_slug" value={category.slug} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Slug" name="slug" required defaultValue={category?.slug} error={fe.slug} hint="lowercase-with-hyphens" placeholder="online-portals" />
        <Field label="Sort order" name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} error={fe.sort_order} />
        <Field label="Title" name="title" required defaultValue={category?.title} error={fe.title} placeholder="Top Online Bangla News Portals" />
        <Field label="Bangla title" name="title_bn" defaultValue={category?.title_bn} error={fe.title_bn} placeholder="অনলাইন বাংলা নিউজ পোর্টাল" />
        <div className="sm:col-span-2">
          <TextArea label="Description" name="description" defaultValue={category?.description} error={fe.description} rows={3} />
        </div>
        <Select
          label="Group"
          name="group_key"
          required
          defaultValue={category?.group ?? "portals"}
          error={fe.group_key}
          options={Object.entries(GROUPS).map(([value, label]) => ({ value, label }))}
        />
        <Select
          label="Section type"
          name="section_type"
          defaultValue={category?.section_type ?? "outlet_grid"}
          options={[
            { value: "outlet_grid", label: "Outlet grid (logo tiles)" },
            { value: "division_grid", label: "Division grid (map tiles)" },
          ]}
        />
        <Field label="Parent slug" name="parent_slug" defaultValue={category?.parent_slug} hint="e.g. local-newspaper (for divisions). Leave blank for top-level." placeholder="" />
        <Field label="Accent color" name="accent" defaultValue={category?.accent} hint="hex, e.g. #E8A100 (for division tiles)" placeholder="#c8102e" />

        <Checkbox label="Show on homepage" name="show_on_home" defaultChecked={category?.home ?? false} />
        <Checkbox label="Active" name="is_active" defaultChecked={category?.is_active ?? true} />
      </div>

      <SubmitBar pending={pending} label={category ? "Update category" : "Create category"} cancelHref="/admin/categories" />
    </form>
  );
}
