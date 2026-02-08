import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Gift,
  Zap,
  Shield,
  Check,
  ArrowRight,
  Tag,
  Share2,
  Video,
  Globe,
  TrendingUp,
  Award,
} from "lucide-react";
import HomeCta from "@/components/HomeCta";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "Offers & Promotions | ScriptGen – Free Tokens, Referrals & Token Packs",
  description:
    "Start with 30 free tokens. Get extra tokens with referrals, promo codes, and affordable token packs. Professional YouTube scripts in English, Tamil, Thanglish, Hindi.",
  alternates: { canonical: `${siteUrl}/promo` },
  keywords: [
    "ScriptGen offers",
    "free YouTube script tokens",
    "script generator promo",
    "referral tokens",
    "YouTube script generator discount",
  ],
  openGraph: {
    title: "ScriptGen Offers – Free Tokens & Promotions",
    description: "30 free tokens on signup. Refer friends for 15 tokens each. Token packs from ₹149.",
    type: "website",
  },
};

const offers = [
  {
    icon: Gift,
    title: "30 free tokens on signup",
    description: "Sign in with Google and get 30 tokens instantly. No credit card required. Enough for 3 full scripts with core features.",
    highlight: true,
  },
  {
    icon: Share2,
    title: "Refer friends, get 15 tokens each",
    description: "Share your referral link. When a friend signs up and uses it, you both get 15 bonus tokens. No limit.",
    highlight: true,
  },
  {
    icon: Tag,
    title: "Promo codes",
    description: "We run limited-time promo codes for extra tokens. Apply your code in the app under Recharge → Promo code.",
    highlight: false,
  },
];

const tokenPacks = [
  { name: "Starter", tokens: "100", price: "₹149", perScript: "~10 scripts", popular: false },
  { name: "Plus", tokens: "250", price: "₹299", perScript: "~25 scripts", popular: false },
  { name: "Growth", tokens: "500", price: "₹499", perScript: "~50 scripts", popular: true },
  { name: "Pro", tokens: "1,000", price: "₹899", perScript: "~100 scripts", popular: false },
  { name: "Scale", tokens: "2,500", price: "₹1,999", perScript: "~250 scripts", popular: false },
  { name: "Enterprise", tokens: "5,000", price: "₹3,499", perScript: "~500 scripts", popular: false },
];

const benefits = [
  { icon: Video, text: "Full script generation" },
  { icon: Globe, text: "English, Tamil, Thanglish, Hindi" },
  { icon: TrendingUp, text: "SEO titles, descriptions, tags" },
  { icon: Award, text: "Chapters, B-roll, Shorts clips" },
];

export default function PromoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative hero-gradient min-h-[85vh] flex items-center overflow-hidden pt-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-3xl">
            <p className="text-overline mb-4">Limited-time offers</p>
            <h1 className="text-display text-slate-900 mb-6">
              <span className="block">More tokens.</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                More scripts. Zero hassle.
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
              Start with 30 free tokens. Unlock referral bonuses, use promo codes, and top up with affordable token packs. One platform for professional YouTube scripts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <HomeCta className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                <Sparkles className="w-5 h-5" />
                Claim 30 free tokens
              </HomeCta>
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                View token packs
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
              <Shield className="w-4 h-4 text-emerald-500" />
              No card required for free tokens. Secure payments via Razorpay.
            </div>
          </div>
        </div>
      </section>

      {/* Main offers */}
      <section className="section-padding bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-overline mb-3">Promotions</p>
            <h2 className="text-headline text-slate-900 mb-3">Ways to get more tokens</h2>
            <p className="text-slate-600">Sign up free, refer friends, and use promo codes when we run them.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {offers.map((offer) => (
              <div
                key={offer.title}
                className={`rounded-2xl p-8 flex flex-col transition-all ${
                  offer.highlight
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                    : "surface-raised surface-raised-hover bg-white"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                    offer.highlight ? "bg-white/20" : "bg-slate-100"
                  }`}
                >
                  <offer.icon className={offer.highlight ? "w-7 h-7 text-white" : "w-7 h-7 text-blue-600"} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${offer.highlight ? "text-white" : "text-slate-900"}`}>
                  {offer.title}
                </h3>
                <p className={offer.highlight ? "text-blue-100 text-sm leading-relaxed" : "text-slate-600 text-sm leading-relaxed"}>
                  {offer.description}
                </p>
                {offer.highlight && (
                  <Link
                    href="/app"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-100"
                  >
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-overline mb-3">What&apos;s included</p>
            <h2 className="text-headline text-slate-900 mb-3">Every token goes further</h2>
            <p className="text-slate-600">Script + SEO + chapters + B-roll + Shorts. One generation, one price.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {benefits.map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium text-sm"
              >
                <b.icon className="w-5 h-5 text-blue-600" />
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token packs */}
      <section className="section-padding bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-overline mb-3">Token packs</p>
            <h2 className="text-headline text-slate-900 mb-3">Top up when you need more</h2>
            <p className="text-slate-600">One-time purchase. No subscription. Use in the app under Recharge.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {tokenPacks.map((pack) => (
              <div
                key={pack.name}
                className={`rounded-xl p-6 border transition-all flex flex-col ${
                  pack.popular
                    ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/15"
                    : "bg-white border-slate-200 surface-raised-hover"
                }`}
              >
                {pack.popular && (
                  <span className="inline-block w-fit mb-3 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
                    Best value
                  </span>
                )}
                <h3 className={`text-lg font-semibold mb-1 ${pack.popular ? "text-white" : "text-slate-900"}`}>
                  {pack.name}
                </h3>
                <p className={pack.popular ? "text-blue-100 text-sm" : "text-slate-600 text-sm"}>{pack.perScript}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${pack.popular ? "text-white" : "text-slate-900"}`}>
                    {pack.price}
                  </span>
                  <span className={pack.popular ? "text-blue-200 text-sm" : "text-slate-500 text-sm"}>
                    · {pack.tokens} tokens
                  </span>
                </div>
                <Link
                  href="/app"
                  className={`mt-4 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    pack.popular
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Get in app
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-headline text-white mb-4">
            Ready to create scripts that convert?
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto">
            Join creators who save hours every week. Start with 30 free tokens — no card required.
          </p>
          <HomeCta className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-semibold text-lg bg-white text-blue-600 hover:bg-blue-50 shadow-xl transition-all">
            <Sparkles className="w-5 h-5" />
            <span>Claim free tokens & launch app</span>
            <ArrowRight className="w-5 h-5" />
          </HomeCta>
          <p className="mt-6 text-sm text-blue-200">
            By signing in you agree to our{" "}
            <Link href="/terms-conditions" className="underline hover:text-white">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline hover:text-white">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
