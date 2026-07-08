"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { hasServiceRole } from "@/lib/env";
import { supabaseAdmin, LOGO_BUCKET } from "@/lib/supabase/admin";
import { outletInput, categoryInput, postInput } from "@/lib/validation";
import { slugify } from "@/lib/seed-data";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

/** Verify admin + Supabase writes are possible. Returns an error string or null. */
async function ensureCanWrite(): Promise<string | null> {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!hasServiceRole()) {
    return "Supabase is not configured for writes. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.";
  }
  return null;
}

function bool(formData: FormData, key: string): boolean {
  const v = formData.get(key);
  return v === "on" || v === "true" || v === "1";
}

function num(formData: FormData, key: string, fallback = 0): number {
  const n = Number(formData.get(key));
  return Number.isFinite(n) ? n : fallback;
}

function collectFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}

/** Refresh all ISR pages that render directory content. */
function refreshDirectory() {
  revalidatePath("/", "layout");
}

/* -------------------------------------------------------------------------- */
/* Outlets                                                                     */
/* -------------------------------------------------------------------------- */

async function uploadLogoIfPresent(formData: FormData): Promise<string | null> {
  const file = formData.get("logo_file");
  if (!(file instanceof File) || file.size === 0) return null;
  const sb = supabaseAdmin();
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
  const { error } = await sb.storage
    .from(LOGO_BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: true });
  if (error) throw error;
  return sb.storage.from(LOGO_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function upsertOutlet(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const blocked = await ensureCanWrite();
  if (blocked) return { error: blocked };

  const parsed = outletInput.safeParse({
    name: formData.get("name"),
    name_bn: formData.get("name_bn") ?? "",
    url: formData.get("url"),
    category_slug: formData.get("category_slug"),
    logo_url: formData.get("logo_url") ?? "",
    description: formData.get("description") ?? "",
    is_featured: bool(formData, "is_featured"),
    is_active: bool(formData, "is_active"),
    open_external: bool(formData, "open_external"),
    sort_order: num(formData, "sort_order"),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: collectFieldErrors(parsed.error.issues) };
  }
  const data = parsed.data;
  const sb = supabaseAdmin();

  try {
    const { data: cat, error: catErr } = await sb
      .from("categories")
      .select("id")
      .eq("slug", data.category_slug)
      .single();
    if (catErr || !cat) return { error: "Selected category no longer exists." };

    const uploaded = await uploadLogoIfPresent(formData);
    const logo_url = uploaded ?? (data.logo_url || null);

    const row = {
      category_id: cat.id,
      name: data.name,
      name_bn: data.name_bn || null,
      url: data.url,
      logo_url,
      description: data.description || null,
      is_featured: data.is_featured,
      is_active: data.is_active,
      open_external: data.open_external,
      sort_order: data.sort_order,
    };

    const id = String(formData.get("id") ?? "");
    if (id) {
      const { error } = await sb.from("outlets").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await sb.from("outlets").insert(row);
      if (error) throw error;
    }
  } catch (e) {
    console.error("[admin] upsertOutlet failed:", e);
    return { error: "Could not save the outlet. Check server logs." };
  }

  refreshDirectory();
  redirect("/admin/outlets");
}

export async function deleteOutlet(formData: FormData) {
  const blocked = await ensureCanWrite();
  if (blocked) return;
  const id = String(formData.get("id") ?? "");
  if (id) {
    await supabaseAdmin().from("outlets").delete().eq("id", id);
    refreshDirectory();
  }
  redirect("/admin/outlets");
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                  */
/* -------------------------------------------------------------------------- */

export async function upsertCategory(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const blocked = await ensureCanWrite();
  if (blocked) return { error: blocked };

  const parsed = categoryInput.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    title_bn: formData.get("title_bn") ?? "",
    description: formData.get("description") ?? "",
    group_key: formData.get("group_key"),
    section_type: formData.get("section_type") ?? "outlet_grid",
    parent_slug: formData.get("parent_slug") ?? "",
    accent: formData.get("accent") ?? "",
    sort_order: num(formData, "sort_order"),
    show_on_home: bool(formData, "show_on_home"),
    is_active: bool(formData, "is_active"),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: collectFieldErrors(parsed.error.issues) };
  }
  const d = parsed.data;

  try {
    const sb = supabaseAdmin();
    const row = {
      slug: d.slug,
      title: d.title,
      title_bn: d.title_bn || null,
      description: d.description || null,
      group_key: d.group_key,
      section_type: d.section_type,
      parent_slug: d.parent_slug || null,
      accent: d.accent || null,
      sort_order: d.sort_order,
      show_on_home: d.show_on_home,
      is_active: d.is_active,
    };
    const originalSlug = String(formData.get("original_slug") ?? "");
    if (originalSlug) {
      const { error } = await sb.from("categories").update(row).eq("slug", originalSlug);
      if (error) throw error;
    } else {
      const { error } = await sb.from("categories").insert(row);
      if (error) throw error;
    }
  } catch (e) {
    console.error("[admin] upsertCategory failed:", e);
    return { error: "Could not save the category (slug may already exist)." };
  }

  refreshDirectory();
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const blocked = await ensureCanWrite();
  if (blocked) return;
  const slug = String(formData.get("slug") ?? "");
  if (slug) {
    await supabaseAdmin().from("categories").delete().eq("slug", slug);
    refreshDirectory();
  }
  redirect("/admin/categories");
}

/* -------------------------------------------------------------------------- */
/* Submissions                                                                 */
/* -------------------------------------------------------------------------- */

export async function approveSubmission(formData: FormData) {
  const blocked = await ensureCanWrite();
  if (blocked) return;

  const id = String(formData.get("id") ?? "");
  const categorySlug = String(formData.get("category_slug") ?? "");
  if (!id || !categorySlug) redirect("/admin/submissions");

  const sb = supabaseAdmin();
  try {
    const { data: sub } = await sb.from("submissions").select("*").eq("id", id).single();
    const { data: cat } = await sb.from("categories").select("id").eq("slug", categorySlug).single();
    if (sub && cat) {
      await sb.from("outlets").insert({
        category_id: cat.id,
        name: sub.outlet_name,
        url: sub.url,
        is_active: true,
        sort_order: 999,
      });
      await sb.from("submissions").update({ status: "approved" }).eq("id", id);
      refreshDirectory();
    }
  } catch (e) {
    console.error("[admin] approveSubmission failed:", e);
  }
  redirect("/admin/submissions");
}

export async function rejectSubmission(formData: FormData) {
  const blocked = await ensureCanWrite();
  if (blocked) return;
  const id = String(formData.get("id") ?? "");
  if (id) {
    await supabaseAdmin().from("submissions").update({ status: "rejected" }).eq("id", id);
  }
  redirect("/admin/submissions");
}

/* -------------------------------------------------------------------------- */
/* Posts                                                                       */
/* -------------------------------------------------------------------------- */

export async function upsertPost(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const blocked = await ensureCanWrite();
  if (blocked) return { error: blocked };

  const parsed = postInput.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") ?? "",
    content: formData.get("content"),
    cover_image: formData.get("cover_image") ?? "",
    published: bool(formData, "published"),
  });
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: collectFieldErrors(parsed.error.issues) };
  }
  const d = parsed.data;

  try {
    const sb = supabaseAdmin();
    const now = new Date().toISOString();
    const row = {
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt || null,
      content: d.content,
      cover_image: d.cover_image || null,
      published: d.published,
      published_at: d.published ? now : null,
      updated_at: now,
    };
    const id = String(formData.get("id") ?? "");
    if (id) {
      const { error } = await sb.from("posts").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await sb.from("posts").insert(row);
      if (error) throw error;
    }
  } catch (e) {
    console.error("[admin] upsertPost failed:", e);
    return { error: "Could not save the post (slug may already exist)." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  const blocked = await ensureCanWrite();
  if (blocked) return;
  const id = String(formData.get("id") ?? "");
  if (id) {
    await supabaseAdmin().from("posts").delete().eq("id", id);
    revalidatePath("/", "layout");
  }
  redirect("/admin/posts");
}

/* -------------------------------------------------------------------------- */
/* Settings                                                                    */
/* -------------------------------------------------------------------------- */

export async function updateGlobalSetting(formData: FormData) {
  const blocked = await ensureCanWrite();
  if (blocked) return;
  const key = String(formData.get("key") ?? "");
  const value = String(formData.get("value") ?? "");
  if (key) {
    await supabaseAdmin()
      .from("settings")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    refreshDirectory();
  }
}
