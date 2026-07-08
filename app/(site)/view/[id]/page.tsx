import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight, ChevronLeft, Info } from "lucide-react";
import { getViewData, getOutletLight } from "@/lib/queries";
import { OutletGrid } from "@/components/site/outlet-grid";
import { SectionHeader } from "@/components/site/section-header";
import { ClickBeacon } from "@/components/site/click-beacon";
import { hostname, faviconUrl } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

// Dynamic on purpose: this makes the loading.tsx skeleton show INSTANTLY on
// every click (static routes skip the loading state). The queries are small +
// targeted, and click counting is a non-blocking client beacon.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const outlet = await getOutletLight(id);
  if (!outlet) return { title: "Outlet" };
  return {
    title: outlet.name,
    description: `Read ${outlet.name} (${hostname(outlet.url)}) on AllNewspaperBangla.`,
  };
}

export default async function ViewPage({ params }: Params) {
  const { id } = await params;
  const data = await getViewData(id);
  if (!data) notFound();
  const { outlet, categoryTitle, categorySlug, related } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Count the open without blocking render */}
      <ClickBeacon id={outlet.id} />

      <Link
        href={categorySlug ? `/category/${categorySlug}` : "/"}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent"
      >
        <ChevronLeft className="h-4 w-4" />
        {categoryTitle ?? "Home"}
      </Link>

      {/* Outlet header */}
      <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconUrl(outlet.url, 128)}
              alt={`${outlet.name} icon`}
              width={40}
              height={40}
              className="h-10 w-10 rounded"
            />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold text-ink">
              {outlet.name}
              {outlet.name_bn && (
                <span className="ml-2 font-bangla text-lg font-normal text-muted">
                  {outlet.name_bn}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted">{hostname(outlet.url)}</p>
          </div>
        </div>
        <a
          href={outlet.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          Open full site
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      {outlet.description && (
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
          {outlet.description}
        </p>
      )}

      {/* In-site live preview */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <div className="flex items-center gap-2 border-b border-line bg-band px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </span>
          <div className="flex-1 truncate rounded-md bg-surface px-3 py-1 text-xs text-muted">
            {outlet.url}
          </div>
        </div>
        <iframe
          src={outlet.url}
          title={`${outlet.name} preview`}
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className="h-[72vh] w-full bg-white"
        />
      </div>
      <p className="mt-3 flex items-start gap-1.5 text-xs text-faint">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Live preview of {outlet.name}. Some publishers block embedding — if the
        preview stays blank, use “Open full site”.
      </p>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-14">
          <SectionHeader
            kicker="More in this category"
            title={categoryTitle ?? "Related outlets"}
            href={categorySlug ? `/category/${categorySlug}` : undefined}
          />
          <div className="mt-6">
            <OutletGrid outlets={related} />
          </div>
        </div>
      )}
    </div>
  );
}
