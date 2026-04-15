import { Metadata } from "next";
import HomeCta from "@/components/HomeCta";
import { Gift, CheckCircle2, Sparkles, Globe2, FileDown, Film, LogIn, Pencil, Zap, Download } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "Free Script Generator – No Credit Card Required | ScriptGen",
  description:
    "Free AI script generator for YouTube, videos, ads. 50 free tokens on signup. No credit card required. Generate professional scripts with SEO, chapters, B-roll in minutes.",
  alternates: { canonical: `${siteUrl}/free-script-generator` },
  openGraph: {
    title: "Free Script Generator – AI Powered | ScriptGen",
    description: "Generate professional YouTube scripts for free. 50 free tokens, no credit card required. SEO, chapters, B-roll included.",
    url: `${siteUrl}/free-script-generator`,
  },
};

const benefits = [
  { icon: Gift, title: "Truly free to start", desc: "50 tokens on signup, no credit card required" },
  { icon: Sparkles, title: "Professional quality", desc: "AI-generated scripts with proper structure, hooks, and CTAs" },
  { icon: CheckCircle2, title: "Complete SEO package", desc: "Titles, descriptions, tags, thumbnails, and pinned comments" },
  { icon: Globe2, title: "Multi-language", desc: "English, Tamil, Thanglish, Hindi with instant translation" },
  { icon: FileDown, title: "Export options", desc: "Download as PDF, Word, or plain text" },
  { icon: Film, title: "B-roll & shorts", desc: "Automated suggestions for visuals and viral clips" },
];

const steps = [
  { icon: LogIn, num: "1", title: "Sign in with Google", desc: "Quick, secure, no credit card needed" },
  { icon: Pencil, num: "2", title: "Enter video details", desc: "Title, duration, tone, language preferences" },
  { icon: Zap, num: "3", title: "Generate", desc: "AI creates your complete script in under 30 seconds" },
  { icon: Download, num: "4", title: "Refine & export", desc: "Edit, translate, or download in your preferred format" },
];

export default function FreeScriptGenerator() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[500px] bg-radial-glow pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            100% Free Script Generator
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Free AI Script Generator
            <span className="block brand-gradient-text mt-2">No Credit Card Required</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Generate professional YouTube scripts, video content, and ad scripts with AI. Start with 50 free tokens – create up to 5 complete scripts with SEO, chapters, and B-roll suggestions at zero cost.
          </p>
          <HomeCta className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all">
            Start generating for free
          </HomeCta>
        </div>

        {/* What is section */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">What is a Free Script Generator?</h2>
          <p className="text-slate-400 leading-relaxed">
            A free script generator is an AI-powered tool that helps content creators, marketers, and video producers create professional scripts without paying upfront. ScriptGen offers 50 free tokens when you sign up, allowing you to generate complete YouTube scripts with SEO optimization, chapter timestamps, B-roll suggestions, and shorts extraction – all at no cost.
          </p>
        </section>

        {/* Benefits */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Why Use Our Free AI Script Generator?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-[#111118]/80 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-white font-semibold">{benefit.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{benefit.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How the Free Script Generator Works</h2>
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex items-start gap-4">
                  <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 text-white font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-white font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Free vs Paid */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Free vs. Paid Script Generators</h2>
          <p className="text-slate-400 leading-relaxed">
            Many script generators advertise as "free" but require a credit card or limit features. ScriptGen gives you 50 genuine free tokens – enough for 5 complete, professional-grade scripts with all features unlocked. When you need more, token packages start at just ₹99 for 100 tokens (10 full scripts).
          </p>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-b from-[#111118] to-[#0a0a0f] border border-white/10 p-8 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to create your first script?</h3>
            <p className="text-slate-400 mb-6">Sign in with Google and get 50 free tokens instantly.</p>
            <HomeCta className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
              Get 50 free tokens
            </HomeCta>
          </div>
        </div>
      </div>
    </main>
  );
}
