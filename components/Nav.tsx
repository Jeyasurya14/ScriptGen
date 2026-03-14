"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "./ui/Badge";

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const credits = (session?.user as any)?.credits;
  const tokenCount = credits?.totalTokens ?? 0;
  const showBuyTokens = tokenCount < 10;

  // Initials for avatar fallback
  const getInitials = (name?: string | null) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] h-[60px] transition-all duration-300 border-b ${
        isScrolled ? "bg-bg/80 backdrop-blur-md border-surface2" : "bg-transparent border-transparent"
      }`}
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl">🎬</span>
          <span className="font-head font-extrabold text-lg tracking-tight text-white group-hover:text-accent transition-colors">
            ScriptGen
          </span>
          <Badge variant="accent" className="ml-1 scale-75 origin-left">BETA</Badge>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              {/* Token Pill */}
              <div className="flex items-center gap-2">
                <div 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-gold/20 text-gold font-bold text-xs ${showBuyTokens ? 'animate-pulse' : ''}`}
                  role="status"
                  aria-live="polite"
                  aria-label={`Tokens remaining: ${tokenCount}`}
                >
                  <Zap className="w-3.5 h-3.5 fill-gold" aria-hidden="true" />
                  <span>{tokenCount}</span>
                </div>
                {showBuyTokens && (
                  <Link href="/tokens" className="text-[10px] font-bold text-gold hover:underline hidden sm:block">
                    Buy Tokens
                  </Link>
                )}
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center border-2 border-surface2 overflow-hidden shadow-lg">
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-white">
                    {getInitials(session.user?.name)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <button 
              onClick={() => signIn("google")}
              className="px-4 py-2 rounded-lg bg-accent hover:bg-accent2 text-white text-sm font-bold transition-all shadow-lg shadow-accent/20"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay (Simple) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[60px] left-0 right-0 bg-surface border-b border-surface2 p-6 animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-white/70 hover:text-white">Home</Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-white/70 hover:text-white">Dashboard</Link>
            <Link href="/generate" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-white/70 hover:text-white">Generate</Link>
            <Link href="/referral" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-white/70 hover:text-white">Referral</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
