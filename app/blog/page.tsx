import { Metadata } from "next";
import Link from "next/link";

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
  },
  {
    slug: "ai-script-generator-guide",
    title: "Complete Guide to AI Script Generators in 2026",
    excerpt: "Everything you need to know about using AI to generate professional video scripts.",
    date: "Feb 2026",
  },
  {
    slug: "youtube-seo-checklist",
    title: "YouTube SEO Checklist: Rank Your Videos Higher",
    excerpt: "15-point checklist to optimize titles, descriptions, tags, and thumbnails for maximum reach.",
    date: "Feb 2026",
  },
];

export default function Blog() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        <div className="mb-12">
          <span className="inline-block text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
            Resources
          </span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Script Writing & YouTube SEO Blog
          </h1>
          <p className="text-slate-600 text-base">
            Free guides on AI script generation, YouTube optimization, and video content strategy.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
            >
              <span className="text-xs text-slate-500">{post.date}</span>
              <h2 className="text-lg font-semibold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">{post.excerpt}</p>
              <span className="inline-block text-sm text-blue-600 mt-3 font-medium group-hover:underline">
                Read more →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl text-center">
          <h3 className="text-xl font-semibold mb-2">Ready to generate your first script?</h3>
          <p className="text-slate-300 mb-4">50 free tokens. No credit card required.</p>
          <Link
            href="/app"
            className="inline-flex px-5 py-2.5 rounded-lg bg-white text-slate-900 font-medium hover:bg-slate-100 transition"
          >
            Start free
          </Link>
        </div>
      </div>
    </main>
  );
}
