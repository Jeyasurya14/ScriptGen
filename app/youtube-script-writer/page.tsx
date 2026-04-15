import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";
import { Sparkles, Clock, Search, Layers, Film, Languages, CheckCircle2, ArrowRight, ChevronDown } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "YouTube Script Writer — AI Script Writing Tool | ScriptGen",
  description:
    "The best YouTube script writer powered by AI. Write professional YouTube scripts 10x faster with ScriptGen. SEO titles, B-Roll, chapter timestamps, Shorts extraction. Free to start.",
  alternates: { canonical: `${siteUrl}/youtube-script-writer` },
  openGraph: {
    title: "YouTube Script Writer — AI Powered | ScriptGen",
    description: "Write YouTube scripts 10x faster with AI. Hooks, SEO, B-Roll, chapters & Shorts — automatically generated. Free to start.",
    url: `${siteUrl}/youtube-script-writer`,
  },
};

const features = [
  { icon: Layers, title: "4-Stage Script Structure", desc: "Hook, intro, main content, demo, outro — generated sequentially for a coherent long-form script" },
  { icon: Search, title: "YouTube SEO Pack", desc: "AI-crafted titles with CTR scores, descriptions, 20+ tags, and thumbnail ideas" },
  { icon: Clock, title: "Chapter Timestamps", desc: "Automatic YouTube chapter markers with descriptions for every major section" },
  { icon: Film, title: "B-Roll Suggestions", desc: "Scene-by-scene visual suggestions with stock video search terms" },
  { icon: Sparkles, title: "Shorts Extraction", desc: "AI identifies viral-worthy clips from your long-form script for Reels and Shorts" },
  { icon: Languages, title: "Multi-Language Support", desc: "Write in English, Tamil, Thanglish, or Hindi — with adjustable Tamil/English ratio" },
];

const comparison = [
  { aspect: "Script generation time", scriptgen: "3–5 minutes", manual: "2–4 hours" },
  { aspect: "SEO optimization", scriptgen: "Automatic with every script", manual: "Requires separate research" },
  { aspect: "B-Roll suggestions", scriptgen: "Included automatically", manual: "Must be planned separately" },
  { aspect: "Chapter timestamps", scriptgen: "Auto-generated", manual: "Manually added" },
  { aspect: "Shorts clips", scriptgen: "AI-extracted from script", manual: "Separate planning required" },
  { aspect: "Cost", scriptgen: "Free to start (30 tokens)", manual: "Freelancer: ₹500–₹5000/script" },
];

const faqs = [
  {
    q: "What is a YouTube script writer?",
    a: "A YouTube script writer is a tool or person that writes structured scripts for YouTube videos. An AI YouTube script writer like ScriptGen automates this process — generating professional hooks, main content, outros, and production notes in minutes, not hours.",
  },
  {
    q: "How does ScriptGen's YouTube script writer work?",
    a: "ScriptGen uses a 4-stage AI pipeline. You enter your video topic, duration, tone, and language. The AI then generates: Stage 1 (Hook & Intro), Stage 2 (Main Content), Stage 3 (Demo & Outro), Stage 4 (Production Notes + B-Roll + SEO). Each stage builds on the previous for a coherent, professional script.",
  },
  {
    q: "Is the YouTube script writer really free?",
    a: "Yes! Sign up and receive 30 free tokens — no credit card required. Each AI stage uses approximately 2–3 tokens, so you can generate 3–5 complete scripts for free before needing to top up.",
  },
  {
    q: "Can it write scripts in Tamil or Thanglish?",
    a: "Yes. ScriptGen is the only YouTube script writer with a native Thanglish engine. You can set a Tamil/English ratio (e.g. 70% Tamil, 30% English) to match your channel's voice exactly.",
  },
  {
    q: "What types of YouTube scripts can ScriptGen write?",
    a: "ScriptGen handles tutorials, tech reviews, vlogs, explainer videos, product reviews, educational content, coding tutorials, finance content, lifestyle videos, and more. Just enter your topic and it adapts.",
  },
];

export default function YouTubeScriptWriter() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "ScriptGen YouTube Script Writer",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${siteUrl}/youtube-script-writer`,
      description: "AI-powered YouTube script writer that generates professional video scripts with SEO, B-Roll, chapters, and Shorts extraction.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free to start with 30 tokens",
      },
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
        { "@type": "ListItem", position: 2, name: "YouTube Script Writer", item: `${siteUrl}/youtube-script-writer` },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[500px] bg-radial-glow pointer-events-none" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-10" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-300">YouTube Script Writer</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
            <Film className="w-4 h-4" />
            YouTube Script Writer
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            AI YouTube Script Writer
            <span className="block brand-gradient-text mt-2">Write Better Scripts, 10× Faster</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            ScriptGen is an AI YouTube script writer that generates complete, professional video scripts in minutes. Get SEO-optimized titles, B-Roll suggestions, chapter timestamps, and Shorts clips — all from one tool.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <HomeCta className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all">
              Write your first script free
              <ArrowRight className="w-4 h-4" />
            </HomeCta>
            <Link href="#how-it-works" className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 font-medium hover:border-white/20 hover:text-white transition-all text-sm">
              See how it works
            </Link>
          </div>
          <p className="mt-3 text-xs text-slate-500">30 free tokens — no credit card required</p>
        </div>

        {/* What is section */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">What is an AI YouTube Script Writer?</h2>
          <p className="text-slate-400 leading-relaxed mb-3">
            A YouTube script writer is a tool that helps content creators structure and write their video scripts. An <strong className="text-white">AI YouTube script writer</strong> automates this process using artificial intelligence — analyzing your topic, duration, and tone to generate a complete, production-ready script in minutes.
          </p>
          <p className="text-slate-400 leading-relaxed">
            ScriptGen's AI YouTube script writer follows a proven 4-stage pipeline: Hook & Intro → Main Content → Demo & Outro → Production Notes. Every script includes an SEO pack, B-Roll suggestions, chapter timestamps, and Shorts extraction — everything you need to film and publish a high-performing YouTube video.
          </p>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How the YouTube Script Writer Works</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Enter your video details", desc: "Type your video topic, target duration, tone (educational, entertaining, etc.) and select your language: English, Tamil, Thanglish, or Hindi." },
              { step: "2", title: "AI generates Stage 1: Hook & Intro", desc: "ScriptGen writes a retention-optimized hook that grabs attention in the first 3–5 seconds, plus a compelling intro that promises viewer value." },
              { step: "3", title: "AI generates Stages 2–4", desc: "Main Content delivers your topic in depth. Demo & Outro includes a practical example and high-conversion CTA. Production Notes gives B-Roll cues, music timing, and edit markers." },
              { step: "4", title: "Download with SEO pack", desc: "Export your script with AI-crafted YouTube titles, descriptions, tags, thumbnail ideas, pinned comments, and chapter timestamps — ready to upload." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-5">
                <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-white/10 text-white font-bold flex items-center justify-center text-sm">
                  {step}
                </span>
                <div>
                  <h3 className="text-white font-semibold">{title}</h3>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">YouTube Script Writer Features</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-[#111118]/80 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-white font-semibold">{feature.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">AI YouTube Script Writer vs. Writing Manually</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Aspect</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">ScriptGen AI</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Manual Writing</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.aspect} className="border-b border-white/5">
                    <td className="py-3 px-4 text-slate-400">{row.aspect}</td>
                    <td className="py-3 px-4 text-emerald-400">{row.scriptgen}</td>
                    <td className="py-3 px-4 text-slate-500">{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Languages */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Write YouTube Scripts in Any Language</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            ScriptGen supports <strong className="text-white">English, Tamil, Thanglish, and Hindi</strong>. The Thanglish engine is unique — you can control the Tamil/English mix ratio from 10% to 90%, letting you write exactly in your channel's voice. It's the only YouTube script writer built natively for South Indian creators.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {["English", "Tamil", "Thanglish (Tamil + English)", "Hindi / Hinglish"].map((lang) => (
              <span key={lang} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {lang}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">YouTube Script Writer — FAQs</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group bg-[#111118]/80 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-white marker:hidden list-none">
                  <span>{q}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed text-slate-400">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related tools */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Related Tools</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { href: "/ai-script-writer", label: "AI Script Writer", desc: "Automated AI script writing" },
              { href: "/free-script-generator", label: "Free Script Generator", desc: "Generate scripts at no cost" },
              { href: "/script-writer-online", label: "Script Writer Online", desc: "Write scripts in your browser" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="flex flex-col rounded-xl border border-white/10 bg-[#111118]/60 px-4 py-4 text-sm hover:border-white/20 transition-all">
                <span className="font-medium text-white">{link.label}</span>
                <span className="mt-1 text-xs text-slate-400">{link.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-b from-[#111118] to-[#0a0a0f] border border-white/10 p-8 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/20 rounded-full blur-[100px]" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-3">Start writing YouTube scripts with AI</h2>
            <p className="text-slate-400 mb-6">30 free tokens. No credit card. Professional YouTube scripts in minutes.</p>
            <HomeCta className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all">
              Get started free <ArrowRight className="w-4 h-4" />
            </HomeCta>
          </div>
        </div>
      </div>
    </main>
  );
}
