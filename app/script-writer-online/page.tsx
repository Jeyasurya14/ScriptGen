import { Metadata } from "next";
import Link from "next/link";
import HomeCta from "@/components/HomeCta";
import { Globe2, Zap, CheckCircle2, ArrowRight, ChevronDown, Monitor, Wifi, Lock, Clock } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "Script Writer Online — Free AI Script Writing Tool | ScriptGen",
  description:
    "Write scripts online for free with ScriptGen's AI script writer. No software to install. Generate professional video scripts, YouTube scripts, and ad scripts in your browser. Free to start.",
  alternates: { canonical: `${siteUrl}/script-writer-online` },
  openGraph: {
    title: "Script Writer Online — Free & AI Powered | ScriptGen",
    description: "Write professional video scripts online using AI. No downloads. Works in any browser. Free to start.",
    url: `${siteUrl}/script-writer-online`,
  },
};

const benefits = [
  { icon: Monitor, title: "Works in any browser", desc: "Chrome, Firefox, Safari, Edge — no downloads or plugin installs needed" },
  { icon: Wifi, title: "100% cloud-based", desc: "Your scripts are auto-saved. Access them from any device, anywhere" },
  { icon: Zap, title: "Instant AI generation", desc: "Full script generated in under 5 minutes with a single click" },
  { icon: Globe2, title: "Multi-language online", desc: "Write in English, Tamil, Thanglish, or Hindi — all from your browser" },
  { icon: Lock, title: "Secure & private", desc: "Sign in with Google. Your scripts are private to your account" },
  { icon: Clock, title: "Edit & refine anytime", desc: "Come back to your scripts, refine them, or regenerate any section" },
];

const scriptTypes = [
  { title: "YouTube Video Scripts", desc: "Long-form tutorials, reviews, vlogs, explainers with 4-stage pipeline" },
  { title: "YouTube Shorts Scripts", desc: "15–60 second scripts with viral hooks for Shorts content" },
  { title: "Video Ad Scripts", desc: "High-conversion scripts for product ads, brand videos, promotional content" },
  { title: "Educational Video Scripts", desc: "Structured lesson scripts with clear explanations and examples" },
  { title: "Podcast Episode Outlines", desc: "Episode structures with talking points, intro, and outro formats" },
  { title: "Instagram Reel Scripts", desc: "Short, punchy scripts optimized for Instagram engagement" },
];

const faqs = [
  {
    q: "Can I write scripts online for free?",
    a: "Yes. ScriptGen gives you 30 free tokens on sign-up with no credit card required. You can generate 3–5 complete video scripts online at zero cost before needing to buy more tokens.",
  },
  {
    q: "Do I need to download any software to write scripts online?",
    a: "No. ScriptGen is 100% web-based. Open it in any modern browser — Chrome, Firefox, Safari, or Edge — and start writing scripts instantly. No downloads, no extensions, no setup.",
  },
  {
    q: "What is the best online script writing tool?",
    a: "ScriptGen is the best online script writer for YouTube creators because it combines AI generation, SEO optimization, B-Roll suggestions, chapter timestamps, and Shorts extraction in one tool. It's the only online script writer with a built-in Thanglish engine for Tamil creators.",
  },
  {
    q: "Can I write scripts online in Tamil?",
    a: "Yes. ScriptGen's online script writer supports English, Tamil, Thanglish (Tamil + English blend), and Hindi. You can adjust the Tamil/English language ratio to match your content style.",
  },
  {
    q: "Is ScriptGen's online script writer good for beginners?",
    a: "Absolutely. ScriptGen is designed for all experience levels. Enter your video topic and preferences, and the AI handles the structure, hooks, pacing, SEO, and production notes — even if you've never written a script before.",
  },
];

export default function ScriptWriterOnline() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "ScriptGen — Script Writer Online",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      url: `${siteUrl}/script-writer-online`,
      description: "Free online script writing tool powered by AI. Write professional YouTube scripts, video ads, and content scripts from your browser. No download required.",
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
        { "@type": "ListItem", position: 2, name: "Script Writer Online", item: `${siteUrl}/script-writer-online` },
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
          <span className="text-slate-300">Script Writer Online</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            <Globe2 className="w-4 h-4" />
            Script Writer Online
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Script Writer Online
            <span className="block brand-gradient-text mt-2">Write Scripts in Your Browser. Free.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            ScriptGen is a free online script writing tool powered by AI. No downloads. No software. Open your browser, enter your video topic, and get a professional script with SEO, B-Roll, and chapters in minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <HomeCta className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
              Write scripts online free
              <ArrowRight className="w-4 h-4" />
            </HomeCta>
          </div>
          <p className="mt-3 text-xs text-slate-500">30 free tokens — no credit card, no download</p>
        </div>

        {/* What is section */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">What is an Online Script Writer?</h2>
          <p className="text-slate-400 leading-relaxed mb-3">
            An <strong className="text-white">online script writer</strong> is a browser-based tool that helps you write professional video scripts without installing any software. ScriptGen's AI-powered online script writer uses artificial intelligence to generate complete YouTube scripts, video ad scripts, and content scripts directly in your browser.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Unlike traditional script writing software, ScriptGen is completely cloud-based — your scripts are automatically saved, accessible from any device, and come with built-in AI generation, SEO optimization, and multi-language support.
          </p>
        </section>

        {/* Benefits */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Why Use ScriptGen as Your Online Script Writer?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-[#111118]/80 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
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

        {/* Script types */}
        <section className="bg-[#111118]/80 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Types of Scripts You Can Write Online</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {scriptTypes.map((type) => (
              <div key={type.title} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">{type.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Online Script Writer — FAQs</h2>
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
              { href: "/youtube-script-writer", label: "YouTube Script Writer", desc: "Dedicated for YouTube content" },
              { href: "/ai-script-writer", label: "AI Script Writer", desc: "Full AI-powered automation" },
              { href: "/free-script-generator", label: "Free Script Generator", desc: "Generate scripts at zero cost" },
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-3">Start writing scripts online today</h2>
            <p className="text-slate-400 mb-6">30 free tokens. No credit card. Works in any browser.</p>
            <HomeCta className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all">
              Write your first script online <ArrowRight className="w-4 h-4" />
            </HomeCta>
          </div>
        </div>
      </div>
    </main>
  );
}
