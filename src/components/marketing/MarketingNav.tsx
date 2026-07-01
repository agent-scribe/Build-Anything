"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Shared marketing navigation used across all public pages.
 * Single source of truth for links + mobile menu so the header is
 * consistent everywhere (previously each page rolled its own nav).
 */

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/prompt-studio", label: "Prompt Studio" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function MarketingNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-zinc-100">
          <Sparkles size={20} className="text-[#6d5efc]" />
          Sbuild
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "transition-colors hover:text-zinc-100",
                pathname === l.href && "text-zinc-100",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/contact" className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">
            Contact
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#6d5efc] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800/60 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-zinc-800/60 bg-[#09090b] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/60"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/60">
              Contact
            </Link>
            <Link
              href="/dashboard"
              className="mt-2 rounded-lg bg-[#6d5efc] px-3 py-2.5 text-center text-sm font-semibold text-white hover:opacity-90"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
