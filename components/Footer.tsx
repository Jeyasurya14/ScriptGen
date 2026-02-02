import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-slate-200 bg-slate-100 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <p className="text-slate-600 text-sm order-2 sm:order-1">
                        © {new Date().getFullYear()} ScriptGen. All rights reserved.
                    </p>
                    <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm order-1 sm:order-2" aria-label="Footer">
                        <Link
                            href="/privacy-policy"
                            className="text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms-conditions"
                            className="text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/refund-policy"
                            className="text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Refund Policy
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
