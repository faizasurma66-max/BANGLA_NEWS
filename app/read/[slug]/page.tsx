import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOutletByHandle } from "@/lib/queries";
import { supabasePublic } from "@/lib/supabase/public";
import { SiteHeader } from "@/components/site/site-header";
import { ReaderBar } from "@/components/site/reader-bar";
import { ClickBeacon } from "@/components/site/click-beacon";
import { ExternalRedirect } from "@/components/site/external-redirect";
import { hostname, faviconUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const outlet = await getOutletByHandle(slug);
  if (!outlet) return { title: "Read" };
  return {
    title: outlet.name,
    description: `Read ${outlet.name} (${hostname(outlet.url)}) on AllNewspaperBangla.`,
  };
}

export default async function ReadPage({ params }: Params) {
  const { slug } = await params;
  const outlet = await getOutletByHandle(slug);
  if (!outlet) notFound();

  // Sites that block embedding: count the click, then send the browser to the
  // real site. The clicked link stays ours (/read/<slug>); a branded splash
  // shows for the split second before the destination loads.
  if (outlet.open_external) {
    const db = supabasePublic();
    if (db) {
      db.rpc("increment_click", { outlet_id: outlet.id }).then(
        () => {},
        () => {},
      );
    }
    return (
      <>
        <ExternalRedirect url={outlet.url} />
        <meta httpEquiv="refresh" content={`0;url=${outlet.url}`} />
        <div className="grid h-[100dvh] place-items-center bg-paper px-6 text-center">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconUrl(outlet.url, 128)}
              alt=""
              width={44}
              height={44}
              className="mx-auto h-11 w-11 rounded-xl"
            />
            <p className="mt-4 text-xs uppercase tracking-widest text-faint">Opening</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-ink">
              {outlet.name}
            </p>
            <a
              href={outlet.url}
              className="mt-4 inline-block text-sm text-accent underline underline-offset-2"
            >
              Continue to {hostname(outlet.url)} →
            </a>
          </div>
        </div>
      </>
    );
  }

  // Embeddable sites: framed reader with the full site menu on top, then a slim
  // reader bar (back / outlet name / open original), then the outlet iframe.
  return (
    <div className="flex h-[100dvh] flex-col bg-band">
      <ClickBeacon id={outlet.id} />
      <SiteHeader />
      <ReaderBar name={outlet.name} name_bn={outlet.name_bn} url={outlet.url} />
      <iframe
        src={outlet.url}
        title={outlet.name}
        className="w-full flex-1 border-0 bg-white"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
        allow="fullscreen"
      />
    </div>
  );
}
