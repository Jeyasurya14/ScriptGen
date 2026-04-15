"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LayoutGrid, Users, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { getTokenTotal } from "@/lib/credits";

const items = [
  { label: "Generate", href: "/generate", icon: LayoutGrid },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Referral", href: "/referral", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const tokens =
    session?.user?.tokenBalance?.totalTokens ??
    session?.user?.tokens ??
    getTokenTotal(session?.user?.credits ?? null);

  return (
    <aside className="fixed left-0 top-14 hidden h-[calc(100vh-56px)] w-48 flex-col border-r border-border bg-bg md:flex">
      <nav className="flex-1 px-2 py-3">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-0.5 flex items-center gap-2.5 rounded px-2.5 py-2 text-sm transition-colors ${
                active
                  ? "bg-surface2 text-white"
                  : "text-muted hover:bg-surface hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Token status */}
      <div className="border-t border-border p-3">
        <div
          className="flex cursor-pointer items-center justify-between rounded border border-border bg-surface px-3 py-2 text-xs transition hover:bg-surface2"
          onClick={() => router.push("/tokens")}
        >
          <span className="text-muted">Tokens</span>
          <div className="flex items-center gap-1 font-medium text-white">
            <Zap className="h-3 w-3 text-gold" />
            {tokens}
          </div>
        </div>
      </div>
    </aside>
  );
}
