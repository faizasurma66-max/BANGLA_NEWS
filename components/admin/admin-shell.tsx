"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  FolderTree,
  Inbox,
  FileText,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/outlets", label: "Outlets", icon: Newspaper },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface p-4 lg:flex">
        <div className="px-2 py-3">
          <span className="font-serif text-lg font-semibold text-ink">
            ANB <span className="text-accent">Admin</span>
          </span>
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active ? "bg-accent-soft text-accent" : "text-ink-soft hover:bg-band",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-line pt-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-band"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-band"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
          <span className="font-serif text-base font-semibold text-ink">
            ANB <span className="text-accent">Admin</span>
          </span>
          <form action={logout}>
            <button type="submit" className="text-sm text-muted">
              Sign out
            </button>
          </form>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-line bg-surface px-2 py-2 lg:hidden">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium",
                  active ? "bg-accent-soft text-accent" : "text-ink-soft",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
