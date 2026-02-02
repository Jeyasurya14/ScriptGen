import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HomeCta from "@/components/HomeCta";

const advantages = [
  {
    title: "Free AI script generation",
    description:
      "Start with 50 free tokens. Generate professional YouTube scripts, video content, ads, and explainers without cost.",
  },
  {
    title: "Automated SEO optimization",
    description:
      "Every script includes optimized titles, descriptions, tags, and chapter timestamps for better YouTube ranking.",
  },
  {
    title: "Multi-language support",
    description:
      "Create scripts in Tamil, Hindi, English, Thunglish. Instant translation to reach global audiences with consistent quality.",
  },
];

const features = [
  {
    title: "AI-powered script writing",
    description:
      "Advanced AI generates complete YouTube scripts with hooks, structure, CTAs, and production notes in seconds.",
  },
  {
    title: "YouTube SEO tools",
    description:
      "Get optimized titles, descriptions, tags, thumbnail text, and pinned comments designed to rank and convert.",
  },
  {
    title: "B-roll & shorts suggestions",
    description:
      "Automated B-roll scene suggestions with stock search terms, plus viral-ready YouTube Shorts clips extracted from your script.",
  },
  {
    title: "Multi-language video scripts",
    description:
      "Generate and translate scripts in Tamil, Hindi, English, Thunglish. Export as PDF, Word, or text for your workflow.",
  },
];

const stats = [
  { label: "Avg. time to first draft", value: "4 min" },
  { label: "Retention-focused structure", value: "3-step" },
  { label: "Teams scaling weekly output", value: "2.4x" },
];
const logos = ["NovaLabs", "CreatorPro", "ShopVerse", "Launchpad", "Growthly"];

const steps = [
  {
    title: "Brief in minutes",
    description: "Share your topic, audience, and tone. We shape the structure.",
  },
  {
    title: "Generate + refine",
    description: "Get a full script with SEO, then iterate or translate instantly.",
  },
  {
    title: "Publish with confidence",
    description: "Export clean scripts and move fast across your content pipeline.",
  },
];

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Head of Growth, NovaLabs",
    quote:
      "ScriptGen tightened our hooks and doubled watch time on ads within two weeks.",
  },
  {
    name: "Priya N",
    role: "Creator, BuildWithPriya",
    quote:
      "The structure and pacing feel pro. I publish 3x more consistently now.",
  },
  {
    name: "Karthik S",
    role: "Marketing Lead, ShopVerse",
    quote:
      "Our product videos finally sound cohesive across teams and channels.",
  },
];

const pricing = [
  { name: "Starter", tokens: 100, price: 99, highlight: false },
  { name: "Plus", tokens: 200, price: 179, highlight: false },
  { name: "Growth", tokens: 300, price: 249, highlight: true },
  { name: "Pro", tokens: 500, price: 399, highlight: false },
  { name: "Scale", tokens: 1000, price: 699, highlight: false },
  { name: "Enterprise", tokens: 1500, price: 999, highlight: false },
];
const pricingBreakdown = [
  { label: "Core script", tokens: 10 },
  { label: "SEO pack", tokens: 10 },
  { label: "Image prompts", tokens: 10 },
  { label: "Chapters", tokens: 10 },
  { label: "B-roll", tokens: 10 },
  { label: "Shorts", tokens: 10 },
];

const faqs = [
  {
    question: "What kinds of scripts can I generate?",
    answer:
      "You can create scripts for ads, product demos, social shorts, explainers, and more.",
  },
  {
    question: "Can I match my brand tone?",
    answer:
      "Yes. Choose a tone preset or add guidance to keep voice consistent across scripts.",
  },
  {
    question: "How do tokens work?",
    answer:
      "Script costs 10 tokens, and each selected feature costs 10 tokens extra. New users start with 50 tokens, and you can top up anytime.",
  },
  {
    question: "Can I edit after generating?",
    answer:
      "Absolutely. You can tweak any output, regenerate sections, or create variants.",
  },
  {
    question: "Is payment secure?",
    answer:
      "Yes. We use Razorpay for payments. Your card details are never stored on our servers, and checkout is PCI DSS compliant.",
  },
  {
    question: "What if I'm not satisfied?",
    answer:
      "We offer a refund policy. See our Refund Policy page for eligibility and how to request a refund.",
  },
  {
    question: "Is this script generator really free?",
    answer:
      "Yes. New users get 50 free tokens on signup (enough for 5 full scripts with all features). No credit card required to start.",
  },
  {
    question: "Can I generate scripts in multiple languages?",
    answer:
      "Yes. ScriptGen supports Tamil, Hindi, English, and Thunglish (Tamil-English mix). You can also translate any generated script to other languages instantly.",
  },
  {
    question: "How is this different from other AI script generators?",
    answer:
      "ScriptGen generates complete YouTube scripts with professional SEO optimization, chapter timestamps, B-roll suggestions, and shorts extraction in one click. Most tools only generate basic scripts.",
  },
];

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "Script Generator – AI YouTube Script Writer | Free Tool",
  description:
    "Free AI script generator for YouTube videos. Create professional scripts in Tamil, Hindi, English, Thunglish with SEO optimization, chapters, B-roll suggestions. Start with 50 free tokens.",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Script Generator – AI YouTube Script Writer | Free Tool",
    description:
      "Free AI script generator for YouTube. Create professional scripts in multiple languages with SEO optimization, chapters, B-roll. 50 free tokens.",
    url: siteUrl,
    images: ["/og-scriptgen.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Script Generator – AI YouTube Script Writer | Free",
    description:
      "Free AI script generator for YouTube. Create professional scripts in Tamil, Hindi, English with SEO, chapters, B-roll.",
    images: ["/og-scriptgen.png"],
  },
};

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ScriptGen",
    url: siteUrl,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ScriptGen",
    url: siteUrl,
    description: "Generate high-converting YouTube scripts with AI. Tamil, Hindi, English, Thunglish. SEO, chapters, B-roll, shorts.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ScriptGen",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description: "Free AI script generator for YouTube. Create professional video scripts with automated SEO, chapters, B-roll suggestions. Supports Tamil, Hindi, English, Thunglish.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
      bestRating: "5",
    },
    featureList: [
      "AI-powered script generation",
      "YouTube SEO optimization",
      "Multi-language support (Tamil, Hindi, English, Thunglish)",
      "Automated chapter timestamps",
      "B-roll suggestions",
      "Shorts extraction",
      "Export to PDF, Word, Text",
    ],
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <section className="relative border-b border-slate-200/80 bg-gradient-to-b from-slate-50/50 to-white overflow-hidden">
        <div className="absolute inset-0 h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-amber-400/80 opacity-90" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="max-w-3xl space-y-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Free Script Generator
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] text-slate-900 tracking-tight">
                Script Generator for YouTube
                <span className="text-blue-600"> – Free & Fast</span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Generate professional YouTube scripts in minutes. Tamil, Hindi, English, Thunglish — with SEO, chapters, B-roll, and shorts. Start with 50 free tokens.
              </p>
              <div className="flex flex-wrap gap-3">
                <HomeCta
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Get started
                </HomeCta>
                <a
                  href="#faq"
                  className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Read FAQ
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-500 pt-1">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 ring-2 ring-green-500/30" />
                  50 free tokens on signup
                </span>
                <span>10 tokens per script + 10 per feature</span>
                <a href="/refund-policy" className="text-blue-600 hover:text-blue-700 font-medium underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded">
                  Refund policy
                </a>
              </div>
            </div>
            <div className="relative w-full max-w-xl justify-self-center lg:justify-self-end">
              <div className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-gradient-to-br from-blue-100/70 to-slate-100/50 blur-2xl" />
              <div className="relative rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50">
                <Image
                  src="/hero-illustration.png"
                  alt="Script generation workflow"
                  width={1200}
                  height={675}
                  className="w-full h-auto rounded-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 text-center shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
            >
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-blue-600">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
            Trusted by teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 mt-4 text-sm font-medium text-slate-500">
            {logos.map((logo) => (
              <span key={logo} className="tracking-wide hover:text-slate-700 transition-colors">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-white py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] items-start">
            <div className="space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                Advantages
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Why teams choose ScriptGen</h2>
              <p className="text-slate-600 text-base leading-relaxed max-w-md">
                Move faster from concept to publish-ready scripts while keeping quality high.
              </p>
              <div className="h-px w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full" aria-hidden />
            </div>
            <div className="grid gap-4">
              {advantages.map((item, index) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200/80 p-5 sm:p-6 bg-white shadow-sm hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200/60 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                      {index + 1}
                    </span>
                    <h3 className="font-semibold text-lg text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 mt-3 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-slate-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              How it works
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">From idea to publish-ready</h2>
            <p className="text-slate-600 text-base">
              A streamlined workflow for speed and quality.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="h-11 w-11 rounded-xl bg-blue-600 text-white text-base font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                </div>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-slate-200/80 bg-white"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="space-y-3 mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Features
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Built for growth</h2>
            <p className="text-slate-600 text-base max-w-2xl">
              Clear, persuasive scripts that align with your goals.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 rounded-2xl bg-slate-100/60 blur-2xl" />
              <div className="relative rounded-2xl border border-slate-200/80 bg-white p-4 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/50">
                <Image
                  src="/features-illustration.png"
                  alt="Feature illustration with cards"
                  width={900}
                  height={675}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 order-1 lg:order-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
                >
                  <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 bg-slate-50/30">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Trusted by teams</h2>
          <p className="text-slate-600 text-base">
            Scale production without sacrificing quality.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all"
            >
              <p className="text-amber-500 text-sm font-medium" aria-hidden>
                ★★★★★
              </p>
              <p className="text-slate-700 text-sm mt-3 leading-relaxed">“{item.quote}”</p>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-slate-200/80 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Pricing
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Simple token pricing</h2>
              <p className="text-slate-600 text-base">
                Script: 10 tokens. Each feature: +10 tokens. Top up anytime.
              </p>
            </div>
            <HomeCta className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 w-fit">
              Start free
            </HomeCta>
          </div>
          <div className="mt-8 flex items-center gap-3 p-4 sm:p-5 rounded-2xl bg-green-50/80 border border-green-200/80 text-green-800 text-sm font-medium">
            <span className="h-9 w-9 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold flex-shrink-0" aria-hidden>✓</span>
            <span>
              Secure payment via Razorpay. Your card details are never stored. PCI DSS compliant • Instant token delivery.
            </span>
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
            <p className="text-sm font-semibold text-slate-900 mb-4">
              Feature cost
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-600">
              {pricingBreakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1">
                  <span>{item.label}</span>
                  <span className="font-semibold text-slate-800">{item.tokens} tokens</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all ${
                  plan.highlight
                    ? "border-blue-500 bg-white shadow-lg ring-1 ring-blue-500/20"
                    : "border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:border-slate-200"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute right-4 top-4 text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    Popular
                  </span>
                )}
                <p className="text-base font-semibold text-slate-900">{plan.name}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">₹{plan.price}</p>
                  <p className="text-xs text-slate-500">/ {Math.floor(plan.tokens / 10)} outputs</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">{plan.tokens} tokens</p>
                <div className="mt-6">
                  <HomeCta
                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      plan.highlight
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    Get {plan.name}
                  </HomeCta>
                </div>
                <p className="mt-3 text-xs text-slate-500">All pro features included</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            50 free tokens to start • No subscription • Refund policy available
          </p>
        </div>
      </section>

      <section id="faq" className="relative border-y border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Frequently asked questions</h2>
              <p className="text-slate-600 text-base max-w-sm">
                Questions? Reach out and we’ll help.
              </p>
              <div className="h-px w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full" aria-hidden />
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="group rounded-2xl border border-slate-200/80 p-5 sm:p-6 bg-white shadow-sm hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200/60 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 h-8 w-8 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center mt-0.5 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300">
                      Q
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base sm:text-lg">{faq.question}</h3>
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col gap-4 sm:items-center sm:text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 relative">
              Get started
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight relative">
              Ready to create better scripts?
            </h2>
            <p className="text-slate-300 text-base max-w-xl relative">
              Sign in with Google. 50 free tokens — no card required.
            </p>
            <HomeCta className="mt-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 relative">
              Get started
            </HomeCta>
          </div>
        </div>
      </section>
    </main>
  );
}
