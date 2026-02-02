import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";
import {
  ChevronLeft,
  Type,
  FileText,
  Tag,
  Image,
  Hash,
  ListChecks,
  CheckCircle2,
  Quote,
} from "lucide-react";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "YouTube SEO Checklist: Rank Your Videos Higher (2026) | ScriptGen",
  description:
    "15-point checklist to optimize titles, descriptions, tags, thumbnails, and chapters for maximum reach and discoverability on YouTube.",
  alternates: { canonical: `${siteUrl}/blog/youtube-seo-checklist` },
};

const steps = [
  {
    icon: Type,
    title: "1. Title (Under 60 Characters)",
    intro: "Your title is the first thing viewers see in search and suggested videos. Make it:",
    items: [
      "Under 60 characters so it doesn’t get cut off",
      "Front-loaded with your main keyword (first 3–5 words)",
      "Clear and specific — avoid clickbait that doesn’t deliver",
      "Curiosity-driven when possible: “How to…”, “Why…”, “The one thing…”",
    ],
    tip: "Say your primary keyword in the first half of the title. YouTube and Google both use it for ranking.",
  },
  {
    icon: FileText,
    title: "2. Description (First 2–3 Sentences Matter)",
    intro: "The first 2–3 sentences often show in search results. Use them to:",
    items: [
      "Repeat your main keyword and core message",
      "Summarize what the viewer will learn or get",
      "Add a clear CTA (e.g. subscribe, link in bio)",
      "Use the rest of the description for full summary, links, and extra keywords",
    ],
    tip: "Write the description from your script intro — it keeps messaging consistent and saves time.",
  },
  {
    icon: Tag,
    title: "3. Tags (Relevant, Not Spammy)",
    intro: "Tags help YouTube understand your video. Use:",
    items: [
      "One broad tag (e.g. “YouTube tips”), one exact phrase (e.g. “how to write YouTube scripts”)",
      "5–15 tags total — mix of short and long-tail",
      "Variations of your main keyword and related topics",
      "Channel name if you want to surface in brand search",
    ],
    tip: "Don’t repeat the same keyword in every tag. Use synonyms and related phrases.",
  },
  {
    icon: Image,
    title: "4. Thumbnail (Readable and Consistent)",
    intro: "Thumbnails drive clicks from suggested and search. Aim for:",
    items: [
      "High contrast and readable text (3–5 words max) even at small size",
      "A clear face or focal point — eyes and expressions get more clicks",
      "Consistent style (fonts, colors) so your channel is recognizable",
      "No misleading imagery — match what the video actually delivers",
    ],
    tip: "Test thumbnails: would you click it if you saw it in a grid? If not, simplify.",
  },
  {
    icon: Hash,
    title: "5. Chapters (Every 60–90 Seconds)",
    intro: "Chapters improve retention and SEO. Add them by:",
    items: [
      "Adding timestamps in the description (e.g. 0:00 Intro, 1:30 Main topic)",
      "Keeping segments to 60–90 seconds so viewers can jump and stay",
      "Using clear, keyword-rich chapter titles",
      "Starting with 0:00 so the first chapter always appears",
    ],
    tip: "Chapter titles show in search and on the progress bar — use them like mini headlines.",
  },
  {
    icon: ListChecks,
    title: "6. Captions and Script",
    intro: "YouTube indexes spoken words. Help the algorithm by:",
    items: [
      "Uploading or correcting captions so key phrases are accurate",
      "Saying your target keyword naturally in the first 30 seconds",
      "Repeating the main topic in the middle and near the end",
      "Using your script’s intro as the basis for the description",
    ],
    tip: "If you script your video, your script and description can share the same opening lines.",
  },
];

const checklistItems = [
  "Title under 60 chars, keyword in first half",
  "Description: keyword + summary in first 2–3 sentences",
  "5–15 relevant tags (broad + long-tail)",
  "Thumbnail: readable text, clear focal point",
  "Chapters every 60–90s with keyword-rich titles",
  "Accurate captions; keyword in first 30s",
];

export default function YouTubeSEOChecklist() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-2 py-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Documentation
        </Link>

        <header className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4">
            Checklist
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            YouTube SEO Checklist: Rank Your Videos Higher
          </h1>
          <p className="text-slate-500 text-sm mb-6">Published Feb 2026 · 8 min read</p>
          <p className="text-lg text-slate-700 leading-relaxed">
            Use this checklist before you publish. Optimize title, description, tags, thumbnail, chapters, and captions so your videos show up in search and suggested.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-200/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Quick checklist</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {checklistItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100/80 px-3 py-2 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <section
                key={step.title}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 sm:p-8 hover:shadow-md hover:border-slate-200/90 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{step.title}</h2>
                    <p className="text-slate-600 mt-1 text-sm leading-relaxed">{step.intro}</p>
                  </div>
                </div>
                <ul className="space-y-2 pl-0 sm:pl-8">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                {step.tip && (
                  <div className="mt-4 flex gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <Quote className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-900/90">
                      <strong className="text-amber-800">Pro tip:</strong> {step.tip}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <section className="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 sm:p-8 mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Before you hit Publish</h3>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">
            Run through: title length, description preview, tag count, thumbnail on mobile, chapter list, and that captions are correct. One pass takes a few minutes and can noticeably improve reach.
          </p>
          <blockquote className="text-slate-600 text-sm pl-4 border-l-4 border-blue-200 bg-slate-50/80 py-3 pr-4 rounded-r-lg italic">
            Save this page and use it as a pre-publish checklist for every video.
          </blockquote>
        </section>

        <div className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 sm:p-8 shadow-lg shadow-blue-500/20 border border-blue-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Get SEO built into your script</h3>
              <p className="text-blue-100 text-sm sm:text-base">
                ScriptGen generates titles, descriptions, tags, and chapters with your script. 50 free tokens to start.
              </p>
            </div>
            <HomeCta className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 flex-shrink-0">
              Generate free script
            </HomeCta>
          </div>
        </div>
      </div>
    </main>
  );
}
