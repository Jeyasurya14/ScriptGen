"use client";

import { ArrowRight, Copy, Gift, Share2, Users, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import type { ReferralStats } from "@/types";

const steps = [
  {
    number: "01",
    title: "Share your code",
    description: "Send your personal link to creators who would benefit from ScriptGen.",
    icon: Share2,
  },
  {
    number: "02",
    title: "Friend signs up",
    description: "They join ScriptGen through your referral and unlock their first script flow.",
    icon: Users,
  },
  {
    number: "03",
    title: "Both earn tokens",
    description: "The reward lands automatically so both of you can generate more content.",
    icon: Gift,
  },
];

export default function ReferralClient({
  code,
  link,
  stats,
}: {
  code: string;
  link: string;
  stats: ReferralStats;
}) {
  const copyValue = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-xl font-semibold text-white">Referral Program</h1>
        <p className="mt-1 text-sm text-muted">
          Share your code. You both get 15 free tokens when someone signs up.
        </p>
      </div>

      {/* Referral card */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Your Referral Code</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-accent2">{code}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-md border border-gold/20 bg-gold-bg px-3 py-1.5 text-xs font-semibold text-gold">
              <Zap className="h-3 w-3 fill-current" />
              You get 15 tokens
            </div>
            <ArrowRight className="h-4 w-4 text-muted" />
            <div className="flex items-center gap-1.5 rounded-md border border-green/20 bg-green-bg px-3 py-1.5 text-xs font-semibold text-green">
              <Zap className="h-3 w-3 fill-current" />
              Friend gets 15 tokens
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => copyValue(code)}>
            <Copy className="h-3.5 w-3.5" />
            Copy Code
          </Button>
          <Button size="sm" onClick={() => copyValue(link)}>
            <Copy className="h-3.5 w-3.5" />
            Copy Link
          </Button>
        </div>
      </div>

      {/* How it works */}
      <section className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-white">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="rounded-lg border border-border bg-surface p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border2 bg-surface2">
                <step.icon className="h-4 w-4 text-accent2" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-lg font-bold text-accent2">{step.number}</span>
                <h3 className="text-sm font-semibold text-white">{step.title}</h3>
              </div>
              <p className="mt-2 text-xs text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-white">Your Stats</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="text-xs text-muted">Total Referred</p>
            <p className="mt-2 text-3xl font-bold text-accent2">{stats.totalReferred}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="text-xs text-muted">Tokens Earned</p>
            <p className="mt-2 text-3xl font-bold text-gold">{stats.tokensEarned}</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="text-xs text-muted">Active Users</p>
            <p className="mt-2 text-3xl font-bold text-green">{stats.activeUsers}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
