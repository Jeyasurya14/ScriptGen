import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown, Sparkles, Star } from "lucide-react";
import HomeCta from "@/components/HomeCta";

export const metadata: Metadata = {
  title: "ScriptGen — AI YouTube Script Generator for Tamil Creators",
  description:
    "AI-powered YouTube scripting for Tamil creators. Thanglish, SEO, B-Roll, and production-ready outputs across four intelligent stages.",
};

const processCards = [
  {
    number: "01",
    title: "Hook & Intro",
    description: "Retention-optimized opening that stops the scroll",
  },
  {
    number: "02",
    title: "Main Content",
    description: "Deep structured sections with code explanations",
  },
  {
    number: "03",
    title: "Demo & Outro",
    description: "Practical walkthrough with high-conversion CTA",
  },
  {
    number: "04",
    title: "Production Notes",
    description: "B-Roll cues, music mapping, editing timeline",
  },
];

const features = [
  ["🎯", "Smart Hook Engine", "Stronger first 30 seconds so retention starts higher."],
  ["🔍", "SEO Pack", "Titles, descriptions, and tags shaped for search and clicks."],
  ["🗣️", "Thanglish Engine", "Natural Tamil-English flow with adjustable language ratio."],
  ["📱", "Shorts Extraction", "Pull clip-ready moments from your long-form script."],
  ["🖼️", "AI Image Prompts", "DALL-E-ready visuals mapped to the timeline."],
  ["🎬", "Production Notes", "Editing, music, and B-Roll guidance in one pass."],
];

const pricing = [
  { label: "Starter", tokens: 30, price: 149, scripts: "~2 scripts", featured: false },
  { label: "Value", tokens: 100, price: 399, scripts: "~7 scripts", featured: true },
  { label: "Creator", tokens: 300, price: 999, scripts: "~22 scripts", featured: false },
];

export default function HomePage() {
  return (
    <main className="hero-radial">
      <section className="flex min-h-[calc(100vh-60px)] items-center">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="rounded-full border border-gold/20 bg-gold-bg px-4 py-2 text-sm font-medium text-gold">
            ✨ Thanglish Engine Now Live
          </div>
          <h1 className="mt-8 font-head text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem]">
            <span className="block">Your Script.</span>
            <span className="text-gradient-accent block">Your Voice.</span>
            <span className="block">Zero Writer&apos;s Block.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            AI-powered YouTube scripting for Tamil creators. Thanglish, SEO, B-Roll, and smart production notes, all stitched together in four intelligent stages.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <HomeCta className="inline-flex items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-[linear-gradient(135deg,#6C63FF,#B06AFF)] px-7 py-4 font-head text-base font-semibold text-white shadow-[0_18px_50px_rgba(108,99,255,0.32)]">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </HomeCta>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border2 bg-white/[0.02] px-7 py-4 text-base font-semibold text-white transition hover:border-accent/30 hover:bg-white/[0.05]"
            >
              See How It Works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">No credit card needed · 30 free tokens on signup</p>
          <div className="mt-14 text-muted">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 text-center sm:px-6 lg:px-8 md:flex-row md:justify-center">
          <div className="flex items-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="text-sm text-muted">Trusted by 500+ Tamil YouTube Creators</p>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-accent2">The Process</p>
          <h2 className="mt-3 font-head text-4xl font-bold text-white">4 Stages. One Perfect Script.</h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {processCards.map((card) => (
            <div key={card.number} className="rounded-3xl border border-border bg-surface p-6">
              <div className="border-l-2 border-accent pl-4">
                <p className="font-head text-4xl font-extrabold text-accent2">{card.number}</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm text-muted">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-accent2">Feature Stack</p>
          <h2 className="mt-3 font-head text-4xl font-bold text-white">Everything You Need to Ship</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map(([emoji, title, description]) => (
            <div
              key={title}
              className="rounded-3xl border border-border bg-surface p-6 transition hover:border-accent/40"
            >
              <div className="text-3xl">{emoji}</div>
              <h3 className="mt-4 font-head text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-accent2">Language Layer</p>
        <h2 className="mt-3 font-head text-4xl font-bold text-white">Built for Regional Creators</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {["English", "Hindi Hinglish", "Tamil", "Thanglish ✨"].map((language) => (
            <div
              key={language}
              className={`rounded-full border px-5 py-3 text-sm font-medium ${
                language.includes("Thanglish")
                  ? "border-accent/30 bg-accent-glow text-accent2"
                  : "border-border2 bg-surface text-muted"
              }`}
            >
              {language}
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-border bg-surface p-6 text-left">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Tamil Ratio</span>
            <span className="font-semibold text-accent2">40%</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/[0.06]">
            <div className="h-full w-[40%] rounded-full bg-[linear-gradient(90deg,#6C63FF,#B06AFF)]" />
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-center md:mx-auto">
          <p className="text-[11px] uppercase tracking-[0.24em] text-accent2">Pricing</p>
          <h2 className="mt-3 font-head text-4xl font-bold text-white">Simple Token Pricing</h2>
          <p className="mt-3 text-muted">Pay once. No subscription. Tokens never expire.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pricing.map((tier) => (
            <div
              key={tier.label}
              className={`relative rounded-[28px] border p-6 ${
                tier.featured
                  ? "border-2 border-accent bg-[linear-gradient(180deg,rgba(108,99,255,0.16),rgba(14,18,32,0.98))]"
                  : "border-border bg-surface"
              }`}
            >
              {tier.featured ? (
                <div className="absolute right-4 top-4 rounded-full bg-accent px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-white">
                  BEST VALUE
                </div>
              ) : null}
              <p className="text-sm text-muted">{tier.label}</p>
              <p className="mt-4 font-head text-5xl font-extrabold text-accent2">{tier.tokens}</p>
              <p className="mt-1 text-sm text-muted">tokens</p>
              <p className="mt-4 font-head text-3xl font-bold text-gold">₹{tier.price}</p>
              <p className="mt-2 text-sm text-muted">{tier.scripts}</p>
              <Link
                href="/tokens"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold ${
                  tier.featured
                    ? "border-accent/30 bg-[linear-gradient(135deg,#6C63FF,#B06AFF)] text-white"
                    : "border-border2 bg-white/[0.02] text-white"
                }`}
              >
                Buy Tokens
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-muted">All prices in INR including GST. Powered by Razorpay.</p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-accent/15 bg-[linear-gradient(135deg,rgba(108,99,255,0.18),rgba(14,18,32,0.96))] px-6 py-12 text-center">
          <h2 className="font-head text-4xl font-bold text-white">Ready to Script Your Next Viral Video?</h2>
          <Link
            href="/generate"
            className="mt-6 inline-flex items-center justify-center rounded-2xl border border-accent/40 bg-[linear-gradient(135deg,#6C63FF,#B06AFF)] px-6 py-4 font-head text-base font-semibold text-white"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  );
}
