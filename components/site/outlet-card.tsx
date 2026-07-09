import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OutletLogo } from "./outlet-logo";
import { hostname } from "@/lib/utils";
import type { Outlet } from "@/lib/types";

/**
 * Uniform square-ish logo tile. Links to /read/[slug] — that page shows a
 * fullscreen frame for embeddable sites, or redirects to the real site.
 * `shouldOpenExternal` is accepted for backwards-compat and ignored.
 */
export function OutletCard({
  outlet,
}: {
  outlet: Outlet;
  shouldOpenExternal?: boolean;
}) {
  const handle = outlet.slug ?? outlet.id;
  return (
    <Link
      href={`/read/${handle}`}
      className="group relative flex flex-col overflow-hidden rounded-tile border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent-ring hover:shadow-[0_18px_40px_-24px_rgba(200,16,46,0.45)]"
    >
      {outlet.is_featured && (
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-accent/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Top
        </span>
      )}
      <span className="absolute right-2.5 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-ink/0 text-ink/0 transition-all duration-300 group-hover:bg-accent group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" />
      </span>

      <div className="aspect-[16/10] w-full overflow-hidden border-b border-line">
        <OutletLogo outlet={outlet} />
      </div>

      <div className="flex flex-1 flex-col px-3.5 py-3">
        <span className="truncate text-sm font-semibold text-ink transition-colors group-hover:text-accent">
          {outlet.name}
        </span>
        {outlet.name_bn ? (
          <span className="truncate font-bangla text-xs text-muted">{outlet.name_bn}</span>
        ) : (
          <span className="truncate text-xs text-faint">{hostname(outlet.url)}</span>
        )}
      </div>
    </Link>
  );
}
