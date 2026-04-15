"use client";

import { Copy, Gift, Share2, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import type { ReferralStats } from "@/types";

const steps = [
  { n: "01", title: "Share your link", body: "Send your referral link to fellow content creators.", icon: Share2 },
  { n: "02", title: "They sign up", body: "Your friend creates an account through your link.", icon: Users },
  { n: "03", title: "Both get tokens", body: "You each receive 15 tokens — automatically, instantly.", icon: Gift },
];

export default function ReferralClient({ code, link, stats }: { code: string; link: string; stats: ReferralStats }) {
  const copy = async (v: string, label: string) => {
    await navigator.clipboard.writeText(v);
    toast.success(`${label} copied.`);
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

      {/* Code card */}
      <div className="mb-8 rounded border border-border bg-surface p-5">
        <p className="text-xs text-muted">Your referral code</p>
        <p className="mt-2 font-mono text-2xl font-bold tracking-widest text-white">{code}</p>
        <div className="mt-1 text-xs text-muted break-all">{link}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => copy(code, "Code")}>
            <Copy className="h-3 w-3" />Copy code
          </Button>
          <Button size="sm" onClick={() => copy(link, "Link")}>
            <Copy className="h-3 w-3" />Copy link
          </Button>
        </div>
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
          {[
            { label: "Total referred", value: stats.totalReferred, color: "text-accent2" },
            { label: "Tokens earned", value: stats.tokensEarned, color: "text-gold" },
            { label: "Active users", value: stats.activeUsers, color: "text-green" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-bg px-5 py-4">
              <p className="text-xs text-muted">{label}</p>
              <p className={`mt-1.5 text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
