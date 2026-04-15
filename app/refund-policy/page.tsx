import { ChevronLeft, AlertTriangle, CreditCard } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://scriptgen.learnmade.in";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "ScriptGen refund policy. Eligibility and how to request a refund for token purchases.",
  openGraph: { url: `${siteUrl}/refund-policy`, title: "Refund Policy | ScriptGen" },
  alternates: { canonical: `${siteUrl}/refund-policy` },
};

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-[#030306] py-16 px-4 sm:px-6 lg:px-8">
            {/* Background effects */}
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />
            
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
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent" />
                    
                    <div className="border-b border-white/[0.04] px-8 py-8 bg-gradient-to-b from-white/[0.02] to-transparent">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-[#f59e0b]" />
                                    </div>
                                    <span className="inline-flex items-center rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-3 py-1 text-xs font-semibold text-[#f59e0b]">
                                        Legal • Refunds
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-white">Refund Policy</h1>
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

                            {/* Alert Box */}
                            <div className="relative p-6 bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-2xl overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#f59e0b] to-[#ef4444]" />
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#f59e0b] mb-2">
                                            Strict No-Refund Policy
                                        </h2>
                                        <p className="text-[#f59e0b]/80 text-sm leading-relaxed">
                                            All sales are final. ScriptGen provides immediate access to digital goods and AI generation (scripts, SEO, chapters, B-roll, shorts, image prompts). We do not offer refunds or token recharges for any token package purchases under any circumstances.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">1. Digital Services</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    Our service provides instant access to AI-generated content. Once a generation is initiated or tokens are purchased, the computing resources are consumed immediately. Therefore, we cannot retrieve or &quot;un-use&quot; the service, making refunds impossible.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">2. Non-Tangible Irrevocable Goods</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    You agree that by purchasing tokens or services from us, you are purchasing non-tangible, irrevocable digital goods. You acknowledge that no refund will be issued for any transaction once it is completed.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">3. Accidental Purchases</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    We are not responsible for accidental purchases or &quot;change of mind.&quot; Please double-check your order before confirming your payment.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4 text-white">4. Contact Us</h2>
                                <p className="text-[#a1a1b5] leading-relaxed">
                                    If you experience technical issues where you did not receive the tokens you purchased, please contact our support team immediately, and we will verify the transaction and manually credit your account if the payment was successful. This is not a refund, but a fulfillment of your purchase.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
