import Image from "next/image";
import type { Metadata } from "next";
import HomeCta from "@/components/HomeCta";

const advantages = [
  {
    title: "Faster script creation",
    description:
      "Go from idea to polished script in minutes with guided prompts and smart templates.",
  },
  {
    title: "Consistent brand voice",
    description:
      "Keep every video, ad, and short on-message with reusable tone and style presets.",
  },
  {
    title: "Higher conversion",
    description:
      "Structure hooks, CTAs, and benefits to increase watch time and conversion rates.",
  },
];

const features = [
  {
    title: "Multi-format scripts",
    description:
      "Generate scripts for ads, explainers, shorts, and long-form video in one place.",
  },
  {
    title: "Audience targeting",
    description:
      "Tailor scripts by persona, pain points, and desired outcomes.",
  },
  {
    title: "Iterate instantly",
    description:
      "Create variations, A/B test hooks, and compare options without starting over.",
  },
  {
    title: "Export-ready",
    description:
      "Copy clean scripts or export to your workflow with formatting that just works.",
  },
];

const stats = [
  { label: "Avg. time to first draft", value: "4 min" },
  { label: "Retention-focused structure", value: "3-step" },
  { label: "Teams scaling weekly output", value: "2.4x" },
];

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
  { name: "Growth", tokens: 300, price: 249, highlight: true },
  { name: "Pro", tokens: 500, price: 399, highlight: false },
  { name: "Scale", tokens: 1000, price: 699, highlight: false },
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
      "Each script generation uses 10 tokens. New users start with 50 tokens, and you can top up anytime.",
  },
  {
    question: "Can I edit after generating?",
    answer:
      "Absolutely. You can tweak any output, regenerate sections, or create variants.",
  },
];

export const metadata: Metadata = {
  title: "AI YouTube Script Generator",
  description:
    "Create high-converting YouTube scripts with AI in minutes. ScriptGen supports Tamil, Hindi, English, and Thunglish with SEO, chapters, B-roll, and shorts.",
  openGraph: {
    title: "AI YouTube Script Generator",
    description:
      "Create high-converting YouTube scripts with AI in minutes. ScriptGen supports Tamil, Hindi, English, and Thunglish.",
    images: ["/hero-illustration.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI YouTube Script Generator",
    description:
      "Create high-converting YouTube scripts with AI in minutes. ScriptGen supports Tamil, Hindi, English, and Thunglish.",
    images: ["/hero-illustration.png"],
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
    url: "https://scriptgen.learn-made.in",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ScriptGen",
    url: "https://scriptgen.learn-made.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://scriptgen.learn-made.in/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
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
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="max-w-3xl space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-blue-700 font-semibold">
                ScriptGen
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Scripts that convert, created in minutes
              </h1>
              <p className="text-lg text-slate-600">
                ScriptGen helps teams craft high-performing video scripts with
                clear hooks, strong structure, and a consistent brand voice.
              </p>
              <div className="flex flex-wrap gap-3">
                <HomeCta
                  className="px-5 py-2.5 rounded-lg bg-blue-700 text-white font-semibold shadow-md shadow-blue-700/20 hover:bg-blue-800 transition"
                >
                  Get started
                </HomeCta>
                <a
                  href="#faq"
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:border-slate-400 transition"
                >
                  Read FAQ
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  50 free tokens on signup
                </span>
                <span>10 tokens per generation</span>
              </div>
            </div>
            <div className="relative w-full max-w-xl justify-self-center">
              <div className="absolute -inset-4 rounded-3xl bg-blue-100/50 blur-2xl" />
              <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
                <Image
                  src="/hero-illustration.png"
                  alt="Abstract illustration representing fast script generation"
                  width={1200}
                  height={675}
                  className="w-full h-auto rounded-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
            >
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Why teams choose ScriptGen</h2>
            <p className="text-slate-600">
              Move faster from concept to publish-ready scripts while keeping
              quality high and collaboration smooth.
            </p>
          </div>
          <div className="grid gap-4">
            {advantages.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 p-5 shadow-sm bg-white"
              >
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-slate-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-[0.3em]">
                  Step {index + 1}
                </p>
                <h3 className="text-xl font-semibold mt-3">{step.title}</h3>
                <p className="text-slate-600 mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-y border-slate-200 bg-slate-50"
      >
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Features built for growth</h2>
            <p className="text-slate-600 max-w-2xl">
              Everything you need to craft clear, persuasive scripts that align
              with your marketing goals.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] items-center mt-8">
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-blue-50 blur-2xl" />
              <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
                <Image
                  src="/features-illustration.png"
                  alt="Feature illustration with cards"
                  width={900}
                  height={675}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-slate-600 mt-2">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-semibold">Trusted by growth teams</h2>
          <p className="text-slate-600">
            Teams use ScriptGen to scale production without sacrificing quality.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mt-10">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-slate-700">“{item.quote}”</p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold">Simple token pricing</h2>
              <p className="text-slate-600 mt-2">
                10 tokens per generation. Includes script, SEO, images, chapters,
                B-roll, and shorts.
              </p>
            </div>
            <HomeCta className="px-5 py-2.5 rounded-lg bg-blue-700 text-white font-semibold shadow-md shadow-blue-700/20 hover:bg-blue-800 transition">
              Start free
            </HomeCta>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 ${
                  plan.highlight
                    ? "border-blue-600 bg-white shadow-lg"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                <p className="text-3xl font-semibold mt-3">₹{plan.price}</p>
                <p className="text-sm text-slate-500 mt-2">
                  {plan.tokens} tokens • {Math.floor(plan.tokens / 10)} generations
                </p>
                <div className="mt-6">
                  <HomeCta
                    className={`w-full px-4 py-2.5 rounded-lg font-semibold transition ${
                      plan.highlight
                        ? "bg-blue-700 text-white hover:bg-blue-800"
                        : "border border-slate-300 text-slate-700 hover:border-slate-400"
                    }`}
                  >
                    Get {plan.name}
                  </HomeCta>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Frequently asked questions</h2>
            <p className="text-slate-600">
              If you have a question we do not cover, reach out and we will help.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-slate-200 p-5 bg-white"
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-slate-600 mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
          <div className="rounded-2xl bg-blue-900 text-white p-8 sm:p-10 flex flex-col gap-4 sm:items-center sm:text-center">
            <h2 className="text-3xl font-semibold">
              Ready to ship better scripts?
            </h2>
            <p className="text-blue-100 max-w-2xl">
              Start creating high-performing scripts today and keep your pipeline
              full.
            </p>
            <HomeCta className="px-6 py-3 rounded-lg bg-white text-blue-900 font-semibold hover:bg-blue-50 transition">
              Get started
            </HomeCta>
          </div>
        </div>
      </section>
    </main>
  );
}
