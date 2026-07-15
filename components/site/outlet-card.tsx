import Link from "next/link";
import { OutletLogo } from "./outlet-logo";
import { cn } from "@/lib/utils";
import type { Outlet } from "@/lib/types";

/**
 * Rectangular directory cell (no rounding, no gap — shares borders with
 * neighbours via the grid container). Links to /read/[slug].
 * `compact` renders a smaller tile (used for the homepage category previews).
 * `shouldOpenExternal` is accepted for backwards-compat and ignored.
 */
export function OutletCard({
  outlet,
  compact,
}: {
  outlet: Outlet;
  shouldOpenExternal?: boolean;
  compact?: boolean;
}) {
  const handle = outlet.slug ?? outlet.id;
  return (
    <Link
      href={`/read/${handle}`}
      className="group relative flex flex-col border-b border-r border-line bg-surface transition duration-200 hover:z-10 hover:ring-1 hover:ring-accent-ring"
    >
      {outlet.is_featured && (
        <span
          className={cn(
            "absolute left-1.5 top-1.5 z-10 rounded bg-accent font-bold uppercase tracking-wider text-white",
            compact ? "px-1 py-px text-[7px]" : "px-1.5 py-0.5 text-[8px]",
          )}
        >
          Top
        </span>
      )}

      {/* Logo panel */}
      <div
        className={cn(
          "flex items-center justify-center bg-white",
          compact ? "aspect-[3/2] p-2" : "aspect-[16/10] p-3",
        )}
      >
        <OutletLogo outlet={outlet} />
      </div>

      {/* Name */}
      <div
        className={cn(
          "border-t border-line text-center",
          compact ? "px-1.5 py-1.5" : "px-2 py-2",
        )}
      >
        <p
          className={cn(
            "truncate font-semibold leading-tight text-ink transition-colors group-hover:text-accent",
            compact ? "text-[11px]" : "text-[12.5px]",
          )}
        >
          {outlet.name}
        </p>
        {outlet.name_bn && (
          <p
            className={cn(
              "mt-0.5 truncate font-bangla leading-tight text-muted",
              compact ? "text-[9.5px]" : "text-[10.5px]",
            )}
          >
            {outlet.name_bn}
          </p>
        )}
      </div>
    </Link>
  );
}
