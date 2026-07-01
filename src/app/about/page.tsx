import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Code2, Heart, Zap } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "About",
  description:
    "WeBuild is on a mission to make world-class web design accessible to everyone. Meet the studio behind the AI website generator.",
};

const VALUES = [
  {
    icon: Zap,
    title: "Speed without compromise",
    body: "Shipping fast shouldn't mean shipping ugly. Every generated site starts from a designer-grade system.",
  },
  {
    icon: Code2,
    title: "No lock-in, ever",
    body: "Your site is yours. Export clean HTML or a real Next.js codebase and host it anywhere you like.",
  },
  {
    icon: Compass,
    title: "Conversion-first",
    body: "We obsess over the details that move the needle — hierarchy, clarity, CTAs, and trust signals.",
  },
  {
    icon: Heart,
    title: "Built for builders",
    body: "Founders, agencies, and freelancers. We build the tool we always wished we had.",
  },
];

const METRICS = [
  { value: "10,000+", label: "Templates crafted" },
  { value: "22", label: "Section types" },
  { value: "19", label: "Industries" },
  { value: "100%", label: "Code ownership" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#6d5efc]/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Great web design, <span className="bg-gradient-to-r from-[#6d5efc] to-[#a99bff] bg-clip-text text-transparent">for everyone</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            WeBuild started with a simple frustration: a beautiful, high-converting website took weeks
            and thousands of dollars — or a template that looked like everyone else&apos;s. We thought AI
            could close that gap without cutting corners. So we built it.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 md:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-[#0e0e11] px-4 py-6 text-center">
              <div className="text-2xl font-bold md:text-3xl">{m.value}</div>
              <div className="mt-1 text-xs text-zinc-500">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-2xl font-bold md:text-3xl">Our story</h2>
        <div className="mt-6 space-y-4 text-zinc-400">
          <p>
            We&apos;re a small studio of designers and engineers who spent years building marketing sites
            and storefronts for startups. The same pattern repeated on every project: the hard part
            wasn&apos;t the code, it was translating a founder&apos;s idea into a clear, credible, converting page.
          </p>
          <p>
            WeBuild encodes that translation. Describe your business and the AI produces a complete,
            multi-page site with real copy, a coherent design system, and the sections that actually
            drive action. Then you take over in a visual editor — no code required, full control if you
            want it.
          </p>
          <p>
            We believe tools should give you leverage, not lock you in. That&apos;s why every project exports
            to clean, standard code you own outright. Build with us, then take it anywhere.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">What we stand for</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-zinc-800 bg-[#141418] p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#6d5efc]/10">
                <v.icon size={20} className="text-[#a99bff]" />
              </div>
              <h3 className="text-base font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Build with us</h2>
        <p className="mx-auto mt-4 max-w-lg text-zinc-400">
          Start free today, or reach out if you want to talk through a bigger project.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#6d5efc]/25 transition-opacity hover:opacity-90"
          >
            Start Building Free
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-8 py-3.5 text-base font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            Talk to us
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
