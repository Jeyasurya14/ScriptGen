"use client";

import { ArrowRight, Copy, Gift, Share2, Users, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import type { ReferralStats } from "@/types";

const steps = [
  {
    number: "1",
    title: "Share your code",
    description: "Send your personal link to creators who would benefit from ScriptGen.",
    icon: Share2,
    accent: "bg-accent-glow text-accent2",
  },
  {
    number: "2",
    title: "Friend signs up",
    description: "They join ScriptGen through your referral and unlock their first script flow.",
    icon: Users,
    accent: "bg-accent-glow text-accent2",
  },
  {
    number: "3",
    title: "Both earn tokens",
    description: "The reward lands automatically so both of you can generate more content.",
    icon: Gift,
    accent: "bg-green-bg text-green",
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
    <div className="mx-auto max-w-6xl space-y-10 p-6 md:p-8">
      <div className="rounded-[32px] bg-[linear-gradient(135deg,rgba(108,99,255,0.4),rgba(255,181,71,0.18),rgba(20,24,38,0.95))] p-[1px]">
        <div className="rounded-[31px] bg-[linear-gradient(180deg,rgba(14,18,32,0.98),rgba(20,24,38,0.96))] p-8 md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="gold">Referral Loop</Badge>
            <h1 className="mt-5 font-head text-4xl font-extrabold text-white md:text-5xl">
              Invite Creators. Earn Tokens.
            </h1>
            <p className="mt-4 text-base text-muted">
              Share your code. When someone signs up, you both instantly receive 15 free tokens.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <div className="rounded-full border border-gold/20 bg-gold-bg px-4 py-2 text-sm font-semibold text-gold">
                You get ⚡15
              </div>
              <ArrowRight className="h-4 w-4 text-muted" />
              <div className="rounded-full border border-green/20 bg-green-bg px-4 py-2 text-sm font-semibold text-green">
                Friend gets ⚡15
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-border bg-surface px-6 py-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Referral Code</p>
              <p className="mt-3 font-mono text-3xl font-semibold tracking-[0.45em] text-accent2 md:text-4xl">
                {code}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button variant="ghost" onClick={() => copyValue(code)}>
                  <Copy className="h-4 w-4" />
                  Copy Code
                </Button>
                <Button onClick={() => copyValue(link)}>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent2">The Process</p>
          <h2 className="mt-2 font-head text-3xl font-bold text-white">A simple reward loop that compounds.</h2>
        </div>

        <div className="relative grid gap-4 md:grid-cols-3">
          <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-10 hidden border-t border-dashed border-border2 md:block" />
          {steps.map((step) => (
            <Card key={step.number} className="relative">
              <CardBody className="space-y-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${step.accent}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-head text-3xl font-extrabold text-accent2">{step.number}</span>
                  <h3 className="font-head text-xl font-semibold text-white">{step.title}</h3>
                </div>
                <p className="text-sm text-muted">{step.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent2">Your Stats</p>
          <h2 className="mt-2 font-head text-3xl font-bold text-white">The value you&apos;ve unlocked so far.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardBody className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Total Referred</p>
              <p className="font-head text-4xl font-bold text-accent2">{stats.totalReferred}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Tokens Earned</p>
              <p className="font-head text-4xl font-bold text-gold">{stats.tokensEarned}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Active Users</p>
              <p className="font-head text-4xl font-bold text-green">{stats.activeUsers}</p>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2 px-3 py-1.5">
            <Zap className="h-4 w-4 text-gold" />
            Rewards are automatic
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2 px-3 py-1.5">
            <Users className="h-4 w-4 text-accent2" />
            Built for creator referrals
          </span>
        </div>
      </section>
    </div>
  );
}
