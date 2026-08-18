import Link from "next/link";
import { Mail, Smartphone } from "lucide-react";
import { getAllCategories } from "@/lib/queries";
import { getSiteSettings, socialLinks } from "@/lib/settings";
import { Logo } from "./logo";
import { SocialIcon } from "./social-icons";
import { SITE } from "@/lib/site-config";

/**
 * Categories kept out of the footer's Directory column. They stay in the
 * header mega-menu and on their own pages — the footer list is a shortlist,
 * not an index of everything.
 */
const FOOTER_HIDDEN = new Set([
  "local-newspaper", // has its own "Local Newspapers" entry under Explore
  "stock-market", // All Share Bazar Newspapers
  "bangla-magazine", // All Bangla Magazine
  "fm-radio", // Top Bangla FM Radio
]);

/** How many category links the footer's Directory column shows. */
const FOOTER_DIRECTORY_LIMIT = 5;

export async function SiteFooter() {
  const [cats, settings] = await Promise.all([getAllCategories(), getSiteSettings()]);

  // Five, not eight: several category titles ("Bangladeshi English Newspapers",
  // "Bangladesh Government Portals") wrap to two lines, so a longer list left
  // the Directory column running well past Explore and About and made the row
  // of columns look ragged. Everything still lives in the header mega-menu.
  const columns = cats
    .filter((c) => !c.parent_slug && !FOOTER_HIDDEN.has(c.slug))
    .sort((a, b) => a.sort_order - b.sort_order)
    .slice(0, FOOTER_DIRECTORY_LIMIT);

  // Only the socials the admin actually filled in are rendered.
  const socials = socialLinks(settings);
  const appUrl = settings.app_download_url.trim();

  return (
    // `mt-auto` is what pins the footer to the bottom of the page: the site
    // layout is a full-height flex column, so on a short page (About, 404, an
    // empty search) the leftover space collapses above the footer instead of
    // leaving it stranded mid-screen. A fixed `mt-24` used to push the whole
    // column past the viewport and produce a phantom scrollbar.
    <footer className="mt-auto border-t border-footer-line bg-footer text-ink">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo src={settings.site_logo || null} name={settings.site_name} />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {settings.meta_description || SITE.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href="/submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-footer-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
              >
                Submit your site
              </Link>
              {appUrl && (
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark"
                >
                  <Smartphone className="h-4 w-4" /> Download App
                </a>
              )}
            </div>

            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-footer-line bg-surface text-ink-soft transition hover:border-accent hover:bg-accent-soft hover:text-accent"
                  >
                    <SocialIcon name={s.key} />
                  </a>
                ))}
              </div>
            )}
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
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/disclaimer">Disclaimer</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/submit">Submit a Site</FooterLink>
              {settings.contact_email && (
                <li>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-accent"
                  >
                    <Mail className="h-3.5 w-3.5" /> Contact
                  </a>
                </li>
              )}
            </FooterCol>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-footer-line pt-6 text-sm text-ink-soft sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {settings.site_name}. A curated Bangla media index.
          </p>
          <p className="text-xs text-muted">
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
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
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
