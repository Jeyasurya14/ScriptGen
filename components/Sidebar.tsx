"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileEdit, LayoutDashboard, Users, Zap } from "lucide-react";

const items = [
  { label: "Generate", href: "/generate", icon: FileEdit },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Referral", href: "/referral", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[60px] hidden h-[calc(100vh-60px)] w-[200px] flex-col border-r border-border bg-bg md:flex">
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-surface text-white"
                  : "text-muted hover:bg-surface hover:text-white",
              ].join(" ")}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href="/tokens"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border2 bg-surface px-3 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-surface2"
        >
          <Zap className="h-3.5 w-3.5 text-gold" />
          Buy Tokens
        </Link>
      </div>
    </aside>
  );
}
