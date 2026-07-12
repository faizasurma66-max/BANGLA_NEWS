import Link from "next/link";
import { OutletLogo } from "./outlet-logo";
import type { Outlet } from "@/lib/types";

/**
 * Rectangular directory cell (no rounding, no gap — shares borders with
 * neighbours via the grid container). Links to /read/[slug].
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
