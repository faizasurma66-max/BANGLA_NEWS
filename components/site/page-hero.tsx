import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

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
    <section className="border-b border-line bg-grain">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
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
          <div className="mb-3 flex items-center gap-2">
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

        <h1 className="font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
          {title}
          {titleBn && (
            <span className="ml-3 align-middle font-bangla text-xl font-normal text-muted sm:text-2xl">
              {titleBn}
            </span>
          )}
        </h1>

        {description && (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
