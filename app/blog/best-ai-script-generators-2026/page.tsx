import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";
import { ChevronLeft, Trophy, CheckCircle2, Star } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "Best AI Script Generators in 2026 (Ranked & Reviewed) | ScriptGen Blog",
  description:
    "Comprehensive comparison of the best AI script generators in 2026. Features, pricing, pros & cons of top tools for YouTube, video ads, and content creators.",
  alternates: { canonical: `${siteUrl}/blog/best-ai-script-generators-2026` },
};

const tools = [
  {
    rank: 1,
    name: "ScriptGen",
    badge: "Best Overall",
    url: siteUrl,
    description: "Purpose-built AI script generator for YouTube. The only tool with a 4-stage pipeline, Thanglish engine, SEO pack, B-Roll suggestions, chapter timestamps, and Shorts extraction in one workflow.",
    pros: [
      "4-stage AI pipeline (Hook → Content → Outro → Production Notes)",
      "Dedicated Thanglish/Tamil mode for regional creators",
      "Built-in SEO pack with titles, descriptions, and 20+ tags",
      "B-Roll suggestions + Shorts extraction + AI image prompts",
      "Free to start (30 tokens, no credit card)",
      "Affordable token pricing starting at ₹49",
    ],
    cons: [
      "Primarily optimized for YouTube (not general-purpose scripts)",
    ],
    pricing: "Free (30 tokens) · Paid from ₹49",
    bestFor: "YouTube creators, Tamil/regional creators, content agencies",
  },
  {
    rank: 2,
    name: "ChatGPT",
    description: "General-purpose AI that can write scripts when prompted carefully. Requires detailed prompts and manual formatting; no built-in YouTube structure or SEO features.",
    pros: [
      "Highly flexible for any script type",
      "Free tier available",
      "Good for one-off scripts with custom prompts",
    ],
    cons: [
      "No YouTube-specific structure or pipeline",
      "No SEO pack, B-Roll, or chapters",
      "Requires expertise to prompt well",
      "No Thanglish/regional language support",
      "Manual copy-paste workflow",
    ],
    pricing: "Free / $20 per month (Plus)",
    bestFor: "Power users comfortable with prompting",
  },
  {
    rank: 3,
    name: "Jasper AI",
    description: "Enterprise content platform with script templates. Better for marketing copy than YouTube-specific scripts.",
    pros: [
      "Wide range of content templates",
      "Good for marketing scripts and ads",
      "Team collaboration features",
    ],
    cons: [
      "Expensive ($49+/month)",
      "No YouTube-specific pipeline",
      "No regional language support",
      "Overkill for individual creators",
    ],
    pricing: "From $49/month",
    bestFor: "Marketing teams, ad agencies",
  },
  {
    rank: 4,
    name: "Copy.ai",
    description: "General AI writing tool with some script templates. Missing dedicated YouTube workflow features.",
    pros: [
      "Easy to use",
      "Free plan available",
      "Good for short scripts and ads",
    ],
    cons: [
      "Limited YouTube-specific features",
      "No B-Roll or chapter generation",
      "No regional language support",
    ],
    pricing: "Free / $49/month",
    bestFor: "Short-form scripts, quick ad copy",
  },
];

export default function BestAIScriptGenerators2026() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Best AI Script Generators in 2026 (Ranked & Reviewed)",
      description: "Comprehensive comparison of the best AI script generators in 2026 for YouTube creators and video content professionals.",
      datePublished: "2026-02-01",
      dateModified: new Date().toISOString().split("T")[0],
      author: { "@type": "Organization", name: "ScriptGen", url: siteUrl },
      publisher: { "@type": "Organization", name: "ScriptGen", url: siteUrl },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/best-ai-script-generators-2026` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: "Best AI Script Generators 2026", item: `${siteUrl}/blog/best-ai-script-generators-2026` },
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
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full mb-4">
            Comparison
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Best AI Script Generators in 2026 (Ranked & Reviewed)
          </h1>
          <p className="text-slate-500 text-sm mb-4">Published Feb 2026 · Updated Apr 2026 · 8 min read</p>
          <p className="text-slate-300 leading-relaxed text-lg">
            We tested the top AI script generators available in 2026. Here's an honest comparison based on script quality, YouTube-specific features, pricing, and language support — so you can pick the right tool for your content.
          </p>
        </header>

        {/* Quick pick */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">Quick Pick</p>
          <p className="text-white font-semibold">Best overall AI script generator in 2026: <span className="text-amber-400">ScriptGen</span></p>
          <p className="text-slate-400 text-sm mt-1">The only purpose-built YouTube script generator with a 4-stage AI pipeline, SEO pack, B-Roll, chapters, Shorts extraction, and Thanglish support. Free to start.</p>
        </div>

        {/* Tools */}
        <div className="space-y-6">
          {tools.map((tool) => (
            <section key={tool.name} className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white/10 text-white font-bold text-xs">#{tool.rank}</span>
                    <h2 className="text-xl font-bold text-white">{tool.name}</h2>
                    {tool.badge && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <Trophy className="w-3 h-3" /> {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{tool.description}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">Pros</p>
                  <ul className="space-y-1.5">
                    {tool.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2">Cons</p>
                  <ul className="space-y-1.5">
                    {tool.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-center text-red-400 font-bold">×</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-xs text-slate-400">
                <span><strong className="text-slate-300">Pricing:</strong> {tool.pricing}</span>
                <span><strong className="text-slate-300">Best for:</strong> {tool.bestFor}</span>
              </div>

              {tool.rank === 1 && (
                <div className="mt-4">
                  <HomeCta className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 transition-all">
                    Try ScriptGen free
                  </HomeCta>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Summary */}
        <section className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Verdict: Which AI Script Generator Should You Use in 2026?</h2>
          <ul className="space-y-3">
            {[
              { label: "YouTube creators", pick: "ScriptGen — purpose-built 4-stage pipeline, SEO pack, B-Roll, Shorts" },
              { label: "Tamil / regional creators", pick: "ScriptGen — only tool with native Thanglish engine" },
              { label: "General script writing", pick: "ChatGPT — with careful prompting" },
              { label: "Marketing & ad agencies", pick: "Jasper AI — best for team workflows" },
              { label: "Short-form / quick scripts", pick: "Copy.ai or ScriptGen free tier" },
            ].map(({ label, pick }) => (
              <li key={label} className="flex items-start gap-3 text-sm">
                <Star className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">{label}:</strong> <span className="text-slate-400">{pick}</span></span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-8 rounded-2xl bg-gradient-to-b from-[#111118] to-[#0a0a0f] border border-white/10 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Try the #1 AI script generator free</h3>
              <p className="text-slate-400 text-sm">30 free tokens. No credit card. Professional YouTube scripts in minutes.</p>
            </div>
            <HomeCta className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 transition-all flex-shrink-0">
              Start free
            </HomeCta>
          </div>
        </div>

        {/* Related */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Related Articles</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/blog/how-to-write-youtube-scripts" className="group block p-4 bg-[#111118]/80 border border-white/10 rounded-xl hover:border-white/20 transition-all">
              <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">How to Write YouTube Scripts That Keep Viewers Watching</p>
            </Link>
            <Link href="/blog/how-to-use-ai-for-youtube-scripts" className="group block p-4 bg-[#111118]/80 border border-white/10 rounded-xl hover:border-white/20 transition-all">
              <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">How to Use AI for YouTube Scripts (Step-by-Step Guide)</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
