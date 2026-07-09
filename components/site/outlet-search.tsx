"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { hostname } from "@/lib/utils";

export type SearchItem = {
  id: string;
  slug?: string | null;
  name: string;
  name_bn?: string | null;
  url: string;
  category_slug: string;
  open_external?: boolean;
};

export function OutletSearch({
  items,
  placeholder = "Search 150+ newspapers, portals, TV, radio…",
}: {
  items: SearchItem[];
  /** accepted for compat; the /read route now decides frame vs redirect */
  globalOpenExternal?: boolean;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return items
      .filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          (i.name_bn ?? "").toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [q, items]);

  const open = focused && q.trim().length > 0;

  return (
    <div className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-3 shadow-sm transition focus-within:border-accent focus-within:shadow-[0_0_0_4px_var(--color-accent-soft)]">
        <Search className="h-5 w-5 shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
            setFocused(true);
          }}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setFocused(false), 120);
          }}
          placeholder={placeholder}
          aria-label="Search directory"
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-24px_rgba(23,19,13,0.35)]">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-muted">No matches for “{q}”.</p>
          ) : (
            <ul className="max-h-[22rem] overflow-auto py-1.5">
              {results.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/read/${r.slug ?? r.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-band"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">
                        {r.name}
                        {r.name_bn && (
                          <span className="ml-2 font-bangla text-xs text-muted">{r.name_bn}</span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-faint">{hostname(r.url)}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
