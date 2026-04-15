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
  ["4-Stage Script Pipeline", "Hook → Content → Outro → Production Notes, generated sequentially for a coherent long-form script."],
  ["Thanglish Engine", "Fine-tune Tamil/English ratio from 10% to 90% to match your channel voice."],
  ["SEO Pack", "AI-generated titles with CTR scores, meta description, and 20+ searchable tags."],
  ["B-Roll & Chapters", "Timestamped B-Roll suggestions and YouTube chapter markers in one pass."],
  ["Shorts Extraction", "Clip-ready viral moments pulled directly from your long-form script."],
  ["AI Image Prompts", "DALL-E–ready visual prompts mapped to your script timeline."],
];

const steps = [
  { n: "01", title: "Hook & Intro", body: "Retention-optimized opening that stops the scroll in the first 30 seconds." },
  { n: "02", title: "Main Content", body: "Structured deep-dive with code explanations, context, and examples." },
  { n: "03", title: "Demo & Outro", body: "Practical walkthrough with a high-conversion call-to-action." },
  { n: "04", title: "Production Notes", body: "B-Roll cues, music mapping, and editing timeline for your editor." },
];

const pricing = [
  { id: "test-drive", label: "Test Drive", tokens: 15, price: 49, approx: "~1 script" },
  { id: "value",   label: "Value",   tokens: 100, price: 199, approx: "~7 scripts", featured: true },
  { id: "creator", label: "Creator", tokens: 500, price: 749, approx: "~35 scripts" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ScriptGen",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "49.00",
      highPrice: "749.00",
      priceCurrency: "INR",
    },
    description: "AI-powered YouTube scripting for Tamil creators. Thanglish, SEO, B-Roll, and production-ready outputs across four intelligent stages.",
  };

  return (
    <main className="pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-screen-xl px-5 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-medium text-muted">AI YouTube Script Generator · Tamil Creators</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Write your next script,<br />faster and in your language.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              ScriptGen generates production-ready YouTube scripts in 4 sequential AI stages — Hook, Content, Outro, and Production Notes. Built natively for Tamil and Thanglish creators.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <HomeCta className="inline-flex items-center gap-2 rounded bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90">
                Get Started Free
                <ArrowRight className="h-3.5 w-3.5" />
              </HomeCta>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-muted transition hover:border-border2 hover:text-white"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-3 text-xs text-hint">Free to start — 30 tokens on signup, no credit card required.</p>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-border">
        <div className="mx-auto max-w-screen-xl px-5 py-16">
          <p className="mb-8 text-xs font-medium uppercase tracking-widest text-muted">Process</p>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="bg-bg px-6 py-7">
                <span className="text-xs font-mono font-medium text-accent2">{step.n}</span>
                <h3 className="mt-3 text-sm font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-screen-xl px-5 py-16">
          <p className="mb-8 text-xs font-medium uppercase tracking-widest text-muted">Features</p>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([title, body]) => (
              <div key={title} className="bg-bg px-6 py-6">
                <div className="flex items-start gap-3">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent2" />
                  <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Language support ─────────────────────────────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-screen-xl px-5 py-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">Language Support</p>
          <h2 className="mb-8 text-xl font-semibold text-white">Built for regional creators</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "English",          active: false },
              { label: "Hindi / Hinglish", active: false },
              { label: "Tamil",            active: false },
              { label: "Thanglish",        active: true  },
            ].map(({ label, active }) => (
              <span
                key={label}
                className={`rounded border px-3 py-1.5 text-xs font-medium ${
                  active
                    ? "border-accent/30 bg-accent/10 text-accent2"
                    : "border-border bg-surface text-muted"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-hint">
            Thanglish mode lets you set a Tamil/English ratio — from code-heavy English to full Tamil, with everything in between.
          </p>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section id="pricing" className="border-b border-border">
        <div className="mx-auto max-w-screen-xl px-5 py-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">Pricing</p>
          <h2 className="mb-2 text-xl font-semibold text-white">Pay once, use anytime</h2>
          <p className="mb-10 text-sm text-muted">No subscription. Tokens never expire. All prices in INR.</p>

          <div className="grid max-w-3xl gap-4 sm:grid-cols-3">
            {pricing.map((tier) => (
              <div
                key={tier.id}
                className={`rounded border p-5 ${
                  tier.featured
                    ? "border-accent/50 bg-accent/5"
                    : "border-border bg-surface"
                }`}
              >
                {tier.featured && (
                  <p className="mb-3 w-fit rounded bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent2">
                    Best Value
                  </p>
                )}
                <p className="text-xs text-muted">{tier.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{tier.tokens}</p>
                <p className="text-xs text-muted">tokens · {tier.approx}</p>
                <p className="mt-4 text-lg font-semibold text-white">₹{tier.price}</p>
                <Link
                  href="/tokens"
                  className={`mt-4 block rounded border py-2 text-center text-xs font-medium transition ${
                    tier.featured
                      ? "border-accent bg-accent text-white hover:bg-accent/90"
                      : "border-border text-muted hover:border-border2 hover:text-white"
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-hint">All prices in INR including GST · Secured by Razorpay</p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-screen-xl px-5 py-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded border border-border bg-surface p-8 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">Ready to write your next script?</h2>
              <p className="mt-1 text-sm text-muted">Start with 30 free tokens. No credit card required.</p>
            </div>
            <Link
              href="/generate"
              className="inline-flex shrink-0 items-center gap-2 rounded bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
            >
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
