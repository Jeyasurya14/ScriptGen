import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "AI Script Writer – Automated YouTube Script Writing | ScriptGen",
  description:
    "AI script writer for YouTube videos. Automated script writing with SEO, chapters, B-roll. Tamil, Hindi, English, Thunglish. Free to start.",
  alternates: { canonical: `${siteUrl}/ai-script-writer` },
  openGraph: {
    title: "AI Script Writer – Automated Script Writing | ScriptGen",
    description: "AI-powered script writing for YouTube. Generate complete scripts with SEO, chapters, and B-roll automatically.",
    url: `${siteUrl}/ai-script-writer`,
  },
};

export default function AIScriptWriter() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-medium uppercase tracking-wider text-violet-600 mb-3">
            AI Script Writer
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            AI-Powered Script Writing
            <span className="block text-violet-600 mt-2">for YouTube & Video Content</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Let AI write your scripts. ScriptGen's AI script writer creates professional YouTube scripts with automated SEO optimization, chapter timestamps, B-roll suggestions, and viral shorts extraction.
          </p>
          <HomeCta className="inline-flex px-6 py-3 rounded-lg bg-violet-600 text-white font-semibold shadow-lg shadow-violet-600/25 hover:bg-violet-700 transition">
            Try AI script writer free
          </HomeCta>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-4">What is an AI Script Writer?</h2>
          <p className="text-slate-600 leading-relaxed">
            An AI script writer uses artificial intelligence to automatically generate video scripts, screenplays, and content outlines. ScriptGen's AI script writer analyzes your topic, duration, and tone preferences to create structured, engaging scripts optimized for YouTube performance and viewer retention.
          </p>

          <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">Features of ScriptGen AI Script Writer</h2>
          <ul className="space-y-3 text-slate-600">
            <li><strong>Automated script structure:</strong> Hook, intro, main content, demo, outro with proper pacing</li>
            <li><strong>SEO-optimized content:</strong> Titles, descriptions, tags generated for maximum discoverability</li>
            <li><strong>Chapter timestamps:</strong> Automatic YouTube chapter markers with descriptions</li>
            <li><strong>B-roll recommendations:</strong> Scene-by-scene visual suggestions with stock search terms</li>
            <li><strong>Shorts extraction:</strong> AI identifies viral-worthy clips from your long-form script</li>
            <li><strong>Multi-language:</strong> Write in Tamil, Hindi, English, Thunglish or translate instantly</li>
          </ul>

          <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">AI Script Writer vs. Manual Script Writing</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-200 px-4 py-3 text-left font-semibold">Aspect</th>
                  <th className="border border-slate-200 px-4 py-3 text-left font-semibold">AI Script Writer</th>
                  <th className="border border-slate-200 px-4 py-3 text-left font-semibold">Manual Writing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-200 px-4 py-2">Time</td>
                  <td className="border border-slate-200 px-4 py-2 text-green-700">~4 minutes</td>
                  <td className="border border-slate-200 px-4 py-2 text-slate-600">2-4 hours</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-2">SEO optimization</td>
                  <td className="border border-slate-200 px-4 py-2 text-green-700">Automatic</td>
                  <td className="border border-slate-200 px-4 py-2 text-slate-600">Manual research needed</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-2">Consistency</td>
                  <td className="border border-slate-200 px-4 py-2 text-green-700">100% consistent tone</td>
                  <td className="border border-slate-200 px-4 py-2 text-slate-600">Varies by writer</td>
                </tr>
                <tr>
                  <td className="border border-slate-200 px-4 py-2">Cost</td>
                  <td className="border border-slate-200 px-4 py-2 text-green-700">Free to start (50 tokens)</td>
                  <td className="border border-slate-200 px-4 py-2 text-slate-600">Hourly rate or salary</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mt-10 mb-4">Best Use Cases for AI Script Writing</h2>
          <ul className="space-y-2 text-slate-600">
            <li>YouTube videos (tutorials, reviews, vlogs, explainers)</li>
            <li>Video ads and promotional content</li>
            <li>Product demos and how-to guides</li>
            <li>Social media shorts (Instagram Reels, TikTok, YouTube Shorts)</li>
            <li>Educational content and online courses</li>
            <li>Podcast episode outlines and show notes</li>
          </ul>

          <div className="mt-12 p-6 bg-slate-900 text-white rounded-2xl">
            <h3 className="text-xl font-semibold mb-3">Start writing with AI today</h3>
            <p className="text-slate-300 mb-4">50 free tokens. No credit card. Professional scripts in minutes.</p>
            <HomeCta className="inline-flex px-5 py-2.5 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100 transition">
              Get started free
            </HomeCta>
          </div>
        </div>
      </div>
    </main>
  );
}
