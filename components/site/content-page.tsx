import { PageHero } from "./page-hero";
import { toParagraphs } from "@/lib/settings";

/**
 * Renders one of the footer content pages (About / Disclaimer / Privacy) from
 * the text saved in the admin, falling back to a sensible default so the page
 * is never blank before the client fills it in.
 */
export function ContentPage({
  kicker,
  title,
  intro,
  content,
  fallback,
}: {
  kicker: string;
  title: string;
  intro?: string;
  content: string;
  fallback: string[];
}) {
  const paragraphs = content.trim() ? toParagraphs(content) : fallback;

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: title }]}
        kicker={kicker}
        title={title}
        description={intro}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[1.0625rem] leading-[1.75] text-ink-soft">
              {p}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
