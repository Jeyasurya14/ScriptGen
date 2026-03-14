import Link from "next/link";

const footerLinks = [
  { label: "Generate", href: "/generate" },
  { label: "Pricing", href: "/tokens" },
  { label: "Referral", href: "/referral" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-conditions" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-head text-xl font-extrabold text-white">
                Script<span className="text-accent2">Gen</span>
              </span>
            </Link>
            <p className="max-w-md text-sm text-muted">
              AI YouTube scripting for Tamil creators, with Thanglish support, SEO packs, and
              production-ready outputs.
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-hint">Built with love for Tamil creators</p>
          </div>

          <div className="flex flex-wrap gap-4 md:justify-end">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-sm text-muted">
          <p>© {new Date().getFullYear()} ScriptGen. Built with ❤️ for Tamil Creators.</p>
        </div>
      </div>
    </footer>
  );
}
