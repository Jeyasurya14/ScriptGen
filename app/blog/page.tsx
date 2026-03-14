import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "Blog – Script Writing Tips & YouTube SEO | ScriptGen",
  description:
    "Learn script writing, YouTube SEO, video content strategy. Free guides on AI script generation, multilingual content, and video optimization.",
  alternates: { canonical: `${siteUrl}/blog` },
};

const posts = [
  {
    slug: "how-to-write-youtube-scripts",
    title: "How to Write YouTube Scripts That Keep Viewers Watching",
    excerpt: "Master the art of YouTube script writing with proven frameworks for hooks, pacing, and CTAs.",
    date: "Feb 2026",
    tag: "Writing",
  },
  {
    slug: "ai-script-generator-guide",
    title: "Complete Guide to AI Script Generators in 2026",
    excerpt: "Everything you need to know about using AI to generate professional video scripts.",
    date: "Feb 2026",
    tag: "AI Tools",
  },
  {
    slug: "youtube-seo-checklist",
    title: "YouTube SEO Checklist: Rank Your Videos Higher",
    excerpt: "15-point checklist to optimize titles, descriptions, tags, and thumbnails for maximum reach.",
    date: "Feb 2026",
    tag: "SEO",
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[400px] bg-radial-glow pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20 relative">
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Resources
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Script Writing & <span className="brand-gradient-text">YouTube SEO</span> Blog
          </h1>
          <p className="text-slate-400 text-base max-w-xl">
            Free guides on AI script generation, YouTube optimization, and video content strategy.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block p-6 bg-[#111118]/80 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500">{post.date}</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400">{post.tag}</span>
              </div>
              <h2 className="text-lg font-semibold text-white mt-2 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">{post.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm text-blue-400 mt-4 font-medium group-hover:gap-2 transition-all">
                Read more <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 p-10 bg-gradient-to-b from-[#111118] to-[#0a0a0f] border border-white/10 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to generate your first script?</h3>
            <p className="text-slate-400 mb-6">50 free tokens. No credit card required.</p>
            <Link
                href="/generate"
              className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            >
              Start free
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
