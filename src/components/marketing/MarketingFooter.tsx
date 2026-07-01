import Link from "next/link";
import { Sparkles } from "lucide-react";

/** Shared marketing footer with sitemap-style link columns. */

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/templates", label: "Templates" },
      { href: "/pricing", label: "Pricing" },
      { href: "/prompt-studio", label: "Prompt Studio" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-[#09090b]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-base font-bold text-zinc-100">
              <Sparkles size={18} className="text-[#6d5efc]" />
              Sbuild
            </Link>
            <p className="mt-3 max-w-xs text-sm text-zinc-500">
              Prompt to production-ready website in seconds. Design it visually, export clean code, launch anywhere.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex rounded-lg bg-[#6d5efc] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Start Building Free
            </Link>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-zinc-300">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-800/60 pt-6 text-sm text-zinc-600 sm:flex-row">
          <span>© {new Date().getFullYear()} Sbuild. All rights reserved.</span>
          <span>Built with Sbuild.</span>
        </div>
      </div>
    </footer>
  );
}
