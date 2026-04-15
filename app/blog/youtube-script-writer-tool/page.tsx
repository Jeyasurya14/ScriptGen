import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";
import { ChevronLeft, CheckCircle2, Lightbulb, Pencil, ArrowRight } from "lucide-react";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "YouTube Script Writer Tool — Best Tools Compared (2026) | ScriptGen Blog",
  description:
    "What is a YouTube script writer tool? How to choose and use the best script writing tool for YouTube. Features to look for, free vs paid, and step-by-step tutorial.",
  alternates: { canonical: `${siteUrl}/blog/youtube-script-writer-tool` },
};

const mustHaveFeatures = [
  { title: "YouTube-specific structure", desc: "Hook, Intro, Main Content, Outro, and Production Notes — not just a generic text block" },
  { title: "SEO pack generation", desc: "Titles with CTR scores, descriptions, tags, and thumbnail ideas included automatically" },
  { title: "Chapter timestamp support", desc: "Auto-generated YouTube chapter markers for better searchability and user experience" },
  { title: "B-Roll suggestions", desc: "Scene-by-scene visual cues with stock video search terms for every section" },
  { title: "Shorts extraction", desc: "Identify and extract viral moments for YouTube Shorts, Instagram Reels, TikTok" },
  { title: "Multi-language output", desc: "Support for English, Hindi, Tamil, and regional language mixing (like Thanglish)" },
  { title: "Export options", desc: "Download as PDF, Word, or plain text — not locked to copy-paste only" },
];

const faqs = [
  {
    q: "What is a YouTube script writer tool?",
    a: "A YouTube script writer tool is software that helps content creators write structured video scripts optimized for YouTube. The best tools use AI to automatically generate hooks, main content, outros, chapter timestamps, SEO titles, descriptions, and B-Roll suggestions — saving creators 2–4 hours per video.",
  },
  {
    q: "Are YouTube script writer tools worth it?",
    a: "Yes — for consistent YouTube creators, a script writing tool pays for itself in time saved. Writing a ~10-minute YouTube script manually takes 2–4 hours. An AI script writer tool like ScriptGen reduces this to 15–30 minutes, letting you create more content without hiring writers.",
  },
  {
    q: "What should I look for in a YouTube script writer tool?",
    a: "Look for: YouTube-specific structure (not just generic AI writing), built-in SEO optimization, chapter timestamps, B-Roll suggestions, Shorts extraction, multi-language support, and affordable pricing. Avoid tools that require extremely detailed prompts to get usable output.",
  },
  {
    q: "Is there a free YouTube script writer tool?",
    a: "Yes. ScriptGen offers 30 free tokens on signup — enough for 3–5 complete YouTube scripts — with no credit card required. The free tier includes all features: SEO pack, B-Roll, chapters, and Shorts extraction.",
  },
];

export default function YouTubeScriptWriterTool() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "YouTube Script Writer Tool — Best Tools Compared (2026)",
      description: "Guide to choosing and using the best YouTube script writer tool in 2026. Features comparison, free vs paid, and step-by-step tutorial.",
      datePublished: "2026-03-15",
      dateModified: new Date().toISOString().split("T")[0],
      author: { "@type": "Organization", name: "ScriptGen", url: siteUrl },
      publisher: { "@type": "Organization", name: "ScriptGen", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: "YouTube Script Writer Tool", item: `${siteUrl}/blog/youtube-script-writer-tool` },
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
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-full mb-4">
            Tools Guide
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            YouTube Script Writer Tool — How to Choose & Use the Best One (2026)
          </h1>
          <p className="text-slate-500 text-sm mb-4">Published Mar 2026 · 7 min read</p>
          <p className="text-lg text-slate-300 leading-relaxed">
            Not all YouTube script writer tools are equal. Here's what the best ones include, what to avoid, and how to use one to consistently publish better videos in less time.
          </p>
        </header>

        {/* What is section */}
        <section className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">What Is a YouTube Script Writer Tool?</h2>
          <p className="text-slate-400 leading-relaxed mb-3 text-sm">
            A <strong className="text-white">YouTube script writer tool</strong> is software designed specifically to help creators write video scripts optimized for YouTube performance. Unlike general writing tools, a YouTube-specific script writer understands the specific structure that drives watch time: hooks that retain viewers in the first 5 seconds, segmented main content with pattern breaks, high-conversion CTAs, and production notes for your editor.
          </p>
          <p className="text-slate-400 leading-relaxed text-sm">
            Modern AI-powered script writer tools go further — automatically generating your YouTube SEO pack (titles, descriptions, tags), chapter timestamps, B-Roll suggestions, and Shorts clips alongside your script, all from a single workflow.
          </p>
        </section>

        {/* Must-have features */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-5">7 Must-Have Features in a YouTube Script Writer Tool</h2>
          <div className="space-y-3">
            {mustHaveFeatures.map((feature, i) => (
              <div key={feature.title} className="flex items-start gap-4 bg-[#111118]/80 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all">
                <span className="flex-shrink-0 h-8 w-8 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Lightbulb className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-violet-200/90">
              <strong className="text-violet-400">Good news:</strong> ScriptGen includes all 7 of these features — and it's the only YouTube script writer tool with a native Thanglish engine for Tamil creators.
            </p>
          </div>
        </section>

        {/* Free vs paid */}
        <section className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Free vs. Paid YouTube Script Writer Tools</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Feature</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">ScriptGen (Free tier)</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Generic free AI tools</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["YouTube-specific structure", "✅ Yes", "❌ No"],
                  ["SEO pack included", "✅ Yes", "❌ No"],
                  ["B-Roll suggestions", "✅ Yes", "❌ No"],
                  ["Chapter timestamps", "✅ Yes", "❌ No"],
                  ["Shorts extraction", "✅ Yes", "❌ No"],
                  ["Thanglish/Tamil support", "✅ Yes", "❌ No"],
                  ["Credit card required", "❌ No", "Often yes"],
                ].map(([feature, sg, generic]) => (
                  <tr key={feature as string} className="border-b border-white/5">
                    <td className="py-3 px-4 text-slate-400">{feature}</td>
                    <td className="py-3 px-4 text-emerald-400">{sg}</td>
                    <td className="py-3 px-4 text-slate-500">{generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to use */}
        <section className="rounded-2xl bg-[#111118]/80 backdrop-blur-sm border border-white/10 p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-5">How to Use a YouTube Script Writer Tool (ScriptGen)</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Sign in with Google", desc: "Create your free ScriptGen account. No credit card needed. You'll get 30 free tokens instantly." },
              { step: "2", title: "Enter your video details", desc: "Topic, duration, tone (educational/entertaining), and language (English, Tamil, Thanglish, Hindi)." },
              { step: "3", title: "Generate Stage 1 — Hook & Intro", desc: "AI creates a retention-optimized hook and intro. Review and continue to next stage." },
              { step: "4", title: "Generate Stages 2–4", desc: "Main Content, Demo & Outro, Production Notes generated sequentially. Each builds on the previous." },
              { step: "5", title: "Download with full SEO pack", desc: "Export your script with AI-crafted titles, descriptions, tags, chapters, B-Roll, and Shorts clips." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4">
                <span className="flex-shrink-0 h-8 w-8 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm flex items-center justify-center">
                  {step}
                </span>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-slate-400 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-5">YouTube Script Writer Tool — FAQs</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-[#111118]/80 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-white marker:hidden list-none">
                  <span>{q}</span>
                  <Pencil className="h-4 w-4 shrink-0 text-slate-400" />
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-slate-400">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-b from-[#111118] to-[#0a0a0f] border border-white/10 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Try the best YouTube script writer tool free</h3>
              <p className="text-slate-400 text-sm">30 tokens. No card. All features unlocked. Full SEO pack included.</p>
            </div>
            <HomeCta className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-500/25 transition-all flex-shrink-0 text-sm">
              Get started free <ArrowRight className="w-4 h-4" />
            </HomeCta>
          </div>
        </div>

        {/* Related */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Related Articles</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/blog/best-ai-script-generators-2026" className="group block p-4 bg-[#111118]/80 border border-white/10 rounded-xl hover:border-white/20 transition-all">
              <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Best AI Script Generators in 2026 (Ranked)</p>
            </Link>
            <Link href="/blog/how-to-write-youtube-scripts" className="group block p-4 bg-[#111118]/80 border border-white/10 rounded-xl hover:border-white/20 transition-all">
              <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">How to Write YouTube Scripts That Keep Viewers Watching</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
