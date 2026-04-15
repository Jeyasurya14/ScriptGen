"use client";

import { useEffect, useState } from "react";
import { Copy, Gift, Share2, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

type Stats = { totalReferred: number; tokensEarned: number; activeUsers: number };

const EMPTY_STATS: Stats = { totalReferred: 0, tokensEarned: 0, activeUsers: 0 };

const steps = [
  { n: "01", title: "Share your link", body: "Send your referral link to fellow content creators.", icon: Share2 },
  { n: "02", title: "They sign up", body: "Your friend creates an account through your link.", icon: Users },
  { n: "03", title: "Both get tokens", body: "You each receive 15 tokens — automatically, instantly.", icon: Gift },
];

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-bg px-5 py-4">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1.5 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function ReferralPage() {
  const [code, setCode] = useState<string | null>(null);
  const [link, setLink] = useState<string>("");
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [codeLoading, setCodeLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch referral code and stats independently so one failure doesn't block the other
    void (async () => {
      try {
        const res = await fetch("/api/referral", { cache: "no-store" });
        if (res.status === 401) { window.location.href = "/"; return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load referral code");
        setCode(data.code ?? "");
        setLink(data.link ?? "");
      } catch (e) {
        setCodeError(e instanceof Error ? e.message : "Failed to load referral code");
      } finally {
        setCodeLoading(false);
      }
    })();

    void (async () => {
      try {
        const res = await fetch("/api/referral/stats", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json() as Stats;
          setStats(data);
        }
      } catch {
        // Stats failing is non-critical — keep showing zeros
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  const copy = async (v: string, label: string) => {
    try {
      await navigator.clipboard.writeText(v);
      toast.success(`${label} copied.`);
    } catch {
      toast.error("Failed to copy.");
    }
  };

  const retryCode = () => {
    setCodeError(null);
    setCodeLoading(true);
    void (async () => {
      try {
        const res = await fetch("/api/referral", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load referral code");
        setCode(data.code ?? "");
        setLink(data.link ?? "");
      } catch (e) {
        setCodeError(e instanceof Error ? e.message : "Failed to load referral code");
      } finally {
        setCodeLoading(false);
      }
    })();
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Referral Program</h1>
        <p className="mt-0.5 text-sm text-muted">
          Invite someone to ScriptGen — you both receive 15 free tokens when they sign up.
        </p>
      </div>

      {/* Referral code card */}
      <div className="mb-8 rounded border border-border bg-surface p-5">
        {codeLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-3 w-72" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ) : codeError ? (
          <div className="space-y-3">
            <p className="text-xs text-muted">Your referral code</p>
            <p className="text-sm text-red">{codeError}</p>
            <Button variant="ghost" size="sm" onClick={retryCode}>Retry</Button>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted">Your referral code</p>
            <p className="mt-2 font-mono text-2xl font-bold tracking-widest text-white">
              {code || "—"}
            </p>
            {link && <p className="mt-1 break-all text-xs text-hint">{link}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" disabled={!code} onClick={() => copy(code!, "Code")}>
                <Copy className="h-3 w-3" />Copy code
              </Button>
              <Button size="sm" disabled={!link} onClick={() => copy(link, "Link")}>
                <Copy className="h-3 w-3" />Copy link
              </Button>
            </div>
          </>
        )}
      </div>

      {/* How it works */}
      <div className="mb-8">
        <p className="mb-3 text-xs font-medium text-muted">How it works</p>
        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="bg-bg px-5 py-5">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded border border-border bg-surface">
                <step.icon className="h-3.5 w-3.5 text-muted" />
              </div>
              <p className="font-mono text-xs text-accent2">{step.n}</p>
              <p className="mt-1 text-sm font-medium text-white">{step.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <p className="mb-3 text-xs font-medium text-muted">Your stats</p>
        <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
          {statsLoading ? (
            <>
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2 bg-bg px-5 py-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-16" />
                </div>
              ))}
            </>
          ) : (
            <>
              <StatCard label="Total referred" value={stats.totalReferred} color="text-accent2" />
              <StatCard label="Tokens earned"  value={stats.tokensEarned}  color="text-gold" />
              <StatCard label="Active users"   value={stats.activeUsers}   color="text-green" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
