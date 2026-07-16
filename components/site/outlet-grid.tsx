import { OutletCard } from "./outlet-card";
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

  // Homepage: fixed 217px tracks, so a full row holds exactly as many whole
  // tiles as fit (5 at the 1280px container, 6 on wider screens). Two flexible
  // columns on phones, where a fixed 217px tile would strand a lot of space.
  if (compact) {
    return (
      <div className="grid grid-cols-2 justify-center gap-3 sm:[grid-template-columns:repeat(auto-fill,217px)]">
        {list.map((outlet) => (
          <OutletCard key={outlet.id} outlet={outlet} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-xl border-l border-t border-line bg-surface sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
