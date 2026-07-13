import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import {
  CATEGORIES as SEED_CATEGORIES,
  OUTLETS as SEED_OUTLETS,
} from "@/lib/seed-data";
import type { Category, Outlet, HomeSection, Post } from "@/lib/types";
import type { GroupKey } from "@/lib/site-config";

/*
 * Reads hit Supabase when configured, else fall back to bundled seed data.
 * Caching is handled at the page level via `export const revalidate` (ISR);
 * admin writes call revalidatePath("/", "layout") to refresh immediately.
 */

/* -------------------------------------------------------------------------- */
/* Normalisers                                                                 */
/* -------------------------------------------------------------------------- */

function normCategory(row: Record<string, unknown>): Category {
  return {
    slug: row.slug as string,
    title: row.title as string,
    title_bn: (row.title_bn as string) ?? null,
    description: (row.description as string) ?? null,
    section_type: (row.section_type as Category["section_type"]) ?? "outlet_grid",
    parent_slug: (row.parent_slug as string) ?? null,
    group: (row.group_key as GroupKey) ?? "portals",
    sort_order: (row.sort_order as number) ?? 0,
    home: (row.show_on_home as boolean) ?? false,
    accent: (row.accent as string) ?? null,
    is_active: (row.is_active as boolean) ?? true,
  };
}

function normOutlet(row: Record<string, unknown>): Outlet {
  const category = row.category as { slug?: string } | undefined;
  return {
    id: row.id as string,
    slug: (row.slug as string) ?? null,
    category_slug: category?.slug ?? (row.category_slug as string) ?? "",
    name: row.name as string,
    name_bn: (row.name_bn as string) ?? null,
    url: row.url as string,
    logo_url: (row.logo_url as string) ?? null,
    description: (row.description as string) ?? null,
    is_featured: (row.is_featured as boolean) ?? false,
    open_external: (row.open_external as boolean) ?? false,
    click_count: (row.click_count as number) ?? 0,
    sort_order: (row.sort_order as number) ?? 0,
    is_active: (row.is_active as boolean) ?? true,
  };
}

/* -------------------------------------------------------------------------- */
/* Cached base fetchers (DB with seed fallback)                                */
/* -------------------------------------------------------------------------- */

async function fetchCategories(): Promise<Category[]> {
  const db = supabasePublic();
  if (db) {
    try {
      const { data, error } = await db
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) return data.map(normCategory);
    } catch (e) {
      console.warn("[queries] categories DB read failed, using seed:", e);
    }
  }
  return SEED_CATEGORIES.filter((c) => c.is_active !== false);
}

async function fetchOutlets(): Promise<Outlet[]> {
  const db = supabasePublic();
  if (db) {
    try {
      const { data, error } = await db
        .from("outlets")
        .select("*, category:categories(slug)")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) return data.map(normOutlet);
    } catch (e) {
      console.warn("[queries] outlets DB read failed, using seed:", e);
    }
  }
  return SEED_OUTLETS.filter((o) => o.is_active !== false);
}

// Deduped per-request: header, footer and the page share one round-trip.
export const getAllCategories = cache(fetchCategories);
export const getAllOutlets = cache(fetchOutlets);

/* -------------------------------------------------------------------------- */
/* Derived selectors                                                           */
/* -------------------------------------------------------------------------- */

export async function getCategory(slug: string): Promise<Category | undefined> {
  return (await getAllCategories()).find((c) => c.slug === slug);
}

export async function getOutletsByCategory(slug: string): Promise<Outlet[]> {
  return (await getAllOutlets())
    .filter((o) => o.category_slug === slug)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function getDivisions(): Promise<Category[]> {
  return (await getAllCategories())
    .filter((c) => c.parent_slug === "local-newspaper")
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getOutletById(id: string): Promise<Outlet | undefined> {
  return (await getAllOutlets()).find((o) => o.id === id);
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Fetch one outlet by pretty slug (or uuid) — fast targeted query. */
export async function getOutletByHandle(
  handle: string,
): Promise<Outlet | undefined> {
  const db = supabasePublic();
  if (db) {
    try {
      const col = UUID_RE.test(handle) ? "id" : "slug";
      const { data } = await db
        .from("outlets")
        .select("*, category:categories(slug)")
        .eq(col, handle)
        .maybeSingle();
      if (data) return normOutlet(data);
    } catch (e) {
      console.warn("[queries] getOutletByHandle failed:", e);
    }
  }
  return SEED_OUTLETS.find((o) => o.id === handle || o.slug === handle);
}

/** Fast single-outlet fetch (targeted query, not the whole table). */
export async function getOutletLight(id: string): Promise<Outlet | undefined> {
  const db = supabasePublic();
  if (db) {
    try {
      const { data } = await db
        .from("outlets")
        .select("*, category:categories(slug)")
        .eq("id", id)
        .maybeSingle();
      if (data) return normOutlet(data);
    } catch (e) {
      console.warn("[queries] getOutletLight failed:", e);
    }
  }
  return SEED_OUTLETS.find((o) => o.id === id);
}

export type ViewData = {
  outlet: Outlet;
  categoryTitle: string | null;
  categorySlug: string | null;
  related: Outlet[];
};

/** Everything the /view page needs in two targeted queries (fast). */
export async function getViewData(id: string): Promise<ViewData | null> {
  const db = supabasePublic();
  if (db) {
    try {
      const { data: o } = await db
        .from("outlets")
        .select("*, category:categories(slug,title)")
        .eq("id", id)
        .maybeSingle();
      if (o) {
        const { data: rel } = await db
          .from("outlets")
          .select("*, category:categories(slug)")
          .eq("category_id", (o as Record<string, unknown>).category_id as string)
          .eq("is_active", true)
          .neq("id", id)
          .order("sort_order", { ascending: true })
          .limit(10);
        const cat = (o as Record<string, unknown>).category as
          | { slug?: string; title?: string }
          | undefined;
        return {
          outlet: normOutlet(o),
          categoryTitle: cat?.title ?? null,
          categorySlug: cat?.slug ?? null,
          related: (rel ?? []).map(normOutlet),
        };
      }
    } catch (e) {
      console.warn("[queries] getViewData failed:", e);
    }
  }
  // Seed fallback
  const outlet = SEED_OUTLETS.find((o) => o.id === id);
  if (!outlet) return null;
  const cat = SEED_CATEGORIES.find((c) => c.slug === outlet.category_slug);
  return {
    outlet,
    categoryTitle: cat?.title ?? null,
    categorySlug: outlet.category_slug,
    related: SEED_OUTLETS.filter(
      (o) => o.category_slug === outlet.category_slug && o.id !== id,
    ).slice(0, 10),
  };
}

/** Homepage sections in order, each with resolved outlets (and division children). */
export async function getHomeSections(): Promise<HomeSection[]> {
  const [cats, outlets] = await Promise.all([getAllCategories(), getAllOutlets()]);
  const sections = cats
    .filter((c) => c.home && !c.parent_slug)
    .sort((a, b) => a.sort_order - b.sort_order);

  return sections.map((category) => {
    if (category.section_type === "division_grid") {
      const children = cats
        .filter((c) => c.parent_slug === category.slug)
        .sort((a, b) => a.sort_order - b.sort_order);
      return { category, outlets: [], children };
    }
    const list = outlets
      .filter((o) => o.category_slug === category.slug)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return { category, outlets: list };
  });
}

/** Categories grouped for the header mega-menu. */
export async function getCategoriesByGroup(): Promise<Record<string, Category[]>> {
  const cats = await getAllCategories();
  const map: Record<string, Category[]> = {};
  for (const c of cats) {
    if (c.parent_slug) continue; // divisions handled separately
    (map[c.group] ??= []).push(c);
  }
  return map;
}

export async function searchOutlets(query: string): Promise<Outlet[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return (await getAllOutlets()).filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      (o.name_bn ?? "").toLowerCase().includes(q) ||
      o.category_slug.includes(q),
  );
}

/* -------------------------------------------------------------------------- */
/* Blog                                                                        */
/* -------------------------------------------------------------------------- */

async function fetchPosts(): Promise<Post[]> {
  const db = supabasePublic();
  if (!db) return [];
  try {
    const { data, error } = await db
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Post[];
  } catch (e) {
    console.warn("[queries] posts DB read failed:", e);
    return [];
  }
}

export const getPublishedPosts = cache(fetchPosts);

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPublishedPosts()).find((p) => p.slug === slug);
}

/** Blog cards for the homepage: featured (admin-ordered) first, else latest. */
export async function getHomePosts(limit = 6): Promise<Post[]> {
  const posts = await getPublishedPosts();
  const featured = posts
    .filter((p) => p.featured)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const base = featured.length > 0 ? featured : posts;
  return base.slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Global Settings                                                             */
/* -------------------------------------------------------------------------- */

export type SiteSettings = { default_open_external: boolean };

export async function getGlobalSettings(): Promise<SiteSettings> {
  const db = supabasePublic();
  if (db) {
    try {
      const { data } = await db
        .from("settings")
        .select("key, value")
        .in("key", ["default_open_external"]);
      const map: Record<string, string> = {};
      for (const row of data ?? []) map[row.key] = row.value;
      return {
        default_open_external: map.default_open_external === "true",
      };
    } catch (e) {
      console.warn("[queries] settings read failed:", e);
    }
  }
  return { default_open_external: false };
}

export async function getDefaultOpenExternal(): Promise<boolean> {
  return (await getGlobalSettings()).default_open_external;
}
