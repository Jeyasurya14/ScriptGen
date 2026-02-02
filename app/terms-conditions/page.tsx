import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TermsConditions() {
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
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Terms and Conditions</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-slate-800 dark:prose-h2:text-slate-100">
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;) and Thunglish Script Generator (&quot;we,&quot; &quot;us&quot; or &quot;our&quot;), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the &quot;Site&quot;).
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">2. Intellectual Property Rights</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the &quot;Content&quot;) and the trademarks, service marks, and logos contained therein (the &quot;Marks&quot;) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">3. User Representations</h2>
                                <p className="text-slate-600 dark:text-slate-300 mb-3">By using the Site, you represent and warrant that:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                                    <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                    <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                    <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                                    <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">4. Prohibited Activities</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">5. Generated Content</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    You retain all rights to the scripts and content generated using our service. We claim no ownership over the output you generate. However, you are responsible for ensuring that your use of the generated content complies with all applicable laws and regulations.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
