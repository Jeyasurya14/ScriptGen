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
        "fixed inset-x-0 top-0 z-50 border-b transition duration-300",
        isScrolled || isAppRoute
          ? "border-border bg-bg/95 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg">🎬</span>
          <span className="font-head text-lg font-extrabold tracking-tight text-white">
            Script<span className="text-accent2">Gen</span>
          </span>
          <Badge className="hidden sm:inline-flex">Beta</Badge>
        </Link>

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

        <div className="flex items-center gap-3">
          {session?.user?.email ? (
            <>
              <button
                type="button"
                onClick={() => router.push("/tokens")}
                role="status"
                aria-live="polite"
                className={`inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold-bg px-3 py-1.5 text-xs font-semibold text-gold transition hover:border-gold/40 ${tokenCount < 10 ? "animate-pulse-slow" : ""}`}
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>{tokenCount}</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-full border border-border2 bg-[linear-gradient(135deg,#6C63FF,#B06AFF)] text-xs font-semibold text-white"
                aria-label="Open account"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    width={34}
                    height={34}
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
              className="rounded-full border border-accent/40 bg-accent-glow px-4 py-2 text-sm font-semibold text-white transition hover:border-accent hover:bg-accent/20"
            >
              Sign in
            </button>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-white md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
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
                className="rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-white/[0.04] hover:text-white"
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
