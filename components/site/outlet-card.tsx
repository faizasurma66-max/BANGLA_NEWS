import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { OutletLogo } from "./outlet-logo";
import { hostname } from "@/lib/utils";
import type { Outlet } from "@/lib/types";

/**
 * Uniform square-ish logo tile.
 * - If `shouldOpenExternal` is true → links to /go/[id] (click-tracked redirect to external URL)
 * - Otherwise → links to /view/[id] (in-site viewer)
 */
export function OutletCard({
  outlet,
  shouldOpenExternal = false,
}: {
  outlet: Outlet;
  /** Resolved flag: true = open external, false = open in-site viewer */
  shouldOpenExternal?: boolean;
}) {
  const openExternal = outlet.open_external ?? shouldOpenExternal;

  const cardClasses =
    "group relative flex flex-col overflow-hidden rounded-tile border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent-ring hover:shadow-[0_18px_40px_-24px_rgba(200,16,46,0.45)]";

  const inner = (
    <>
      {outlet.is_featured && (
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-accent/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Top
        </span>
      )}
      <span className="absolute right-2.5 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-ink/0 text-ink/0 transition-all duration-300 group-hover:bg-accent group-hover:text-white">
        {openExternal ? (
          <ExternalLink className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpRight className="h-4 w-4" />
        )}
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

      {/* Subtle external indicator badge */}
      {openExternal && (
        <span className="absolute bottom-2 right-2 rounded-full bg-band px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          ext
        </span>
      )}
    </>
  );

  if (openExternal) {
    return (
      <a
        href={`/go/${outlet.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={`/view/${outlet.id}`} className={cardClasses}>
      {inner}
    </Link>
  );
}
