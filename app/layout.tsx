import type { Metadata } from "next";
import { Inter, Newsreader, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const hind = Hind_Siliguri({
  variable: "--font-hind",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — All Bangla Newspapers, Online Portals, Radio & More`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Bangla newspaper",
    "Bangladesh newspaper",
    "all bangla newspaper",
    "online news portal",
    "bangla epaper",
    "bangla fm radio",
    "assam newspaper",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — The Bangla Media Directory`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${hind.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  );
}
