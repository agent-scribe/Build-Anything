"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Globe,
  LayoutGrid,
  Monitor,
  Palette,
  ShoppingBag,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Wand2,
    title: "AI-Powered Generation",
    description:
      "Describe your business in plain English. Claude AI builds a complete, multi-page site with real copy, layout, and products.",
  },
  {
    icon: Palette,
    title: "Visual Editor",
    description:
      "Drag-and-drop sections, inline text editing, and an inspector panel. Full control without touching code.",
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce Built In",
    description:
      "Product catalogs, shopping cart, checkout flow, and Stripe integration. Sell online from day one.",
  },
  {
    icon: LayoutGrid,
    title: "2,001 Templates",
    description:
      "Browse templates across 19 categories. Fashion, SaaS, restaurants, portfolios — pick one and customize.",
  },
  {
    icon: Code2,
    title: "Clean Code Export",
    description:
      "Export as production-ready HTML, a Next.js project, or a ZIP. No lock-in, no proprietary formats.",
  },
  {
    icon: Monitor,
    title: "22 Section Types",
    description:
      "Hero, features, pricing, testimonials, gallery, team, blog, contact, comparison, timeline, and more.",
  },
];

const STEPS = [
  { num: "01", title: "Describe", text: "Tell WeBuild what you need in plain English." },
  { num: "02", title: "Generate", text: "AI creates a full site with content, layout, and theme." },
  { num: "03", title: "Customize", text: "Drag, drop, edit inline, tweak colors and fonts." },
  { num: "04", title: "Launch", text: "Export clean code and deploy anywhere." },
];

const TESTIMONIALS = [
  { quote: "I built my entire Shopify replacement in 20 minutes. The AI nailed my brand voice.", author: "Sarah K.", role: "E-commerce Founder" },
  { quote: "We used to spend $5K on landing pages. WeBuild does it in one prompt.", author: "Marcus T.", role: "Marketing Director" },
  { quote: "The template library is insane. 2,001 starting points and I always find something close.", author: "Priya R.", role: "Freelance Designer" },
  { quote: "Export as Next.js is a game changer. I get a real codebase, not some locked-in builder.", author: "Jake L.", role: "Full-Stack Developer" },
];

const TIERS = [
  {
    name: "Free",
    price: 0,
    features: ["3 projects", "5 AI generations/month", "HTML export", "Community support"],
    highlighted: false,
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: 19,
    features: [
      "Unlimited projects",
      "100 AI generations/month",
      "All export formats",
      "Custom domain",
      "Remove branding",
      "Priority support",
    ],
    highlighted: true,
    cta: "Start Pro Trial",
  },
  {
    name: "Studio",
    price: 49,
    features: [
      "Everything in Pro",
      "Unlimited AI generations",
      "AI image generation",
      "White-label reselling",
      "Team collaboration",
      "Dedicated support",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

const CATEGORIES = [
  "E-Commerce", "SaaS", "Portfolio", "Restaurant", "Health", "Real Estate",
  "Education", "Legal", "Finance", "Travel", "Automotive", "Beauty",
  "Nonprofit", "Sports", "Entertainment", "Construction", "Agriculture", "Pets", "Services",
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Sparkles size={20} className="text-[#6d5efc]" />
            WeBuild
          </Link>
          <div className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <a href="#features" className="transition-colors hover:text-zinc-100">Features</a>
            <a href="#templates" className="transition-colors hover:text-zinc-100">Templates</a>
            <Link href="/prompt-studio" className="transition-colors hover:text-zinc-100">Prompt Studio</Link>
            <a href="#pricing" className="transition-colors hover:text-zinc-100">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#6d5efc] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#6d5efc]/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6d5efc]/30 bg-[#6d5efc]/10 px-4 py-1.5 text-sm text-[#a99bff]">
            <Sparkles size={14} />
            2,001 templates &middot; 22 section types &middot; AI generation
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Prompt to website
            <br />
            <span className="bg-gradient-to-r from-[#6d5efc] to-[#a99bff] bg-clip-text text-transparent">
              in seconds
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl">
            Describe your business. AI generates a beautiful, editable, production-ready website or store.
            Customize visually. Export clean code. Launch.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#6d5efc]/25 transition-opacity hover:opacity-90"
            >
              Start Building Free
              <ArrowRight size={18} />
            </Link>
            <a
              href="#demo"
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-base font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              <Globe size={18} />
              See Live Demo
            </a>
          </div>
          <p className="mt-4 text-xs text-zinc-600">No credit card required. Free forever plan available.</p>
        </div>
      </section>

      {/* Demo embed */}
      <section id="demo" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0e0e11] shadow-2xl shadow-[#6d5efc]/5">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <div className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="ml-2 text-xs text-zinc-600">webuild-studio.netlify.app/dashboard</span>
          </div>
          <div className="relative aspect-video w-full bg-gradient-to-br from-[#0e0e11] to-[#141418]">
            <iframe
              src="/dashboard"
              title="WeBuild Live Demo"
              className="h-full w-full"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-40" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Four steps to launch
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-zinc-400">
          From idea to production-ready website in minutes, not weeks.
        </p>
        <div className="grid gap-8 md:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.num} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6d5efc]/10 text-lg font-bold text-[#a99bff]">
                {s.num}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-zinc-400">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
          Everything you need to build
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-zinc-400">
          A complete platform for creating, editing, and shipping websites and online stores.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-800 bg-[#141418] p-6 transition-colors hover:border-zinc-700"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#6d5efc]/10">
                <f.icon size={20} className="text-[#a99bff]" />
              </div>
              <h3 className="mb-2 text-base font-semibold">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="bg-[#0a0a0d] py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            2,001 templates, 19 categories
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-center text-zinc-400">
            Professional designs for every industry. Pick one, customize it, and launch.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="rounded-full border border-zinc-800 bg-[#141418] px-3 py-1.5 text-xs text-zinc-400"
              >
                {cat}
              </span>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Browse All Templates
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Loved by builders
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800 bg-[#141418] p-6"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-4 text-sm text-zinc-300 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="text-sm">
                <span className="font-medium text-zinc-100">{t.author}</span>
                <span className="text-zinc-500"> &mdash; {t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#0a0a0d] py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            Simple pricing
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-zinc-400">
            Start free. Upgrade when you need more power.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "flex flex-col rounded-2xl border p-6",
                  tier.highlighted
                    ? "border-[#6d5efc]/50 bg-[#6d5efc]/5 shadow-lg shadow-[#6d5efc]/10"
                    : "border-zinc-800 bg-[#141418]"
                )}
              >
                {tier.highlighted && (
                  <div className="mb-3 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#6d5efc]" />
                    <span className="text-xs font-medium text-[#a99bff]">Most Popular</span>
                  </div>
                )}
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  {tier.price > 0 && <span className="text-sm text-zinc-500">/month</span>}
                </div>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check size={15} className="mt-0.5 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={cn(
                    "mt-6 block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-opacity",
                    tier.highlighted
                      ? "bg-[#6d5efc] text-white hover:opacity-90"
                      : "border border-zinc-700 bg-zinc-800/50 text-zinc-200 hover:bg-zinc-700"
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prompt Studio CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-2xl border border-[#6d5efc]/20 bg-gradient-to-br from-[#6d5efc]/5 to-transparent p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#6d5efc]/10 px-3 py-1 text-xs text-[#a99bff] mb-4">
              <Sparkles size={12} />
              NEW
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">Prompt Studio</h2>
            <p className="mt-3 text-zinc-400 max-w-lg">
              Our AI Prompt Engineering Platform. Enter a rough idea, get a quality score,
              answer intelligent follow-up questions, and generate multiple optimized prompt
              versions. 8 rewrite modes, iterative refinement, multi-format export, and token cost calculator.
            </p>
            <Link
              href="/prompt-studio"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Try Prompt Studio
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="shrink-0 w-64 h-48 rounded-xl border border-zinc-800 bg-[#141418] flex items-center justify-center">
            <div className="text-center">
              <Wand2 size={32} className="mx-auto text-[#6d5efc] mb-2" />
              <p className="text-xs text-zinc-500">AI-Powered Prompt<br />Engineering Platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to build something amazing?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-zinc-400">
          Join thousands of founders, agencies, and freelancers using WeBuild to launch faster.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#6d5efc]/25 transition-opacity hover:opacity-90"
        >
          Start Building Free
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Sparkles size={14} className="text-[#6d5efc]" />
            <span>WeBuild</span>
            <span className="text-zinc-700">|</span>
            <span>2026 All rights reserved</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/pricing" className="hover:text-zinc-300">Pricing</Link>
            <Link href="/dashboard" className="hover:text-zinc-300">Dashboard</Link>
            <Link href="/prompt-studio" className="hover:text-zinc-300">Prompt Studio</Link>
            <Link href="/privacy" className="hover:text-zinc-300">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-300">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
