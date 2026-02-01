import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
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
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="px-8 py-8">
                        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-slate-800 dark:prose-h2:text-slate-100 prose-a:text-blue-600">
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Welcome to Thunglish Script Generator ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">2. Data We Collect</h2>
                                <p className="text-slate-600 dark:text-slate-300 mb-3">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                                    <li><strong className="text-slate-900 dark:text-white">Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                    <li><strong className="text-slate-900 dark:text-white">Contact Data</strong> includes email address.</li>
                                    <li><strong className="text-slate-900 dark:text-white">Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                                    <li><strong className="text-slate-900 dark:text-white">Usage Data</strong> includes information about how you use our website, products and services (including generated scripts).</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">3. How We Use Your Data</h2>
                                <p className="text-slate-600 dark:text-slate-300 mb-3">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-4">5. Third-Party Links</h2>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
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
