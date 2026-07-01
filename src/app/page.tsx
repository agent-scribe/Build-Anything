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
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const METRICS = [
  { value: "10,000+", label: "Starter templates" },
  { value: "22", label: "Section types" },
  { value: "< 60s", label: "Idea to live site" },
  { value: "19", label: "Industries covered" },
];

const LOGOS = ["Northwind", "Lumen", "Faraday", "Kettle & Co.", "Vertex", "Bloom"];

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
    title: "10,000+ Templates",
    description:
      "Browse 10,001 templates across 19 categories. Fashion, SaaS, restaurants, portfolios — pick one and customize.",
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
  { quote: "I built my entire Shopify replacement in 20 minutes. The AI nailed my brand voice.", author: "Sarah K.", role: "E-commerce Founder", result: "Launched in 1 day" },
  { quote: "We used to spend $5K on landing pages. WeBuild does it in one prompt.", author: "Marcus T.", role: "Marketing Director", result: "Saved $5K / page" },
  { quote: "The template library is insane. 10,000+ starting points and I always find something close.", author: "Priya R.", role: "Freelance Designer", result: "3× faster delivery" },
  { quote: "Export as Next.js is a game changer. I get a real codebase, not some locked-in builder.", author: "Jake L.", role: "Full-Stack Developer", result: "Zero lock-in" },
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

const FAQS = [
  {
    q: "Do I need to know how to code?",
    a: "No. Describe what you want in plain English and WeBuild generates the whole site. Edit visually with drag-and-drop. Code export is there if you want it — never required.",
  },
  {
    q: "Can I export my site and host it anywhere?",
    a: "Yes. Export clean HTML, a full Next.js project, or a ZIP. No proprietary lock-in — deploy to Vercel, Netlify, or your own server.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan includes 3 projects and 5 AI generations a month, with HTML export. No credit card required to start.",
  },
  {
    q: "Can I sell products with WeBuild?",
    a: "Yes. E-commerce is built in — product catalogs, cart, and checkout. Connect your Stripe keys to take real payments.",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#6d5efc]/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#6d5efc]/30 bg-[#6d5efc]/10 px-4 py-1.5 text-sm text-[#a99bff]">
            <Sparkles size={14} />
            10,000+ templates &middot; 22 section types &middot; AI generation
          </div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Launch a high-converting
            <br />
            website{" "}
            <span className="bg-gradient-to-r from-[#6d5efc] to-[#a99bff] bg-clip-text text-transparent">
              from one prompt
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl">
            WeBuild turns a plain-English description into a beautiful, editable, production-ready
            website or online store — for founders, agencies, and freelancers who need to ship fast.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#6d5efc]/25 transition-opacity hover:opacity-90 sm:w-auto"
            >
              Start Building Free
              <ArrowRight size={18} />
            </Link>
            <a
              href="#demo"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-base font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white sm:w-auto"
            >
              <Globe size={18} />
              See Live Demo
            </a>
          </div>
          <p className="mt-4 text-xs text-zinc-600">No credit card required. Free forever plan available.</p>
        </div>

        {/* Metrics band */}
        <div className="relative mx-auto mt-14 max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-800 md:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="bg-[#0e0e11] px-4 py-6 text-center">
                <div className="text-2xl font-bold text-zinc-100 md:text-3xl">{m.value}</div>
                <div className="mt-1 text-xs text-zinc-500">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logos / social proof */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <p className="text-center text-xs uppercase tracking-widest text-zinc-600">
          Trusted by builders shipping for teams like
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {LOGOS.map((name) => (
            <span key={name} className="text-lg font-semibold text-zinc-600 transition-colors hover:text-zinc-400">
              {name}
            </span>
          ))}
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
        <div className="mt-10 text-center">
          <Link href="/features" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a99bff] hover:text-white">
            Explore all features
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="bg-[#0a0a0d] py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
            10,000+ templates, 19 categories
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
              href="/templates"
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
              className="flex flex-col rounded-2xl border border-zinc-800 bg-[#141418] p-6"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mb-4 flex-1 text-sm italic text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 text-sm">
                <span>
                  <span className="font-medium text-zinc-100">{t.author}</span>
                  <span className="text-zinc-500"> &mdash; {t.role}</span>
                </span>
                <span className="rounded-full bg-[#6d5efc]/10 px-2.5 py-1 text-xs font-medium text-[#a99bff]">
                  {t.result}
                </span>
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
                  href="/pricing"
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
          <div className="mt-8 text-center">
            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a99bff] hover:text-white">
              Compare plans in detail
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Prompt Studio CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-[#6d5efc]/20 bg-gradient-to-br from-[#6d5efc]/5 to-transparent p-8 md:flex-row md:p-12">
          <div className="flex-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#6d5efc]/10 px-3 py-1 text-xs text-[#a99bff]">
              <Sparkles size={12} />
              NEW
            </div>
            <h2 className="text-2xl font-bold md:text-3xl">Prompt Studio</h2>
            <p className="mt-3 max-w-lg text-zinc-400">
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
          <div className="flex h-48 w-64 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-[#141418]">
            <div className="text-center">
              <Wand2 size={32} className="mx-auto mb-2 text-[#6d5efc]" />
              <p className="text-xs text-zinc-500">AI-Powered Prompt<br />Engineering Platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">Common questions</h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-zinc-400">
          Everything you need to know before you start. More on the full FAQ.
        </p>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/faq" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a99bff] hover:text-white">
            Read the full FAQ
            <ArrowRight size={15} />
          </Link>
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

/* ------------------------------------------------------------------ */
/* Local components                                                    */
/* ------------------------------------------------------------------ */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#141418]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-zinc-100">{q}</span>
        {open ? <Minus size={16} className="shrink-0 text-zinc-500" /> : <Plus size={16} className="shrink-0 text-zinc-500" />}
      </button>
      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-400">{a}</p>}
    </div>
  );
}
