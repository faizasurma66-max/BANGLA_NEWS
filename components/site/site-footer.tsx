import Link from "next/link";
import { getAllCategories } from "@/lib/queries";
import { Logo } from "./logo";
import { SITE } from "@/lib/site-config";

export async function SiteFooter() {
  const cats = await getAllCategories();
  const columns = cats
    .filter((c) => !c.parent_slug && c.slug !== "local-newspaper")
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, 8);

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted">{SITE.description}</p>
            <Link
              href="/submit"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
            >
              Submit your site
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterCol title="Directory">
              {columns.map((c) => (
                <FooterLink key={c.slug} href={`/category/${c.slug}`}>
                  {c.title}
                </FooterLink>
              ))}
            </FooterCol>
            <FooterCol title="Explore">
              <FooterLink href="/local">Local Newspapers</FooterLink>
              <FooterLink href="/epaper">Bangla ePaper</FooterLink>
              <FooterLink href="/converter">Bangla Converter</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </FooterCol>
            <FooterCol title="About">
              <FooterLink href="/submit">Submit a Site</FooterLink>
              <FooterLink href="/blog">News &amp; Updates</FooterLink>
              <FooterLink href="/admin">Admin</FooterLink>
            </FooterCol>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name}. A curated Bangla media index.
          </p>
          <p className="text-xs text-faint">
            Logos and trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-faint">{title}</h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-ink-soft transition-colors hover:text-accent">
        {children}
      </Link>
    </li>
  );
}
