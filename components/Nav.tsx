"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  // Don't show global nav on /app — ScriptGenerator has its own header with Home link
  if (pathname?.startsWith("/app")) {
    return null;
  }

  return (
    <nav
      className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40"
      aria-label="Main"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link
            href="/"
            className="text-base font-semibold text-slate-900 hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-1"
          >
            Script<span className="text-blue-600">Gen</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                pathname === "/"
                  ? "text-slate-900 bg-slate-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/#pricing"
              className="px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              Pricing
            </Link>
            <Link
              href="/app"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                pathname?.startsWith("/app")
                  ? "text-slate-900 bg-slate-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              App
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
