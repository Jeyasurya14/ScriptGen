import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t mt-12 py-8 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            © {new Date().getFullYear()} Thunglish Script Generator. All rights reserved.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <Link
                            href="/privacy-policy"
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms-conditions"
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/refund-policy"
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm"
                        >
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
