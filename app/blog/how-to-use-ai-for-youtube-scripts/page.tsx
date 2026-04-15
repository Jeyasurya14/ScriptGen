import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";
import { ChevronLeft, CheckCircle2, Lightbulb, Zap, ArrowRight } from "lucide-react";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "How to Use AI for YouTube Scripts — Step-by-Step Guide (2026) | ScriptGen Blog",
  description:
    "Learn how to use AI to write YouTube scripts in 2026. Step-by-step tutorial on using AI script generators to create professional, SEO-optimized video scripts 10x faster.",
  alternates: { canonical: `${siteUrl}/blog/how-to-use-ai-for-youtube-scripts` },
};

const steps = [
  {
    num: "01",
    title: "Choose the right AI script generator",
    body: "Not all AI tools are built for YouTube scripting. Use a purpose-built tool like ScriptGen that understands YouTube structure — hooks, retention, chapters, and SEO — rather than a general AI like ChatGPT that requires you to engineer complex prompts manually.",
    tip: "Look for tools that offer a structured pipeline (Hook → Content → Outro) rather than a single text dump.",
  },
  {
    num: "02",
    title: "Define your video topic and audience",
    body: "Before using AI, be clear on: your video topic (specific is better than broad), your target audience (beginner/intermediate/expert), your video length (5 min, 10 min, 20 min), and your tone (educational, entertaining, conversational). The more specific your input, the better the AI output.",
    tip: "Instead of 'write a script about Python', try 'write a 10-minute Python tutorial for beginners explaining variables and data types, with a hook about why Python is the easiest first language'.",
  },
  {
    num: "03",
    title: "Generate Stage 1: Hook & Intro with AI",
    body: "The hook is the most important part of your YouTube script. Use AI to generate 3–5 different hook options and pick the strongest one. A good AI script generator (like ScriptGen) will automatically create hooks that follow proven patterns: problem statements, bold promises, or pattern interrupts.",
    tip: "Never skip the hook stage. Most YouTube viewers decide within the first 5 seconds whether to keep watching.",
  },
  {
    num: "04",
    title: "Generate and review Main Content",
    body: "The main content stage is where your value is delivered. AI will structure this into clear sections with transitions. After generation, review for: accuracy (add your personal expertise), examples (add real-world cases AI doesn't know), and pacing (add pattern breaks every 60–90 seconds).",
    tip: "Add one personal story or real example per major section — this is what AI can't do for you, and it's what viewers remember.",
  },
  {
    num: "05",
    title: "Generate Outro & CTA",
    body: "The outro should include: a summary of key points, a clear call-to-action (subscribe, watch next, download), and a teaser for your next video. AI can generate these automatically — just tell it what action you want viewers to take.",
    tip: "The best CTAs are specific: 'Subscribe for a video on Python functions next Tuesday' outperforms 'Like and subscribe'.",
  },
  {
    num: "06",
    title: "Use AI to generate your SEO pack",
    body: "After your script is complete, use AI to generate your YouTube SEO package: 3–5 title options with CTR scores, a keyword-rich description (first 3 lines visible before 'Show More'), 20+ searchable tags, thumbnail copy ideas, and a pinned comment. ScriptGen generates all of this automatically in Production Notes.",
    tip: "Put your primary keyword in the title, first sentence of description, and first tag. YouTube indexes these areas most heavily.",
  },
  {
    num: "07",
    title: "Add your personal voice and publish",
    body: "Before filming, do a final pass on the AI-generated script: swap generic examples for real ones you've experienced, add your catchphrases and verbal habits, adjust pacing to match your speaking speed, and remove anything that sounds unnatural when read aloud. The AI writes the structure; your personality makes it yours.",
    tip: "Read the script aloud once before filming. Any sentence you stumble over should be rewritten in simpler language.",
  },
];

export default function HowToUseAIForYouTubeScripts() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Use AI for YouTube Scripts",
      description: "Step-by-step guide to using AI script generators to write professional YouTube video scripts 10x faster.",
      step: steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.body,
      })),
      totalTime: "PT10M",
      tool: [{ "@type": "HowToTool", name: "ScriptGen AI" }],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How to Use AI for YouTube Scripts — Step-by-Step Guide (2026)",
      datePublished: "2026-03-01",
      dateModified: new Date().toISOString().split("T")[0],
      author: { "@type": "Organization", name: "ScriptGen", url: siteUrl },
      publisher: { "@type": "Organization", name: "ScriptGen", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: "How to Use AI for YouTube Scripts", item: `${siteUrl}/blog/how-to-use-ai-for-youtube-scripts` },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[400px] bg-radial-glow pointer-events-none" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white mb-8 transition-colors rounded-md px-2 py-1">
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <header className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full mb-4">
            Tutorial
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            How to Use AI for YouTube Scripts — Step-by-Step Guide (2026)
          </h1>
          <p className="text-slate-500 text-sm mb-4">Published Mar 2026 · 10 min read</p>
          <p className="text-lg text-slate-300 leading-relaxed">
            AI script generators can save you 2–4 hours per video. Here's exactly how to use AI to write professional YouTube scripts — from picking the right tool to adding your personal voice before filming.
          </p>

          {/* Key points */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">What you'll learn</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "How to choose the right AI script tool",
                "How to structure your input for best output",
                "How to generate hooks, content & outros with AI",
                "How to generate a complete YouTube SEO pack",
                "How to add your personal voice to AI output",
                "How to go from script to published video faster",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* Why use AI */}
        <section className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">Why Use AI for YouTube Script Writing?</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            Manual script writing takes 2–4 hours per video. For creators publishing weekly, that's 8–16 hours per month just on scripting. AI script generators reduce this to 15–30 minutes while often producing better structured, more SEO-optimized scripts than a first draft written from scratch.
          </p>
          <div className="grid gap-3 sm:grid-cols-3 mt-4">
            {[
              { label: "Time saved", value: "~3 hours/video" },
              { label: "Scripts per month", value: "4× more output" },
              { label: "SEO optimization", value: "Automatic" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <div className="space-y-5">
          {steps.map((step) => (
            <section key={step.num} className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-3">
                <span className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <h2 className="text-xl font-semibold text-white pt-1.5">{step.title}</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 pl-14">{step.body}</p>
              <div className="ml-14 flex gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-200/90">
                  <strong className="text-amber-400">Pro tip:</strong> {step.tip}
                </p>
              </div>
            </section>
          ))}
        </div>

        {/* Quick start */}
        <section className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Start: Try ScriptGen Free</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-5">
            ScriptGen is purpose-built for YouTube script writers. It handles all 7 steps above automatically — from hook generation to SEO pack — in a single 4-stage workflow. Start with 30 free tokens (no credit card required).
          </p>
          <div className="grid gap-2 sm:grid-cols-2 mb-5">
            {[
              "Sign in with Google (30 seconds)",
              "Enter your video topic and preferences",
              "Click Generate — AI writes your full script",
              "Download with SEO pack ready to upload",
            ].map((item, i) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center">
                  {i + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
          <HomeCta className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 transition-all text-sm">
            Start using AI for YouTube scripts — free <ArrowRight className="w-4 h-4" />
          </HomeCta>
        </section>

        {/* Related */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Related Articles</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/blog/how-to-write-youtube-scripts" className="group block p-4 bg-[#111118]/80 border border-white/10 rounded-xl hover:border-white/20 transition-all">
              <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">How to Write YouTube Scripts That Keep Viewers Watching</p>
            </Link>
            <Link href="/blog/best-ai-script-generators-2026" className="group block p-4 bg-[#111118]/80 border border-white/10 rounded-xl hover:border-white/20 transition-all">
              <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Best AI Script Generators in 2026 (Ranked & Reviewed)</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
