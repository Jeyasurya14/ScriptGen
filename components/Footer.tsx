import Link from "next/link";
import { Youtube, Twitter, Mail } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Script Generator", href: "/app", badge: "New" },
    { label: "Offers", href: "/promo" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Writing Guide", href: "/blog/how-to-write-youtube-scripts" },
    { label: "AI Guide", href: "/blog/ai-script-generator-guide" },
    { label: "SEO Checklist", href: "/blog/youtube-seo-checklist" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-conditions" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Mail, href: "mailto:support@scriptgen.learn-made.in", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Link href="/" className="text-slate-900 font-semibold text-lg tracking-tight mb-4 inline-block">
                ScriptGen
              </Link>
              <p className="text-slate-600 text-sm leading-relaxed max-w-sm mb-8">
                AI-powered YouTube script generator. Professional, SEO-optimized scripts in English, Tamil, Thanglish, and Hindi.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-white transition-colors shadow-sm"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
              <div>
                <h4 className="text-overline mb-4">Product</h4>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        {link.label}
                        {link.badge && <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">New</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-overline mb-4">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-overline mb-4">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="py-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-500">© {new Date().getFullYear()} ScriptGen. All rights reserved.</p>
          <p className="text-xs font-medium text-slate-500">Payments secured. Data protected with industry-standard practices.</p>
        </div>
      </div>
    </footer>
  );
}
