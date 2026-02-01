import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header Navigation */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                </div>

                {/* Main Content Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-zinc-800 px-8 py-6 bg-slate-50/50 dark:bg-zinc-900/50">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Refund Policy</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-slate-800 dark:prose-h2:text-slate-100">

                            {/* Alert Box */}
                            <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2 mt-0">
                                    Strict No-Refund Policy
                                </h2>
                                <p className="text-amber-800 dark:text-amber-300 text-sm mb-0">
                                    All sales are final. Because Thunglish Script Generator offers immediate access to digital goods and AI generation services, we do not offer refunds or credits for any purchases under any circumstances.
                                </p>
                            </div>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">1. Digital Services</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Our service provides instant access to AI-generated content. Once a generation is initiated or credits are purchased, the computing resources are consumed immediately. Therefore, we cannot retrieve or "un-use" the service, making refunds impossible.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">2. Non-Tangible Irrevocable Goods</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    You agree that by purchasing credits or services from us, you are purchasing non-tangible, irrevocable digital goods. You acknowledge that no refund will be issued for any transaction once it is completed.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">3. Accidental Purchases</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    We are not responsible for accidental purchases or "change of mind." Please double-check your order before confirming your payment.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">4. Contact Us</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    If you experience technical issues where you did not receive the credits you purchased, please contact our support team immediately, and we will verify the transaction and manually credit your account if the payment was successful. This is not a refund, but a fulfillment of your purchase.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
