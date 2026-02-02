import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "ScriptGen terms and conditions. Rules and guidelines for using our YouTube script generator service.",
  openGraph: { url: `${siteUrl}/terms-conditions`, title: "Terms and Conditions | ScriptGen" },
  alternates: { canonical: `${siteUrl}/terms-conditions` },
};

export default function TermsConditions() {
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
                                    Legal • Terms
                                </span>
                                <h1 className="text-3xl font-bold text-slate-900 mt-3">Terms and Conditions</h1>
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
                                <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    These Terms of Use constitute a legally binding agreement between you, whether personally or on behalf of an entity (&quot;you&quot;), and ScriptGen (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of the ScriptGen website and services, including AI script generation, token-based usage, and any related features (collectively, the &quot;Service&quot;).
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">2. Intellectual Property Rights</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    Unless otherwise indicated, the Service and our website are our proprietary property. All source code, databases, functionality, software, designs, text, and graphics (collectively, the &quot;Content&quot;) and the ScriptGen name and logos (the &quot;Marks&quot;) are owned or controlled by us or licensed to us and are protected by copyright and trademark laws.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">3. User Representations</h2>
                                <p className="text-slate-700 mb-3">By using the Service, you represent and warrant that:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                                    <li>All registration information you submit (including via Google sign-in) will be true, accurate, current, and complete.</li>
                                    <li>You will maintain the accuracy of such information and promptly update it as necessary.</li>
                                    <li>You have the legal capacity and agree to comply with these Terms of Use.</li>
                                    <li>You will not access the Service through automated or non-human means (e.g., bots or scripts).</li>
                                    <li>You understand that usage is token-based: script generation and optional features consume tokens as described on the Service.</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">4. Prohibited Activities</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    You may not access or use the Service for any purpose other than generating scripts and using features we provide. The Service may not be used for resale of generated content in bulk, automated scraping, or any use we have not expressly permitted.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">5. Generated Content</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    You retain all rights to the scripts, SEO data, chapters, B-roll suggestions, shorts, and other content generated using ScriptGen. We claim no ownership over your generated output. You are responsible for ensuring that your use of the generated content complies with applicable laws, platform policies (e.g., YouTube), and third-party rights.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the Service (including token purchases, generated content, or unavailability of the Service), even if we have been advised of the possibility of such damages.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
