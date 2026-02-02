import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

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

export default function FreeScriptGenerator() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-medium uppercase tracking-wider text-blue-600 mb-3">
            100% Free Script Generator
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Free AI Script Generator
            <span className="block text-blue-600 mt-2">No Credit Card Required</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Generate professional YouTube scripts, video content, and ad scripts with AI. Start with 50 free tokens – create up to 5 complete scripts with SEO, chapters, and B-roll suggestions at zero cost.
          </p>
          <HomeCta className="inline-flex px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition">
            Start generating for free
          </HomeCta>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-4">What is a Free Script Generator?</h2>
          <p className="text-slate-600 leading-relaxed">
            A free script generator is an AI-powered tool that helps content creators, marketers, and video producers create professional scripts without paying upfront. ScriptGen offers 50 free tokens when you sign up, allowing you to generate complete YouTube scripts with SEO optimization, chapter timestamps, B-roll suggestions, and shorts extraction – all at no cost.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">Why Use Our Free AI Script Generator?</h2>
          <ul className="space-y-3 text-slate-600">
            <li><strong>Truly free to start:</strong> 50 tokens on signup, no credit card required</li>
            <li><strong>Professional quality:</strong> AI-generated scripts with proper structure, hooks, and CTAs</li>
            <li><strong>Complete SEO package:</strong> Titles, descriptions, tags, thumbnails, and pinned comments</li>
            <li><strong>Multi-language:</strong> Tamil, Hindi, English, Thunglish with instant translation</li>
            <li><strong>Export options:</strong> Download as PDF, Word, or plain text</li>
            <li><strong>B-roll & shorts:</strong> Automated suggestions for visuals and viral clips</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">How the Free Script Generator Works</h2>
          <ol className="space-y-3 text-slate-600">
            <li><strong>Sign in with Google</strong> – Quick, secure, no credit card needed</li>
            <li><strong>Enter video details</strong> – Title, duration, tone, language preferences</li>
            <li><strong>Generate</strong> – AI creates your complete script in under 30 seconds</li>
            <li><strong>Refine & export</strong> – Edit, translate, or download in your preferred format</li>
          </ol>

          <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">Free vs. Paid Script Generators</h2>
          <p className="text-slate-600 leading-relaxed">
            Many script generators advertise as "free" but require a credit card or limit features. ScriptGen gives you 50 genuine free tokens – enough for 5 complete, professional-grade scripts with all features unlocked. When you need more, token packages start at just ₹99 for 100 tokens (10 full scripts).
          </p>

          <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl border border-blue-100">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Ready to create your first script?</h3>
            <p className="text-slate-600 mb-4">Sign in with Google and get 50 free tokens instantly.</p>
            <HomeCta className="inline-flex px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              Get 50 free tokens
            </HomeCta>
          </div>
        </div>
      </div>
    </main>
  );
}
