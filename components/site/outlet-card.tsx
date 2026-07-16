import Link from "next/link";
import { OutletLogo } from "./outlet-logo";
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

  // Homepage tile: fixed 217×110 box with a 215×90 logo frame (the 1px border
  // on each side is what takes 217 → 215). Name sits in the 18px strip below.
  if (compact) {
    return (
      <Link
        href={`/read/${handle}`}
        className="group relative flex h-[110px] w-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition duration-200 hover:border-accent-ring hover:shadow-sm sm:w-[217px]"
      >
        {outlet.is_featured && (
          <span className="absolute left-1 top-1 z-10 rounded bg-accent px-1 py-px text-[7px] font-bold uppercase tracking-wider text-white">
            Top
          </span>
        )}
        <div className="h-[90px] w-full shrink-0">
          <OutletLogo outlet={outlet} compact />
        </div>
        <div className="flex flex-1 items-center justify-center border-t border-line px-1.5">
          <p className="truncate text-[10px] font-semibold leading-none text-ink transition-colors group-hover:text-accent">
            {outlet.name}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/read/${handle}`}
      className="group relative flex flex-col border-b border-r border-line bg-surface transition duration-200 hover:z-10 hover:ring-1 hover:ring-accent-ring"
    >
      {outlet.is_featured && (
        <span className="absolute left-1.5 top-1.5 z-10 rounded bg-accent px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
          Top
        </span>
      )}

      {/* Logo panel */}
      <div className="flex aspect-[16/10] items-center justify-center bg-white p-3">
        <OutletLogo outlet={outlet} />
      </div>

      {/* Name */}
      <div className="border-t border-line px-2 py-2 text-center">
        <p className="truncate text-[12.5px] font-semibold leading-tight text-ink transition-colors group-hover:text-accent">
          {outlet.name}
        </p>
        {outlet.name_bn && (
          <p className="mt-0.5 truncate font-bangla text-[10.5px] leading-tight text-muted">
            {outlet.name_bn}
          </p>
        )}
      </div>
    </Link>
  );
}
