import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "https://scriptgen.learn-made.in";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "ScriptGen refund policy. Eligibility and how to request a refund for token purchases.",
  openGraph: { url: `${siteUrl}/refund-policy`, title: "Refund Policy | ScriptGen" },
  alternates: { canonical: `${siteUrl}/refund-policy` },
};

export default function RefundPolicy() {
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
                                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                    Legal • Refunds
                                </span>
                                <h1 className="text-3xl font-bold text-slate-900 mt-3">Refund Policy</h1>
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

                            {/* Alert Box */}
                            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                <h2 className="text-lg font-semibold text-amber-900 mb-2 mt-0">
                                    Strict No-Refund Policy
                                </h2>
                                <p className="text-amber-800 text-sm mb-0">
                                    All sales are final. ScriptGen provides immediate access to digital goods and AI generation (scripts, SEO, chapters, B-roll, shorts, image prompts). We do not offer refunds or token recharges for any token package purchases under any circumstances.
                                </p>
                            </div>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">1. Digital Services</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    Our service provides instant access to AI-generated content. Once a generation is initiated or tokens are purchased, the computing resources are consumed immediately. Therefore, we cannot retrieve or &quot;un-use&quot; the service, making refunds impossible.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">2. Non-Tangible Irrevocable Goods</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    You agree that by purchasing tokens or services from us, you are purchasing non-tangible, irrevocable digital goods. You acknowledge that no refund will be issued for any transaction once it is completed.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">3. Accidental Purchases</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    We are not responsible for accidental purchases or &quot;change of mind.&quot; Please double-check your order before confirming your payment.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">4. Contact Us</h2>
                                <p className="text-slate-700 leading-relaxed">
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
