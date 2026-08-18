import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Page header for category, division, blog and content pages.
 *
 * Deliberately matches the type scale and vertical rhythm of `SectionHeader`
 * (the home page section titles). These pages lead with a grid of outlets, so
 * an oversized hero pushed the actual content below the fold on laptops.
 */
export function PageHero({
  breadcrumb,
  kicker,
  title,
  titleBn,
  description,
  accent,
}: {
  breadcrumb?: Crumb[];
  kicker?: string;
  title: string;
  titleBn?: string | null;
  description?: string | null;
  accent?: string | null;
}) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
              {breadcrumb.map((c, i) => (
                <li key={i} className="flex items-center gap-1">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-accent">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-ink-soft">{c.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-faint" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {kicker && (
          <div className="mb-2 flex items-center gap-2">
            <span
              className="h-4 w-1 rounded-full"
              style={{ background: accent ?? "var(--color-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.14em]"
              style={{ color: accent ?? "var(--color-accent)" }}
            >
              {kicker}
            </span>
          </div>
        )}

        <h1 className="font-serif text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl lg:text-[2rem]">
          {title}
          {titleBn && (
            <span className="ml-2 align-middle font-bangla text-lg font-normal text-muted sm:text-xl">
              {titleBn}
            </span>
          )}
        </h1>

        {description && (
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
