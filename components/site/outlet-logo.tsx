"use client";

import { useState } from "react";
import Image from "next/image";
import { monogram, hueFromString, faviconUrl } from "@/lib/utils";
import type { Outlet } from "@/lib/types";

/**
 * Outlet visual, in priority order:
 *  1. Admin-uploaded logo (logo_url).
 *  2. Real brand favicon (Google favicon service) shown as an app-icon chip.
 *  3. Tinted monogram fallback if the favicon fails to load.
 */
export function OutletLogo({
  outlet,
}: {
  outlet: Pick<Outlet, "name" | "logo_url" | "url">;
}) {
  const [failed, setFailed] = useState(false);
  const hue = hueFromString(outlet.name);

  if (outlet.logo_url) {
    return (
      <div className="relative h-full w-full bg-white">
        <Image
          src={outlet.logo_url}
          alt={`${outlet.name} logo`}
          fill
          sizes="(max-width: 640px) 45vw, 220px"
          className="object-contain p-4"
        />
      </div>
    );
  }

  const bg = {
    background: `linear-gradient(135deg, hsl(${hue} 45% 98%), hsl(${(hue + 34) % 360} 42% 95%))`,
  };

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center" style={bg}>
        <span
          className="font-serif text-2xl font-semibold"
          style={{ color: `hsl(${hue} 42% 40%)` }}
        >
          {monogram(outlet.name)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center" style={bg}>
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={faviconUrl(outlet.url, 128)}
          alt={`${outlet.name} icon`}
          width={36}
          height={36}
          loading="lazy"
          className="h-9 w-9 rounded"
          onError={() => setFailed(true)}
        />
      </span>
    </div>
  );
}
