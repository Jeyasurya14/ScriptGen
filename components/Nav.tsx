"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { getTokenTotal } from "@/lib/credits";

const appLinks = [
  { href: "/generate", label: "Generate" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/referral", label: "Referral" },
];

function getInitials(name?: string | null) {
  if (!name) return "SG";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAppRoute =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/generate") ||
    pathname?.startsWith("/referral") ||
    pathname?.startsWith("/tokens") ||
    pathname?.startsWith("/app");

  const tokenCount =
    session?.user?.tokenBalance?.totalTokens ??
    session?.user?.tokens ??
    getTokenTotal(session?.user?.credits ?? null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition duration-200",
        isScrolled || isAppRoute
          ? "border-border bg-bg/95 backdrop-blur-md"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-[60px] max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-head text-base font-bold text-white">
            Script<span className="text-accent2">Gen</span>
          </span>
          <Badge className="hidden sm:inline-flex">Beta</Badge>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {!isAppRoute ? (
            <>
              <Link href="/#how-it-works" className="text-sm text-muted transition hover:text-white">
                How it works
              </Link>
              <Link href="/#pricing" className="text-sm text-muted transition hover:text-white">
                Pricing
              </Link>
            </>
          ) : (
            appLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition ${pathname?.startsWith(link.href) ? "text-white" : "text-muted hover:text-white"}`}
              >
                {link.label}
              </Link>
            ))
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {session?.user?.email ? (
            <>
              <button
                type="button"
                onClick={() => router.push("/tokens")}
                role="status"
                aria-live="polite"
                className="inline-flex items-center gap-1.5 rounded-md border border-gold/20 bg-gold-bg px-2.5 py-1 text-xs font-semibold text-gold transition hover:border-gold/40"
              >
                <Zap className="h-3 w-3 fill-current" />
                <span>{tokenCount}</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border2 bg-surface2 text-xs font-semibold text-white"
                aria-label="Open account"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(session.user.name)
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/generate" })}
              className="rounded-md border border-border2 bg-surface px-4 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-surface2"
            >
              Sign in
            </button>
          )}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-white md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border bg-bg px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/generate", label: "Generate" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/referral", label: "Referral" },
              { href: "/tokens", label: "Tokens" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
