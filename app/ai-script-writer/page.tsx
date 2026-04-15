import { Metadata } from "next";
import HomeCta from "@/components/HomeCta";
import { Sparkles, Clock, Search, Layers, Film, Languages, CheckCircle2 } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "AI Script Writer – Automated YouTube Script Writing | ScriptGen",
  description:
    "AI script writer for YouTube videos. Automated script writing with SEO, chapters, B-roll. English, Tamil, Thanglish, Hindi. Free to start.",
  alternates: { canonical: `${siteUrl}/ai-script-writer` },
  openGraph: {
    title: "AI Script Writer – Automated Script Writing | ScriptGen",
    description: "AI-powered script writing for YouTube. Generate complete scripts with SEO, chapters, and B-roll automatically.",
    url: `${siteUrl}/ai-script-writer`,
  },
};

const features = [
  { icon: Layers, title: "Automated script structure", desc: "Hook, intro, main content, demo, outro with proper pacing" },
  { icon: Search, title: "SEO-optimized content", desc: "Titles, descriptions, tags generated for maximum discoverability" },
  { icon: Clock, title: "Chapter timestamps", desc: "Automatic YouTube chapter markers with descriptions" },
  { icon: Film, title: "B-roll recommendations", desc: "Scene-by-scene visual suggestions with stock search terms" },
  { icon: Sparkles, title: "Shorts extraction", desc: "AI identifies viral-worthy clips from your long-form script" },
  { icon: Languages, title: "Multi-language", desc: "Write in English, Tamil, Thanglish, Hindi or translate instantly" },
];

const comparisonData = [
  { aspect: "Time", ai: "~4 minutes", manual: "2-4 hours", aiHighlight: true },
  { aspect: "SEO optimization", ai: "Automatic", manual: "Manual research needed", aiHighlight: true },
  { aspect: "Consistency", ai: "100% consistent tone", manual: "Varies by writer", aiHighlight: true },
  { aspect: "Cost", ai: "Free to start (50 tokens)", manual: "Hourly rate or salary", aiHighlight: true },
];

const useCases = [
  "YouTube videos (tutorials, reviews, vlogs, explainers)",
  "Video ads and promotional content",
  "Product demos and how-to guides",
  "Social media shorts (Instagram Reels, TikTok, YouTube Shorts)",
  "Educational content and online courses",
  "Podcast episode outlines and show notes",
];

export default function AIScriptWriter() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[500px] bg-radial-glow pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI Script Writer
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            AI-Powered Script Writing
            <span className="block brand-gradient-text mt-2">for YouTube & Video Content</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Let AI write your scripts. ScriptGen's AI script writer creates professional YouTube scripts with automated SEO optimization, chapter timestamps, B-roll suggestions, and viral shorts extraction.
          </p>
          <HomeCta className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all">
            Try AI script writer free
          </HomeCta>
        </div>

        {/* What is section */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">What is an AI Script Writer?</h2>
          <p className="text-slate-400 leading-relaxed">
            An AI script writer uses artificial intelligence to automatically generate video scripts, screenplays, and content outlines. ScriptGen's AI script writer analyzes your topic, duration, and tone preferences to create structured, engaging scripts optimized for YouTube performance and viewer retention.
          </p>
        </section>

        {/* Features */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Features of ScriptGen AI Script Writer</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-[#111118]/80 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-10 w-10 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
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

        {/* Comparison table */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">AI Script Writer vs. Manual Script Writing</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Aspect</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">AI Script Writer</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Manual Writing</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr key={row.aspect} className="border-b border-white/5">
                    <td className="py-3 px-4 text-slate-400">{row.aspect}</td>
                    <td className="py-3 px-4 text-emerald-400">{row.ai}</td>
                    <td className="py-3 px-4 text-slate-500">{row.manual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Use cases */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Best Use Cases for AI Script Writing</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div key={useCase} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0" />
                <span>{useCase}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-b from-[#111118] to-[#0a0a0f] border border-white/10 p-8 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[100px]" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-3">Start writing with AI today</h3>
            <p className="text-slate-400 mb-6">50 free tokens. No credit card. Professional scripts in minutes.</p>
            <HomeCta className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
              Get started free
            </HomeCta>
          </div>
        </div>
      </div>
    </main>
  );
}
