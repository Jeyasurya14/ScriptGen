import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
  Clock,
  Shield,
  Play,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
  Lightbulb,
  PenTool,
  Rocket,
  Target,
  MessageCircle,
  Award,
  BarChart3,
  Video,
  Wand2,
  ChevronDown,
} from "lucide-react";
import HomeCta from "../components/HomeCta";

export const metadata: Metadata = {
  title: "ScriptGen - AI YouTube Script Generator | English, Tamil, Thanglish, Hindi",
  description:
    "Create professional YouTube scripts instantly with AI. Generate engaging video scripts in English, Tamil, Thanglish, and Hindi. Free script generator with SEO optimization.",
  keywords: [
    "YouTube script generator",
    "AI script writer",
    "video script generator",
    "Tamil script generator",
    "Thanglish script generator",
    "Hindi script generator",
    "free script generator",
    "YouTube content creator tools",
  ],
  openGraph: {
    title: "ScriptGen - AI YouTube Script Generator",
    description: "Create professional YouTube scripts in seconds with AI-powered generation.",
    type: "website",
  },
};

const stats = [
  { value: "50K+", label: "Scripts Generated", sublabel: "and counting" },
  { value: "4.9", label: "User Rating", sublabel: "from 2K+ reviews" },
  { value: "4", label: "Languages", sublabel: "supported" },
  { value: "<30s", label: "Generation Time", sublabel: "average" },
];

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Generation",
    description: "Advanced language models create engaging, contextually relevant scripts tailored to your content style.",
    color: "#3b82f6",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Create scripts in English, Tamil, Thanglish, and Hindi with natural language flow and cultural context.",
    color: "#06b6d4",
  },
  {
    icon: TrendingUp,
    title: "SEO Optimization",
    description: "Built-in keyword optimization ensures your content ranks higher and reaches more viewers.",
    color: "#10b981",
  },
  {
    icon: Video,
    title: "YouTube Shorts Ready",
    description: "Generate optimized short-form scripts with viral hooks, perfect for Shorts and Reels.",
    color: "#f97316",
  },
  {
    icon: Lightbulb,
    title: "B-Roll Suggestions",
    description: "Get intelligent visual recommendations to enhance your video production workflow.",
    color: "#8b5cf6",
  },
  {
    icon: BarChart3,
    title: "Chapter Markers",
    description: "Auto-generated chapters with timestamps improve viewer retention and navigation.",
    color: "#ec4899",
  },
];

const steps = [
  {
    step: "01",
    title: "Enter Your Topic",
    description: "Describe your video idea, choose a language, and set your preferred tone.",
    icon: PenTool,
  },
  {
    step: "02",
    title: "AI Creates Script",
    description: "Our AI analyzes successful patterns and generates an optimized script in seconds.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Export & Create",
    description: "Copy your script, get B-roll suggestions, and start creating amazing content.",
    icon: Rocket,
  },
];

const testimonials = [
  {
    name: "Priya K.",
    role: "Tech YouTuber",
    content: "The Tamil script quality is incredible. It feels natural, not like AI-generated content at all.",
    avatar: "PK",
    rating: 5,
  },
  {
    name: "Rahul M.",
    role: "Educational Creator",
    content: "Cut my script writing time from 3 hours to 15 minutes. The SEO suggestions are a game-changer.",
    avatar: "RM",
    rating: 5,
  },
  {
    name: "Sarah J.",
    role: "Lifestyle Vlogger",
    content: "The Shorts script generator is perfect for TikTok and Instagram. My engagement doubled!",
    avatar: "SJ",
    rating: 5,
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "₹149",
    description: "Perfect for trying out ScriptGen",
    tokens: "100 tokens",
    features: ["Full script generation", "All 4 languages", "SEO optimization", "Email support"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Creator",
    price: "₹499",
    description: "Most popular for creators",
    tokens: "500 tokens",
    features: ["Full script generation", "All 4 languages", "SEO + Chapters", "B-Roll suggestions", "Shorts clips", "Priority support"],
    cta: "Buy Now",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "₹899",
    description: "Best value for power users",
    tokens: "1,000 tokens",
    features: ["Everything in Creator", "Image prompts", "Script history", "Bulk generation", "24/7 support"],
    cta: "Buy Now",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "How does the token system work?",
    a: "Each script generation uses 10 tokens for the base script. Additional features like SEO, chapters, B-roll, shorts, and image prompts cost 10 tokens each. A full generation with all features uses 60 tokens.",
  },
  {
    q: "Can I generate scripts in mixed languages?",
    a: "Yes! Thanglish mode specifically combines Tamil and English naturally. You can also switch between languages for different scripts.",
  },
  {
    q: "Do I need technical knowledge to use ScriptGen?",
    a: "Not at all. Simply enter your topic, choose your settings, and click generate. Our AI handles all the complexity.",
  },
  {
    q: "What makes the scripts SEO-optimized?",
    a: "Our AI incorporates trending keywords, optimal phrase structures, and engagement patterns that YouTube's algorithm favors.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero — two-column layout */}
      <section className="relative hero-gradient min-h-[90vh] flex items-center overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-overline mb-4">AI-Powered Script Generation</p>
              <h1 className="text-display text-slate-900 mb-6">
                <span className="block">Scripts that</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">convert & scale</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg mb-8 leading-relaxed">
                Professional YouTube scripts in seconds. SEO-built, multi-language, and ready for Shorts. Start with 30 free tokens.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <HomeCta className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/25">
                  <Sparkles className="w-5 h-5" />
                  Start free — 30 tokens
                </HomeCta>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  How it works
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" /> Secure payments</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" /> &lt;30s generation</span>
                <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> 4.9/5 rating</span>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-slate-200/20 rounded-3xl blur-2xl" />
              <div className="relative surface-raised p-6 rounded-2xl shadow-xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Script preview</p>
                <div className="space-y-2 text-sm text-slate-600 font-mono">
                  <p className="text-slate-800 font-sans font-medium">[Hook] Hey creators —</p>
                  <p>Today we&apos;re breaking down how to write scripts that keep viewers watching...</p>
                  <p className="text-slate-400">[Intro] In this video...</p>
                  <p className="text-slate-400">[Main] First, structure your...</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> SEO • Chapters • B-Roll
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400">
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* Stats strip — dark bar */}
      <section className="stats-strip section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-300">{stat.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-overline mb-3">Process</p>
            <h2 className="text-headline text-slate-900 mb-3">From idea to script in three steps</h2>
            <p className="text-slate-600">No learning curve. Enter a topic, hit generate, and use your script.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="surface-raised surface-raised-hover p-8 rounded-2xl text-center transition-all">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-5">
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="block text-xs font-bold text-slate-300 mb-2">{item.step}</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — bento grid */}
      <section id="features" className="section-padding bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-overline mb-3">Features</p>
            <h2 className="text-headline text-slate-900 mb-3">Everything you need to create professional scripts</h2>
            <p className="text-slate-600">Built for creators. Script, SEO, chapters, B-roll, Shorts, and more.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="surface-raised surface-raised-hover group p-6 rounded-2xl transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}18`, color: feature.color }}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 py-6 px-6 rounded-2xl bg-white/80 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><Shield className="w-5 h-5 text-emerald-600" /></div>
              <div><p className="font-semibold text-slate-900 text-sm">Secure payments</p><p className="text-xs text-slate-500">Protected checkout</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><Check className="w-5 h-5 text-blue-600" /></div>
              <div><p className="font-semibold text-slate-900 text-sm">Reliable output</p><p className="text-xs text-slate-500">Consistent quality</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Award className="w-5 h-5 text-amber-600" /></div>
              <div><p className="font-semibold text-slate-900 text-sm">Creator support</p><p className="text-xs text-slate-500">Fast & transparent</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-overline mb-3">Testimonials</p>
            <h2 className="text-headline text-slate-900 mb-3">Loved by creators worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="surface-raised surface-raised-hover p-6 rounded-2xl transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-overline mb-3">Pricing</p>
            <h2 className="text-headline text-slate-900 mb-3">Simple plans. Start free, scale when you need.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 transition-all flex flex-col ${
                  tier.highlighted
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.03] z-10"
                    : "surface-raised surface-raised-hover bg-white"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white text-blue-600 text-xs font-bold">
                    Most popular
                  </div>
                )}
                <div className="mb-5">
                  <h3 className={`text-lg font-semibold mb-1 ${tier.highlighted ? "text-white" : "text-slate-900"}`}>{tier.name}</h3>
                  <p className={tier.highlighted ? "text-blue-100 text-sm" : "text-slate-600 text-sm"}>{tier.description}</p>
                </div>
                <div className="mb-5">
                  <span className={`text-4xl font-bold tracking-tight ${tier.highlighted ? "text-white" : "text-slate-900"}`}>{tier.price}</span>
                  {tier.price !== "Free" && (
                    <span className={tier.highlighted ? "text-blue-200 text-sm ml-1" : "text-slate-500 text-sm ml-1"}>one-time</span>
                  )}
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium mb-6 w-fit ${tier.highlighted ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"}`}>
                  <Zap className="w-4 h-4" />
                  {tier.tokens}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.highlighted ? "text-blue-200" : "text-emerald-600"}`} />
                      <span className={tier.highlighted ? "text-blue-50" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <HomeCta
                  className={`w-full py-3.5 rounded-xl font-semibold text-center transition-all mt-auto ${
                    tier.highlighted
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {tier.cta}
                </HomeCta>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-overline mb-3">FAQ</p>
            <h2 className="text-headline text-slate-900">Common questions</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="surface-raised surface-raised-hover p-5 rounded-xl transition-all">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline text-white mb-4">
            Ready to write scripts that perform?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
            Join creators who save hours every week. Start with 30 free tokens — no card required.
          </p>
          <HomeCta className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-semibold text-lg bg-white text-blue-600 hover:bg-blue-50 shadow-xl transition-all">
            <Sparkles className="w-5 h-5" />
            <span>Generate your first script</span>
            <ArrowRight className="w-5 h-5" />
          </HomeCta>
        </div>
      </section>
    </main>
  );
}
