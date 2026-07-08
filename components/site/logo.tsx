import Link from "next/link";
import { cn } from "@/lib/utils";

/** Editorial wordmark + geometric peak mark (echoes the reference brand). */
export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="AllNewspaperBangla home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-accent shadow-sm ring-1 ring-accent-dark/30 transition-transform duration-300 group-hover:-translate-y-0.5">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4 17.5 12 5l8 12.5H4Z"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M9.2 17.5 12 12.9l2.8 4.6" fill="#fff" opacity="0.9" />
        </svg>
      </span>
      {!compact && (
        <span className="font-serif text-[1.15rem] font-semibold leading-none tracking-tight text-ink">
          AllNewspaper<span className="text-accent">Bangla</span>
        </span>
      )}
    </Link>
  );
}
