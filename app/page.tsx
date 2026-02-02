"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

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
    question: "How do credits work?",
    answer:
      "Each script generation uses credits based on length. You can top up anytime.",
  },
  {
    question: "Can I edit after generating?",
    answer:
      "Absolutely. You can tweak any output, regenerate sections, or create variants.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
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
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/app" })}
                  className="px-5 py-2.5 rounded-lg bg-blue-700 text-white font-semibold shadow-md shadow-blue-700/20 hover:bg-blue-800 transition"
                >
                  Get started
                </button>
                <a
                  href="#faq"
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:border-slate-400 transition"
                >
                  Read FAQ
                </a>
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
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/app" })}
              className="px-6 py-3 rounded-lg bg-white text-blue-900 font-semibold hover:bg-blue-50 transition"
            >
              Get started
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
