import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";
import {
  ChevronLeft,
  Sparkles,
  Clock,
  MessageSquare,
  FileEdit,
  CheckCircle2,
  Quote,
  Zap,
} from "lucide-react";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "Complete Guide to AI Script Generators in 2026 | ScriptGen",
  description:
    "Everything you need to know about using AI to generate professional video scripts: when to use them, how to get the best results, and what to look for in a tool.",
  alternates: { canonical: `${siteUrl}/blog/ai-script-generator-guide` },
};

const steps = [
  {
    icon: Sparkles,
    title: "1. What AI Script Generators Do",
    intro: "AI script tools create full video scripts from a short brief. They typically deliver:",
    items: [
      "Hook, intro, main content, and outro — structured for retention",
      "SEO-optimized titles, descriptions, and tags",
      "Chapter timestamps and B-roll suggestions",
      "Multi-language output (e.g. Tamil, Hindi, English)",
    ],
    tip: "The best tools follow the same 5-part structure pros use — hook, intro, main, demo, outro.",
  },
  {
    icon: Clock,
    title: "2. When to Use AI vs Writing Manually",
    intro: "AI shines for speed and structure. Use it when:",
    items: [
      "You need a first draft in minutes, not hours",
      "You want consistent structure across many videos",
      "You're testing ideas and need multiple script variants",
      "You're translating or localizing content",
    ],
    tip: "Use AI for the draft; add your own stories, examples, and voice in the edit pass.",
  },
  {
    icon: MessageSquare,
    title: "3. How to Get the Best Results",
    intro: "Better input = better output. When briefing the AI:",
    items: [
      "Be specific about topic, audience, and goal (e.g. explainer, ad, tutorial)",
      "Mention tone (professional, casual, educational) and length (e.g. 5 min)",
      "Include 1–2 target keywords if you care about SEO",
      "Add any must-have points or examples you want in the script",
    ],
    tip: "One clear sentence like \"5-min explainer for beginners on X, casual tone\" often beats a long, vague paragraph.",
  },
  {
    icon: FileEdit,
    title: "4. What to Do After Generation",
    intro: "Treat the AI output as a strong first draft:",
    items: [
      "Read once for flow — cut filler and tighten sentences",
      "Add your own hooks, jokes, or callbacks",
      "Drop in real examples, stats, or screenshots you'll use on screen",
      "Check that chapters and CTAs match how you'll actually edit the video",
    ],
    tip: "Keep the structure; change the words so it sounds like you.",
  },
  {
    icon: Zap,
    title: "5. What to Look For in a Tool",
    intro: "Not all AI script generators are equal. Prefer tools that offer:",
    items: [
      "Structured output (hook, chapters, CTA) — not just a wall of text",
      "Built-in SEO (titles, descriptions, tags) so you don't start from zero",
      "Chapter timestamps and B-roll ideas so you can edit faster",
      "Multi-language or translation if you create in more than one language",
    ],
    tip: "Free tiers or trial tokens let you test quality before committing.",
  },
];

const checklistItems = [
  "Clear brief (topic, audience, length, tone)",
  "Structured script with hook and chapters",
  "SEO fields included (title, description, tags)",
  "One edit pass to add your voice and examples",
  "Chapters and CTAs aligned with your edit",
];

export default function AIScriptGeneratorGuide() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[400px] bg-radial-glow pointer-events-none" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] rounded-md px-2 py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <header className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full mb-4">
            Guide
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Complete Guide to AI Script Generators in 2026
          </h1>
          <p className="text-slate-500 text-sm mb-6">Published Feb 2026 · 6 min read</p>
          <p className="text-lg text-slate-300 leading-relaxed">
            AI script generators can cut writing time from hours to minutes — if you use them right. Here's when to use them, how to get the best results, and what to look for in a tool.
          </p>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Quick checklist</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {checklistItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <section
                key={step.title}
                className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{step.title}</h2>
                    <p className="text-slate-400 mt-1 text-sm leading-relaxed">{step.intro}</p>
                  </div>
                </div>
                <ul className="space-y-2 pl-0 sm:pl-8">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                {step.tip && (
                  <div className="mt-4 flex gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Quote className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-200/90">
                      <strong className="text-amber-400">Pro tip:</strong> {step.tip}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <section className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 mt-8">
          <h3 className="text-lg font-semibold text-white mb-2">Example brief (copy and adapt)</h3>
          <blockquote className="text-slate-300 text-sm sm:text-base leading-relaxed pl-4 border-l-4 border-blue-500/50 bg-white/5 py-3 pr-4 rounded-r-lg">
            &ldquo;5-minute explainer for beginners on how to write YouTube scripts. Casual tone. Include hook, 3 main sections, and a CTA to try ScriptGen. Target keyword: script generator.&rdquo;
          </blockquote>
        </section>

        <div className="mt-10 rounded-2xl bg-gradient-to-b from-[#111118] to-[#0a0a0f] border border-white/10 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Try ScriptGen</h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Get structured scripts with SEO, chapters, and B-roll ideas. 50 free tokens, no credit card required.
              </p>
            </div>
            <HomeCta className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 transition-all flex-shrink-0">
              Generate free script
            </HomeCta>
          </div>
        </div>
      </div>
    </main>
  );
}
