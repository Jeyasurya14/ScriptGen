import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";
import {
  ChevronLeft,
  Zap,
  LayoutList,
  TrendingUp,
  Search,
  Sparkles,
  CheckCircle2,
  Quote,
} from "lucide-react";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "How to Write YouTube Scripts That Keep Viewers Watching (2026 Guide)",
  description:
    "Learn proven YouTube script writing techniques: hooks, pacing, structure, CTAs. Free template and examples. Use AI to automate your script writing process.",
  alternates: { canonical: `${siteUrl}/blog/how-to-write-youtube-scripts` },
};

const steps = [
  {
    icon: Zap,
    title: "1. Start with a Hook (First 3–5 Seconds)",
    intro: "Your hook determines if viewers stay or leave. Use one of these proven patterns:",
    items: [
      { label: "Problem statement", example: '"Still struggling with low watch time?"' },
      { label: "Bold promise", example: '"This technique doubled my subscriber growth in 30 days"' },
      { label: "Pattern interrupt", example: '"Everything you know about YouTube scripts is wrong"' },
      { label: "Question", example: '"What if you could automate your entire script writing process?"' },
    ],
    tip: "Pick one pattern and nail it in the first sentence. No long intros.",
  },
  {
    icon: LayoutList,
    title: "2. Structure Your Script in 5 Parts",
    intro: "A clear structure keeps viewers watching and helps YouTube recommend your video.",
    items: [
      { label: "Hook (0–5s)", detail: "Grab attention immediately" },
      { label: "Intro (5–30s)", detail: "Promise value, introduce topic" },
      { label: "Main content (70% of video)", detail: "Deliver on your promise with clear segments" },
      { label: "Demo/proof (optional)", detail: "Show examples or results" },
      { label: "Outro (last 10%)", detail: "CTA, next steps, subscribe reminder" },
    ],
    tip: "Write the hook and outro first — they’re the hardest and most important.",
  },
  {
    icon: TrendingUp,
    title: "3. Write for Retention, Not Length",
    intro: "YouTube’s algorithm rewards watch time and retention. Apply these:",
    items: [
      "Use chapter markers every 60–90 seconds to reset attention",
      "Include pattern breaks: \"But here's what nobody tells you...\"",
      "Cut filler words — every sentence should add value",
      "Tease what’s coming: \"I'll show you the exact template in a minute\"",
    ],
    tip: "If a sentence doesn’t add value or build tension, cut it.",
  },
  {
    icon: Search,
    title: "4. Optimize for SEO While Writing",
    intro: "Build SEO into your script from the start so your video can be found:",
    items: [
      "Use target keywords naturally — say \"AI script generator\" or \"YouTube SEO\" in your script (YouTube indexes captions)",
      "Write your description in the script — the first 2–3 sentences of your script become your description",
      "Plan chapters — each major section = a YouTube chapter for better searchability",
    ],
    tip: "One primary keyword per video. Repeat it in the hook, a mid-section, and the outro.",
  },
  {
    icon: Sparkles,
    title: "5. Automate with AI (Save 90% of Your Time)",
    intro: "Writing scripts manually takes 2–4 hours. ScriptGen’s AI creates the same quality in under 5 minutes:",
    items: [
      "Automatic hook, intro, main, outro structure",
      "SEO-optimized titles, descriptions, tags",
      "Chapter timestamps and B-roll suggestions",
      "Multi-language support (Tamil, Hindi, English, Thunglish)",
    ],
    tip: "Use AI for the first draft, then add your voice and examples.",
  },
];

const checklistItems = [
  "Hook in the first 3–5 seconds",
  "Clear 5-part structure (hook → intro → main → demo → outro)",
  "Chapter markers every 60–90 seconds",
  "Target keyword in script and description",
  "Strong CTA and subscribe reminder at the end",
];

export default function HowToWriteYouTubeScripts() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-2 py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Documentation
        </Link>

        {/* Hero */}
        <header className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4">
            Guide
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            How to Write YouTube Scripts That Keep Viewers Watching
          </h1>
          <p className="text-slate-500 text-sm mb-6">Published Feb 2026 · 7 min read</p>
          <p className="text-lg text-slate-700 leading-relaxed">
            The difference between a video that goes viral and one that gets skipped? A well-structured script. Here’s how to hook viewers in the first 3 seconds and keep them watching until the end.
          </p>
          {/* Quick checklist */}
          <div className="mt-6 pt-6 border-t border-slate-200/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Quick checklist</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {checklistItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100/80 px-3 py-2 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <section
                key={step.title}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 sm:p-8 hover:shadow-md hover:border-slate-200/90 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{step.title}</h2>
                    <p className="text-slate-600 mt-1 text-sm leading-relaxed">{step.intro}</p>
                  </div>
                </div>
                <ul className="space-y-2 pl-0 sm:pl-8">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      {typeof item === "string" ? (
                        <span className="text-sm leading-relaxed">{item}</span>
                      ) : (
                        <span className="text-sm leading-relaxed">
                          <strong className="text-slate-800">{item.label}:</strong>{" "}
                          {"example" in item ? (
                            <span className="text-slate-600 italic">{item.example}</span>
                          ) : (
                            item.detail
                          )}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {step.tip && (
                  <div className="mt-4 flex gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <Quote className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-900/90">
                      <strong className="text-amber-800">Pro tip:</strong> {step.tip}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Example hook */}
        <section className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 sm:p-8 mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Example hook (copy and adapt)</h3>
          <blockquote className="text-slate-700 text-sm sm:text-base leading-relaxed pl-4 border-l-4 border-blue-200 bg-slate-50/80 py-3 pr-4 rounded-r-lg italic">
            &ldquo;What if you could write a full YouTube script in under 5 minutes — with hooks, chapters, and SEO built in? Here’s exactly how I do it.&rdquo;
          </blockquote>
        </section>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 sm:p-8 shadow-lg shadow-blue-500/20 border border-blue-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Try the AI script generator</h3>
              <p className="text-blue-100 text-sm sm:text-base">
                Generate your first professional YouTube script in minutes. 50 free tokens, no credit card required.
              </p>
            </div>
            <HomeCta className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 flex-shrink-0">
              Generate free script
            </HomeCta>
          </div>
        </div>
      </div>
    </main>
  );
}
