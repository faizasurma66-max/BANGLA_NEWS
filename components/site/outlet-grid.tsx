import { OutletCard } from "./outlet-card";
import { cn } from "@/lib/utils";
import type { Outlet } from "@/lib/types";

/**
 * Responsive tile grid. `limit` caps how many render (for homepage previews).
 * `compact` packs more, smaller tiles per row (homepage category previews).
 * `globalOpenExternal` passes the admin-configured default to each card.
 */
export function OutletGrid({
  outlets,
  limit,
  compact = false,
  globalOpenExternal = false,
}: {
  outlets: Outlet[];
  limit?: number;
  compact?: boolean;
  globalOpenExternal?: boolean;
}) {
  const list = limit ? outlets.slice(0, limit) : outlets;
  if (list.length === 0) {
    return (
      <p className="rounded-tile border border-dashed border-line bg-surface px-4 py-10 text-center text-sm text-muted">
        Nothing here yet.
      </p>
    );
  }
  return (
    <div
      className={cn(
        "grid overflow-hidden rounded-xl border-l border-t border-line bg-surface",
        compact
          ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
      )}
    >
      {list.map((outlet) => (
        <OutletCard
          key={outlet.id}
          outlet={outlet}
          compact={compact}
          shouldOpenExternal={globalOpenExternal}
        />
      ))}
    </div>
  );
}
