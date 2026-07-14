import type { GroupKey } from "./site-config";

export type SectionType = "outlet_grid" | "division_grid";

export interface Category {
  slug: string;
  title: string;
  title_bn?: string | null;
  description?: string | null;
  section_type: SectionType;
  /** Divisions point to their parent ("local-newspaper"). */
  parent_slug?: string | null;
  group: GroupKey;
  sort_order: number;
  /** Whether this category renders as a section on the homepage. */
  home?: boolean;
  /** Optional tile background (used by division tiles). */
  accent?: string | null;
  is_active?: boolean;
}

export interface Outlet {
  /** uuid in Supabase; kebab slug in the bundled fallback dataset. */
  id: string;
  /** pretty URL handle, e.g. "prothom-alo" (used by /read/[slug]). */
  slug?: string | null;
  category_slug: string;
  name: string;
  name_bn?: string | null;
  url: string;
  logo_url?: string | null;
  description?: string | null;
  is_featured?: boolean;
  open_external?: boolean;
  click_count?: number;
  sort_order?: number;
  is_active?: boolean;
}

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Submission {
  id: string;
  outlet_name: string;
  url: string;
  category_suggestion?: string | null;
  logo_url?: string | null;
  submitter_email?: string | null;
  notes?: string | null;
  status: SubmissionStatus;
  created_at: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  published: boolean;
  featured?: boolean;
  sort_order?: number;
  /** View count — drives the "Popular posts" ranking. */
  click_count?: number;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

/** A homepage section: a category plus its resolved outlets (or child divisions). */
export interface HomeSection {
  category: Category;
  outlets: Outlet[];
  children?: Category[];
}
