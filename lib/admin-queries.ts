import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { hasServiceRole } from "@/lib/env";
import type { Category, Post, Submission } from "@/lib/types";

export type AdminOutlet = {
  id: string;
  name: string;
  name_bn: string | null;
  url: string;
  logo_url: string | null;
  description: string | null;
  is_featured: boolean;
  is_active: boolean;
  open_external: boolean;
  sort_order: number;
  click_count: number;
  category_slug: string | null;
  category_title: string | null;
};

export async function adminListOutlets(): Promise<AdminOutlet[]> {
  if (!hasServiceRole()) return [];
  const { data } = await supabaseAdmin()
    .from("outlets")
    .select("*, category:categories(slug,title)")
    .order("sort_order", { ascending: true });
  return (data ?? []).map((r: Record<string, any>) => ({
    id: r.id,
    name: r.name,
    name_bn: r.name_bn,
    url: r.url,
    logo_url: r.logo_url,
    description: r.description,
    is_featured: r.is_featured,
    is_active: r.is_active,
    open_external: r.open_external ?? false,
    sort_order: r.sort_order ?? 0,
    click_count: r.click_count ?? 0,
    category_slug: r.category?.slug ?? null,
    category_title: r.category?.title ?? null,
  }));
}

export async function adminGetOutlet(id: string): Promise<AdminOutlet | null> {
  if (!hasServiceRole()) return null;
  const { data: r } = await supabaseAdmin()
    .from("outlets")
    .select("*, category:categories(slug,title)")
    .eq("id", id)
    .single();
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    name_bn: r.name_bn,
    url: r.url,
    logo_url: r.logo_url,
    description: r.description,
    is_featured: r.is_featured,
    is_active: r.is_active,
    open_external: r.open_external ?? false,
    sort_order: r.sort_order ?? 0,
    click_count: r.click_count ?? 0,
    category_slug: r.category?.slug ?? null,
    category_title: r.category?.title ?? null,
  };
}

export async function adminListCategories(): Promise<Category[]> {
  if (!hasServiceRole()) return [];
  const { data } = await supabaseAdmin()
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []).map((r: Record<string, any>) => ({
    slug: r.slug,
    title: r.title,
    title_bn: r.title_bn,
    description: r.description,
    section_type: r.section_type ?? "outlet_grid",
    parent_slug: r.parent_slug,
    group: r.group_key,
    sort_order: r.sort_order ?? 0,
    home: r.show_on_home ?? false,
    accent: r.accent,
    is_active: r.is_active ?? true,
  }));
}

export async function adminGetCategory(slug: string): Promise<Category | null> {
  const all = await adminListCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function adminListSubmissions(): Promise<Submission[]> {
  if (!hasServiceRole()) return [];
  const { data } = await supabaseAdmin()
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as Submission[];
}

export async function adminListPosts(): Promise<Post[]> {
  if (!hasServiceRole()) return [];
  const { data } = await supabaseAdmin()
    .from("posts")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data ?? []) as Post[];
}

export async function adminGetPost(id: string): Promise<Post | null> {
  if (!hasServiceRole()) return null;
  const { data } = await supabaseAdmin().from("posts").select("*").eq("id", id).single();
  return (data as Post) ?? null;
}

export type AdminStats = {
  outlets: number;
  categories: number;
  pendingSubmissions: number;
  posts: number;
  configured: boolean;
};

export async function adminStats(): Promise<AdminStats> {
  if (!hasServiceRole()) {
    return { outlets: 0, categories: 0, pendingSubmissions: 0, posts: 0, configured: false };
  }
  const sb = supabaseAdmin();
  const [o, c, s, p] = await Promise.all([
    sb.from("outlets").select("id", { count: "exact", head: true }),
    sb.from("categories").select("slug", { count: "exact", head: true }),
    sb.from("submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("posts").select("id", { count: "exact", head: true }),
  ]);
  return {
    outlets: o.count ?? 0,
    categories: c.count ?? 0,
    pendingSubmissions: s.count ?? 0,
    posts: p.count ?? 0,
    configured: true,
  };
}

/* -------------------------------------------------------------------------- */
/* Settings                                                                    */
/* -------------------------------------------------------------------------- */

export async function adminGetSetting(key: string): Promise<string | null> {
  if (!hasServiceRole()) return null;
  const { data } = await supabaseAdmin()
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();
  return data?.value ?? null;
}

export async function adminUpdateSetting(key: string, value: string): Promise<void> {
  if (!hasServiceRole()) return;
  await supabaseAdmin()
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
}
