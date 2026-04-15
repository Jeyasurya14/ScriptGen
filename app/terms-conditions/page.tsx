import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "ScriptGen terms and conditions. Rules and guidelines for using our YouTube script generator service.",
  openGraph: { url: `${siteUrl}/terms-conditions`, title: "Terms and Conditions | ScriptGen" },
  alternates: { canonical: `${siteUrl}/terms-conditions` },
};

export default function TermsConditions() {
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
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/30 to-transparent" />
                    
                    <div className="border-b border-white/[0.04] px-8 py-8 bg-gradient-to-b from-white/[0.02] to-transparent">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-[#8b5cf6]" />
                                    </div>
                                    <span className="inline-flex items-center rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3 py-1 text-xs font-semibold text-[#8b5cf6]">
                                        Legal • Terms
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">Terms and Conditions</h1>
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
                                <h2 className="text-xl font-semibold mb-4 text-white">1. Agreement to Terms</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    These Terms of Use constitute a legally binding agreement between you, whether personally or on behalf of an entity (&quot;you&quot;), and ScriptGen (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of the ScriptGen website and services, including AI script generation, token-based usage, and any related features (collectively, the &quot;Service&quot;).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">2. Intellectual Property Rights</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    Unless otherwise indicated, the Service and our website are our proprietary property. All source code, databases, functionality, software, designs, text, and graphics (collectively, the &quot;Content&quot;) and the ScriptGen name and logos (the &quot;Marks&quot;) are owned or controlled by us or licensed to us and are protected by copyright and trademark laws.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">3. User Representations</h2>
                                <p className="text-[#a1a1b5] mb-4">By using the Service, you represent and warrant that:</p>
                                <ul className="space-y-2 text-[#a1a1b5]">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#8b5cf6]">•</span>
                                        All registration information you submit (including via Google sign-in) will be true, accurate, current, and complete.
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#8b5cf6]">•</span>
                                        You will maintain the accuracy of such information and promptly update it as necessary.
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#8b5cf6]">•</span>
                                        You have the legal capacity and agree to comply with these Terms of Use.
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#8b5cf6]">•</span>
                                        You will not access the Service through automated or non-human means (e.g., bots or scripts).
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#8b5cf6]">•</span>
                                        You understand that usage is token-based: script generation and optional features consume tokens as described on the Service.
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">4. Prohibited Activities</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    You may not access or use the Service for any purpose other than generating scripts and using features we provide. The Service may not be used for resale of generated content in bulk, automated scraping, or any use we have not expressly permitted.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">5. Generated Content</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    You retain all rights to the scripts, SEO data, chapters, B-roll suggestions, shorts, and other content generated using ScriptGen. We claim no ownership over your generated output. You are responsible for ensuring that your use of the generated content complies with applicable laws, platform policies (e.g., YouTube), and third-party rights.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">6. Limitation of Liability</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
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
