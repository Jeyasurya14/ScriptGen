"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileEdit, Files, LayoutDashboard, Sparkles, Users } from "lucide-react";

const items = [
  { label: "Script Generator", href: "/generate", icon: FileEdit },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Referral", href: "/referral", icon: Users },
  { label: "Recent Scripts", href: "/dashboard#recent-scripts", icon: Files },
  { label: "Saved Templates", href: "/generate", icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[60px] hidden h-[calc(100vh-60px)] w-[220px] flex-col border-r border-border bg-surface md:flex">
      <nav className="flex-1 space-y-1 px-3 py-6">
        {items.map((item) => {
          const active =
            item.href === "/dashboard#recent-scripts"
              ? pathname?.startsWith("/dashboard")
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition",
                active
                  ? "border-accent/20 bg-accent-glow text-accent2"
                  : "border-transparent text-muted hover:border-border hover:bg-white/[0.04] hover:text-white",
              ].join(" ")}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-3xl border border-accent/20 bg-[linear-gradient(180deg,rgba(108,99,255,0.18),rgba(20,24,38,0.95))] p-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent2">Go Pro</p>
          <h3 className="mt-2 font-head text-lg font-semibold text-white">Top up and keep shipping.</h3>
          <p className="mt-2 text-sm text-muted">Buy more tokens when you are ready for your next batch of scripts.</p>
          <Link
            href="/tokens"
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-accent/30 bg-accent-glow px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent/25"
          >
            Buy tokens
          </Link>
        </div>
      </div>
    </aside>
  );
}
