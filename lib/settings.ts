import { cache } from "react";
import { supabasePublic } from "@/lib/supabase/public";

/**
 * Site settings registry.
 *
 * One row per key in `public.settings`. `isPublic` decides whether the anon key
 * can read the row (see the RLS policy in migration 0006) — SMTP credentials
 * are private and only ever reachable through the service-role client.
 */

type Spec = { def: string; isPublic: boolean };

const S = (def = "", isPublic = true): Spec => ({ def, isPublic });

export const SETTING_SPECS = {
  /* General */
  site_name: S("All Bangla Newspaper"),
  site_logo: S(""),
  site_favicon: S(""),
  primary_color: S("#c8102e"),

  /* SEO */
  meta_title: S(""),
  meta_description: S(""),
  meta_keywords: S(""),
  google_analytics_id: S(""),
  google_site_verification: S(""),

  /* Ads */
  adsense_code: S(""),

  /* Footer — social + app */
  social_facebook: S(""),
  social_x: S(""),
  social_instagram: S(""),
  social_pinterest: S(""),
  social_youtube: S(""),
  app_download_url: S(""),
  contact_email: S(""),

  /* Footer — page content */
  page_about: S(""),
  page_disclaimer: S(""),
  page_privacy: S(""),

  /* Directory behaviour (pre-existing) */
  default_open_external: S("false"),

  /* SMTP — private */
  smtp_host: S("", false),
  smtp_port: S("587", false),
  smtp_encryption: S("tls", false),
  smtp_username: S("", false),
  smtp_password: S("", false),
  smtp_from_email: S("", false),
  smtp_from_name: S("", false),
} as const;

export type SettingKey = keyof typeof SETTING_SPECS;
export type Settings = Record<SettingKey, string>;

export const SETTING_KEYS = Object.keys(SETTING_SPECS) as SettingKey[];

export const PUBLIC_SETTING_KEYS = SETTING_KEYS.filter(
  (k) => SETTING_SPECS[k].isPublic,
);

export function isPublicSetting(key: string): boolean {
  return (SETTING_SPECS as Record<string, Spec | undefined>)[key]?.isPublic ?? true;
}

export function defaultSettings(): Settings {
  const out = {} as Settings;
  for (const k of SETTING_KEYS) out[k] = SETTING_SPECS[k].def;
  return out;
}

/** Overlay stored rows onto the defaults, ignoring unknown keys. */
export function mergeSettings(rows: { key: string; value: string | null }[]): Settings {
  const out = defaultSettings();
  for (const row of rows) {
    if (row.key in SETTING_SPECS && row.value !== null) {
      out[row.key as SettingKey] = row.value;
    }
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* Public read                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Public settings for the site chrome. Deduped per request — the root layout,
 * the header and the footer all need it. Never returns SMTP values: RLS filters
 * them out, and the defaults fill the gap.
 */
export const getSiteSettings = cache(async (): Promise<Settings> => {
  const db = supabasePublic();
  if (!db) return defaultSettings();
  try {
    const { data, error } = await db.from("settings").select("key, value");
    if (error) throw error;
    return mergeSettings(data ?? []);
  } catch (e) {
    console.warn("[settings] read failed, using defaults:", e);
    return defaultSettings();
  }
});

/* -------------------------------------------------------------------------- */
/* Derived helpers                                                             */
/* -------------------------------------------------------------------------- */

export type SocialLink = {
  key: "facebook" | "x" | "instagram" | "pinterest" | "youtube";
  label: string;
  href: string;
};

/** Only the socials the admin actually filled in, in display order. */
export function socialLinks(s: Settings): SocialLink[] {
  const entries: { key: SocialLink["key"]; label: string; value: string }[] = [
    { key: "facebook", label: "Facebook", value: s.social_facebook },
    { key: "x", label: "X (Twitter)", value: s.social_x },
    { key: "instagram", label: "Instagram", value: s.social_instagram },
    { key: "pinterest", label: "Pinterest", value: s.social_pinterest },
    { key: "youtube", label: "YouTube", value: s.social_youtube },
  ];
  return entries
    .filter((e) => e.value.trim().length > 0)
    .map((e) => ({ key: e.key, label: e.label, href: e.value.trim() }));
}

/** Split a textarea into paragraphs on blank lines, as the admin hint promises. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
