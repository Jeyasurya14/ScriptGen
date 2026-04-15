"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getTokenTotal } from "@/lib/credits";

const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
];

const appLinks = [
  { href: "/generate", label: "Generate" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/referral", label: "Referral" },
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isApp =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/generate") ||
    pathname?.startsWith("/referral") ||
    pathname?.startsWith("/tokens");

  const tokens =
    session?.user?.tokenBalance?.totalTokens ??
    session?.user?.tokens ??
    getTokenTotal(session?.user?.credits ?? null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 0);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${scrolled || isApp ? "border-b border-border bg-bg" : "border-b border-transparent bg-transparent"}`}>
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-[11px] font-bold text-white">S</span>
          ScriptGen
          <span className="rounded bg-surface2 px-1.5 py-0.5 text-[10px] font-medium text-muted">Beta</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {(isApp ? appLinks : navLinks).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                pathname?.startsWith(link.href) && isApp
                  ? "bg-surface text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {session?.user?.email ? (
            <>
              <button
                type="button"
                onClick={() => router.push("/tokens")}
                className="hidden items-center gap-1.5 rounded border border-border px-2.5 py-1 text-xs font-medium text-muted transition hover:border-border2 hover:text-white sm:flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {tokens} tokens
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-border2 bg-surface2 text-[11px] font-semibold text-white"
                aria-label="Account"
              >
                {session.user.image ? (
                  <Image src={session.user.image} alt="Profile" width={28} height={28} className="h-full w-full object-cover" />
                ) : (
                  getInitials(session.user.name)
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/generate" })}
              className="rounded border border-border bg-surface px-3 py-1.5 text-sm font-medium text-white transition hover:bg-surface2"
            >
              Sign in
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-bg px-5 py-3 md:hidden">
          {[...navLinks, ...appLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded px-2 py-2 text-sm text-muted hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
