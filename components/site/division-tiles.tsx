import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

/** The 8-division grid — premium reinterpretation of the reference map tiles. */
export function DivisionTiles({ divisions }: { divisions: Category[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {divisions.map((d) => {
        const accent = d.accent ?? "#c8102e";
        return (
          <Link
            key={d.slug}
            href={`/local/${d.slug}`}
            className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-tile border border-line p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_-26px_rgba(23,19,13,0.5)]"
            style={{
              background: `linear-gradient(150deg, ${accent}14, ${accent}05)`,
            }}
          >
            <span
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-25 blur-xl transition-opacity group-hover:opacity-40"
              style={{ background: accent }}
            />
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm"
              style={{ background: accent }}
            >
              <MapPin className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <span>
              <span className="flex items-center gap-1 font-serif text-base font-semibold text-ink">
                {d.title.replace(" Division", "")}
                <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-ink group-hover:translate-x-0.5" />
              </span>
              {d.title_bn && (
                <span className="block font-bangla text-xs text-muted">{d.title_bn}</span>
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
