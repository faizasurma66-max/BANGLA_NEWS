import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Premium section header — replaces the reference's full-red bars. */
export function SectionHeader({
  kicker,
  title,
  titleBn,
  description,
  href,
  hrefLabel = "View all",
}: {
  kicker?: string;
  title: string;
  titleBn?: string | null;
  description?: string | null;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {kicker && (
          <div className="mb-2 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {kicker}
            </span>
          </div>
        )}
        <h2 className="font-serif text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-[1.75rem]">
          {title}
          {titleBn && (
            <span className="ml-2 align-middle font-bangla text-lg font-normal text-muted">
              {titleBn}
            </span>
          )}
        </h2>
        {description && (
          <p className="mt-2.5 text-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent sm:self-auto"
        >
          {hrefLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
