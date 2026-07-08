import { OutletCard } from "./outlet-card";
import type { Outlet } from "@/lib/types";

/**
 * Responsive tile grid. `limit` caps how many render (for homepage previews).
 * `globalOpenExternal` passes the admin-configured default to each card.
 */
export function OutletGrid({
  outlets,
  limit,
  globalOpenExternal = false,
}: {
  outlets: Outlet[];
  limit?: number;
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {list.map((outlet) => (
        <OutletCard
          key={outlet.id}
          outlet={outlet}
          shouldOpenExternal={globalOpenExternal}
        />
      ))}
    </div>
  );
}
