import { ChevronLeft, Shield } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ScriptGen privacy policy. How we collect, use, and protect your data when you use our YouTube script generator.",
  openGraph: { url: `${siteUrl}/privacy-policy`, title: "Privacy Policy | ScriptGen" },
  alternates: { canonical: `${siteUrl}/privacy-policy` },
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#030306] py-16 px-4 sm:px-6 lg:px-8">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto relative">
                {/* Header Navigation */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-[#a1a1b5] hover:text-white transition-colors group">
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="relative bg-[#08080c] rounded-3xl border border-white/[0.06] overflow-hidden">
                    {/* Top gradient */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#6366f1]/30 to-transparent" />
                    
                    <div className="border-b border-white/[0.04] px-8 py-8 bg-gradient-to-b from-white/[0.02] to-transparent">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-[#6366f1]" />
                                    </div>
                                    <span className="inline-flex items-center rounded-full border border-[#6366f1]/30 bg-[#6366f1]/10 px-3 py-1 text-xs font-semibold text-[#6366f1]">
                                        Legal • Privacy
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                                <p className="text-[#6b6b80] text-sm mt-2">
                                    Last updated: February 2025
                                </p>
                            </div>
                            <div className="text-xs text-[#45455a]">
                                ScriptGen
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-10">
                        <div className="space-y-10">
                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">1. Introduction</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    Welcome to ScriptGen (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). ScriptGen is an AI-powered YouTube script generator that helps you create scripts in multiple languages, with SEO, chapters, B-roll suggestions, and more. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your data when you use our website and services.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">2. Data We Collect</h2>
                                <p className="text-[#a1a1b5] mb-4">We may collect, use, store and transfer different kinds of personal data about you, which we have grouped as follows:</p>
                                <ul className="space-y-3 text-[#a1a1b5]">
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        <span className="w-2 h-2 rounded-full bg-[#6366f1] mt-2 flex-shrink-0" />
                                        <span><strong className="text-white">Identity Data</strong> includes first name, last name, username or similar identifier.</span>
                                    </li>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        <span className="w-2 h-2 rounded-full bg-[#8b5cf6] mt-2 flex-shrink-0" />
                                        <span><strong className="text-white">Contact Data</strong> includes email address.</span>
                                    </li>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        <span className="w-2 h-2 rounded-full bg-[#06b6d4] mt-2 flex-shrink-0" />
                                        <span><strong className="text-white">Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</span>
                                    </li>
                                    <li className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        <span className="w-2 h-2 rounded-full bg-[#10b981] mt-2 flex-shrink-0" />
                                        <span><strong className="text-white">Usage Data</strong> includes information about how you use our website and services (e.g., script generations, token usage, and feature usage).</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">3. How We Use Your Data</h2>
                                <p className="text-[#a1a1b5] mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                                <ul className="space-y-2 text-[#a1a1b5]">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#6366f1]">•</span>
                                        Where we need to perform the contract we are about to enter into or have entered into with you.
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#6366f1]">•</span>
                                        Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#6366f1]">•</span>
                                        Where we need to comply with a legal or regulatory obligation.
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">4. Data Security</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">5. Authentication &amp; Payment</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    We use Google OAuth for sign-in. When you sign in with Google, we receive your email, name, and profile image to create and manage your account. We do not store your Google password. Payments for token packages are processed by Razorpay. We do not store your full payment card details; only transaction identifiers and token balances are recorded for your account.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">6. Third-Party Links</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
