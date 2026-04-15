import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import HomeCta from "@/components/HomeCta";

export const metadata: Metadata = {
  title: "ScriptGen — AI YouTube Script Generator for Tamil Creators",
  description:
    "AI-powered YouTube scripting for Tamil creators. Thanglish, SEO, B-Roll, and production-ready outputs across four intelligent stages.",
};

const features = [
  ["Smart Hook Engine", "Stronger first 30 seconds so retention starts higher."],
  ["SEO Pack", "Titles, descriptions, and tags shaped for search and clicks."],
  ["Thanglish Engine", "Natural Tamil-English flow with adjustable language ratio."],
  ["Shorts Extraction", "Pull clip-ready moments from your long-form script."],
  ["AI Image Prompts", "DALL-E-ready visuals mapped to the timeline."],
  ["Production Notes", "Editing, music, and B-Roll guidance in one pass."],
];

const steps = [
  { number: "01", title: "Hook & Intro", description: "Retention-optimized opening that stops the scroll" },
  { number: "02", title: "Main Content", description: "Deep structured sections with code explanations" },
  { number: "03", title: "Demo & Outro", description: "Practical walkthrough with high-conversion CTA" },
  { number: "04", title: "Production Notes", description: "B-Roll cues, music mapping, editing timeline" },
];

const pricing = [
  { label: "Starter", tokens: 30, price: 149, scripts: "~2 scripts", featured: false },
  { label: "Value", tokens: 100, price: 399, scripts: "~7 scripts", featured: true },
  { label: "Creator", tokens: 300, price: 999, scripts: "~22 scripts", featured: false },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent2">
            AI Script Generator · Tamil Creators
          </p>
          <h1 className="mt-5 font-head text-4xl font-bold leading-tight text-white sm:text-5xl">
            Write better YouTube scripts,<br />
            <span className="text-accent2">faster than ever.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted">
            ScriptGen builds production-ready YouTube scripts across four intelligent AI stages — Hook, Content, Outro, and Production Notes. Built for Tamil & Thanglish creators.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HomeCta className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent/90">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </HomeCta>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border border-border2 px-6 py-3 text-sm font-semibold text-muted transition hover:border-white/20 hover:text-white"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-4 text-xs text-hint">No credit card needed · 30 free tokens on signup</p>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent2">The Process</p>
          <h2 className="mt-4 font-head text-2xl font-bold text-white">4 stages. One complete script.</h2>
          <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="bg-bg p-6">
                <p className="font-head text-3xl font-extrabold text-accent2">{step.number}</p>
                <h3 className="mt-4 text-sm font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent2">Features</p>
          <h2 className="mt-4 font-head text-2xl font-bold text-white">Everything in one pass.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, description]) => (
              <div key={title} className="rounded-lg border border-border bg-surface p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent/10">
                    <Check className="h-4 w-4 text-accent2" />
                  </div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                </div>
                <p className="mt-3 text-sm text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Language ───────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent2">Language Support</p>
          <h2 className="mt-4 font-head text-2xl font-bold text-white">Built for regional creators.</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {["English", "Hindi / Hinglish", "Tamil", "Thanglish ✨"].map((lang) => (
              <span
                key={lang}
                className={`rounded-md border px-4 py-2 text-sm font-medium ${
                  lang.includes("Thanglish")
                    ? "border-accent/30 bg-accent/10 text-accent2"
                    : "border-border2 bg-surface text-muted"
                }`}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent2">Pricing</p>
          <h2 className="mt-4 font-head text-2xl font-bold text-white">Simple token pricing.</h2>
          <p className="mt-2 text-sm text-muted">Pay once. No subscription. Tokens never expire.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {pricing.map((tier) => (
              <div
                key={tier.label}
                className={`rounded-lg border p-6 ${
                  tier.featured
                    ? "border-accent bg-accent/5"
                    : "border-border bg-surface"
                }`}
              >
                {tier.featured && (
                  <p className="mb-4 inline-block rounded-md bg-accent px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                    Best Value
                  </p>
                )}
                <p className="text-sm font-semibold text-white">{tier.label}</p>
                <p className="mt-4 font-head text-4xl font-extrabold text-white">{tier.tokens}</p>
                <p className="text-sm text-muted">tokens</p>
                <p className="mt-4 font-head text-2xl font-bold text-gold">₹{tier.price}</p>
                <p className="mt-1 text-xs text-muted">{tier.scripts}</p>
                <Link
                  href="/tokens"
                  className={`mt-6 block rounded-lg border px-4 py-2.5 text-center text-sm font-semibold transition ${
                    tier.featured
                      ? "border-accent bg-accent text-white hover:bg-accent/90"
                      : "border-border2 text-white hover:border-white/20"
                  }`}
                >
                  Buy Tokens
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-hint">All prices in INR including GST. Powered by Razorpay.</p>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-surface p-10 text-center">
            <h2 className="font-head text-2xl font-bold text-white">Ready to write your next script?</h2>
            <p className="mt-3 text-sm text-muted">Start with 30 free tokens. No credit card required.</p>
            <Link
              href="/generate"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent/90"
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
