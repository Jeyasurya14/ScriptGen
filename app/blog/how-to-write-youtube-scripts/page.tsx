import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "How to Write YouTube Scripts That Keep Viewers Watching (2026 Guide)",
  description:
    "Learn proven YouTube script writing techniques: hooks, pacing, structure, CTAs. Free template and examples. Use AI to automate your script writing process.",
  alternates: { canonical: `${siteUrl}/blog/how-to-write-youtube-scripts` },
};

export default function HowToWriteYouTubeScripts() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/blog" className="text-sm text-slate-600 hover:text-slate-900 mb-6 inline-block">
          ← Back to blog
        </Link>
        
        <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900">
          <span className="text-xs font-medium uppercase tracking-wider text-blue-600">Guide</span>
          <h1 className="text-3xl font-bold text-slate-900 mt-2 mb-4">How to Write YouTube Scripts That Keep Viewers Watching</h1>
          <p className="text-slate-500 text-sm mb-8">Published Feb 2026 · 7 min read</p>

          <p className="lead text-lg text-slate-700">
            The difference between a video that goes viral and one that gets skipped? A well-structured script. Here's how to write YouTube scripts that hook viewers in the first 3 seconds and keep them watching until the end.
          </p>

          <h2>1. Start with a Hook (First 3-5 Seconds)</h2>
          <p>Your hook determines if viewers stay or leave. Use one of these proven patterns:</p>
          <ul>
            <li><strong>Problem statement:</strong> "Still struggling with low watch time?"</li>
            <li><strong>Bold promise:</strong> "This technique doubled my subscriber growth in 30 days"</li>
            <li><strong>Pattern interrupt:</strong> "Everything you know about YouTube scripts is wrong"</li>
            <li><strong>Question:</strong> "What if you could automate your entire script writing process?"</li>
          </ul>

          <h2>2. Structure Your Script in 5 Parts</h2>
          <ol>
            <li><strong>Hook (0-5s):</strong> Grab attention immediately</li>
            <li><strong>Intro (5-30s):</strong> Promise value, introduce topic</li>
            <li><strong>Main content (70% of video):</strong> Deliver on your promise with clear segments</li>
            <li><strong>Demo/proof (optional):</strong> Show examples or results</li>
            <li><strong>Outro (last 10%):</strong> CTA, next steps, subscribe reminder</li>
          </ol>

          <h2>3. Write for Retention, Not Length</h2>
          <p>YouTube's algorithm rewards watch time and retention. Tips:</p>
          <ul>
            <li>Use "chapter markers" every 60-90 seconds to reset attention</li>
            <li>Include pattern breaks: "But here's what nobody tells you..."</li>
            <li>Cut filler words – every sentence should add value</li>
            <li>Tease what's coming: "I'll show you the exact template in a minute"</li>
          </ul>

          <h2>4. Optimize for SEO While Writing</h2>
          <p>Build SEO into your script from the start:</p>
          <ul>
            <li><strong>Use target keywords naturally:</strong> Say "AI script generator" or "YouTube SEO" in your script (YouTube indexes captions)</li>
            <li><strong>Write your description in the script:</strong> The first 2-3 sentences of your script become your description</li>
            <li><strong>Plan chapters:</strong> Each major section = a YouTube chapter for better searchability</li>
          </ul>

          <h2>5. Automate with AI (Save 90% of Your Time)</h2>
          <p>Writing scripts manually takes 2-4 hours. ScriptGen's AI script generator creates the same quality in under 5 minutes:</p>
          <ul>
            <li>Automatic hook, intro, main, outro structure</li>
            <li>SEO-optimized titles, descriptions, tags</li>
            <li>Chapter timestamps and B-roll suggestions</li>
            <li>Multi-language support (Tamil, Hindi, English, Thunglish)</li>
          </ul>

          <div className="not-prose mt-12 p-8 bg-blue-50 border border-blue-100 rounded-2xl">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Try the AI script generator</h3>
            <p className="text-slate-600 mb-4">Generate your first professional YouTube script in minutes. 50 free tokens, no credit card required.</p>
            <HomeCta className="inline-flex px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              Generate free script
            </HomeCta>
          </div>
        </article>
      </div>
    </main>
  );
}
