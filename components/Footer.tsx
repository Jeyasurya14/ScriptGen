import Link from "next/link";

const links = [
  { label: "Generate", href: "/generate" },
  { label: "Pricing", href: "/tokens" },
  { label: "Referral", href: "/referral" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-conditions" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-[10px] font-bold text-white">S</span>
          ScriptGen
          <span className="text-xs font-normal text-muted">— Built for Tamil creators</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-xs text-muted transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-hint">© {new Date().getFullYear()} ScriptGen</p>
      </div>
    </footer>
  );
}
