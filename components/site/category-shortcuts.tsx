import Link from "next/link";
import {
  Newspaper,
  Globe,
  Tv,
  Radio,
  Languages,
  TrendingUp,
  BookOpen,
  Briefcase,
  Landmark,
  Globe2,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import type { GroupKey } from "@/lib/site-config";
import type { CategoryCount } from "@/lib/queries";

const GROUP_ICON: Record<GroupKey, LucideIcon> = {
  newspapers: Newspaper,
  portals: Globe,
  tv: Tv,
  english: Languages,
  stock: TrendingUp,
  epaper: BookOpen,
  radio: Radio,
  jobs: Briefcase,
  government: Landmark,
  assam: Newspaper,
  international: Globe2,
  regional: Newspaper,
};

/** Directory landing tiles — one shortcut per media category, with its outlet count. */
export function CategoryShortcuts({ categories }: { categories: CategoryCount[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => {
        const Icon = GROUP_ICON[c.group] ?? Newspaper;
        return (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent-ring hover:bg-band"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
              <Icon className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-[15px] font-semibold leading-tight text-ink group-hover:text-accent">
                <span className="truncate">{c.title}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
              </span>
              {c.title_bn && (
                <span className="mt-0.5 block truncate font-bangla text-xs text-muted">
                  {c.title_bn}
                </span>
              )}
            </span>
            <span className="shrink-0 rounded-full bg-band px-2.5 py-1 text-xs font-semibold text-muted group-hover:bg-surface">
              {c.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
