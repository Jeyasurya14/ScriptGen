import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ScriptGen privacy policy. How we collect, use, and protect your data when you use our YouTube script generator.",
  openGraph: { url: `${siteUrl}/privacy-policy`, title: "Privacy Policy | ScriptGen" },
  alternates: { canonical: `${siteUrl}/privacy-policy` },
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Navigation */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-100 px-8 py-6 bg-slate-50/70">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    Legal • Privacy
                                </span>
                                <h1 className="text-3xl font-bold text-slate-900 mt-3">Privacy Policy</h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    Last updated: February 2025
                                </p>
                            </div>
                            <div className="text-xs text-slate-500">
                                ScriptGen
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-8">
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-slate-800 prose-p:text-slate-700 prose-li:text-slate-700 prose-a:text-blue-600">
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    Welcome to ScriptGen (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). ScriptGen is an AI-powered YouTube script generator that helps you create scripts in multiple languages, with SEO, chapters, B-roll suggestions, and more. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your data when you use our website and services.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">2. Data We Collect</h2>
                                <p className="text-slate-700 mb-3">We may collect, use, store and transfer different kinds of personal data about you, which we have grouped as follows:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                                    <li><strong className="text-slate-900">Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                    <li><strong className="text-slate-900">Contact Data</strong> includes email address.</li>
                                    <li><strong className="text-slate-900">Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                                    <li><strong className="text-slate-900">Usage Data</strong> includes information about how you use our website and services (e.g., script generations, token usage, and feature usage).</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">3. How We Use Your Data</h2>
                                <p className="text-slate-700 mb-3">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">5. Authentication &amp; Payment</h2>
                                <p className="text-slate-700 leading-relaxed mb-3">
                                    We use Google OAuth for sign-in. When you sign in with Google, we receive your email, name, and profile image to create and manage your account. We do not store your Google password. Payments for token packages are processed by Razorpay. We do not store your full payment card details; only transaction identifiers and token balances are recorded for your account.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">6. Third-Party Links</h2>
                                <p className="text-slate-700 leading-relaxed">
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
