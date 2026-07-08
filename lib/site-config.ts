/** Global site metadata + static navigation config. */

export const SITE = {
  name: "AllNewspaperBangla",
  shortName: "ANB",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "The curated directory of Bangla media — every national daily, online news portal, FM radio station, ePaper, government portal, job site and regional newspaper, in one fast, premium index.",
  locale: "en_BD",
} as const;

/**
 * Ordered groups. Each directory category belongs to a group; groups control
 * how categories are organised in the header mega-menu and on the homepage.
 */
export const GROUPS = {
  newspapers: "National Newspapers",
  portals: "Online News Portals",
  tv: "TV News Channels",
  english: "English Newspapers",
  stock: "Stock Market News",
  epaper: "Bangla ePaper",
  radio: "FM Radio",
  jobs: "Job Portals",
  government: "Government Portals",
  assam: "Assam Newspapers",
  regional: "Local Newspapers",
} as const;

export type GroupKey = keyof typeof GROUPS;

/** Primary nav shown in the header (dropdowns are built from live categories). */
export const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "Bangla Converter", href: "/converter" },
  { label: "Blog", href: "/blog" },
  { label: "Bangla ePaper", href: "/epaper" },
] as const;

/** Groups surfaced inside the "All Bangla Newspapers" mega-menu. */
export const NEWSPAPERS_MENU_GROUPS: GroupKey[] = [
  "newspapers",
  "portals",
  "tv",
  "english",
  "stock",
  "radio",
  "jobs",
  "government",
  "assam",
];
