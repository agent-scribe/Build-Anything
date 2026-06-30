"use client";

import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Download,
  Edit3,
  Globe,
  GripVertical,
  Layers,
  LayoutGrid,
  Monitor,
  MousePointerClick,
  Palette,
  ShoppingBag,
  Sparkles,
  Type,
  Wand2,
  Zap,
} from "lucide-react";

const SECTIONS = [
  {
    title: "AI-Powered Generation",
    description:
      "Type a prompt like 'a premium sneaker store with dark theme' and watch Claude AI build a complete, multi-page site with real copy, products, and a cohesive design system.",
    icon: Wand2,
    items: [
      "Natural language prompts",
      "Multi-page site generation",
      "Industry-aware AI copy",
      "Automatic product catalogs",
      "Smart theme selection",
      "SSE streaming — watch it build in real time",
    ],
  },
  {
    title: "Visual Drag-and-Drop Editor",
    description:
      "Rearrange sections by dragging, edit text inline on the canvas, and fine-tune every property in the inspector panel. No code required.",
    icon: GripVertical,
    items: [
      "Drag-and-drop section reorder",
      "Inline text editing on canvas",
      "Inspector panel for all props",
      "Undo / redo with keyboard shortcuts",
      "Desktop, tablet, mobile preview",
      "Add, duplicate, or remove sections",
    ],
  },
  {
    title: "22 Section Types",
    description:
      "Every building block you need — from hero and pricing to gallery, blog, timeline, comparison tables, and more.",
    icon: Layers,
    items: [
      "Navbar, Hero, Footer",
      "Features, Pricing, FAQ",
      "Testimonials, Stats, Logos",
      "Gallery, Team, Blog, Contact",
      "Comparison, Timeline, Video",
      "Banner, Portfolio, Metrics, CTA",
    ],
  },
  {
    title: "2,001 Starter Templates",
    description:
      "Browse a curated library across 19 categories. E-commerce, SaaS, restaurants, portfolios, health, legal, finance, and more. One click to load.",
    icon: LayoutGrid,
    items: [
      "501 e-commerce store templates",
      "500 website templates",
      "19 industry categories",
      "11 visual style presets",
      "Search and filter by category",
      "Instant load into editor",
    ],
  },
  {
    title: "E-Commerce Ready",
    description:
      "Full storefront capabilities built in — product catalogs, shopping cart, checkout, and Stripe integration.",
    icon: ShoppingBag,
    items: [
      "Product grid with variants",
      "Shopping cart drawer",
      "Stripe checkout integration",
      "Order confirmation flow",
      "Subscription tiers",
      "Buyer-ready — plug in your Stripe keys",
    ],
  },
  {
    title: "Export Clean Code",
    description:
      "No lock-in. Export your site as a standalone HTML page, a full Next.js project, or a ZIP file ready to deploy.",
    icon: Download,
    items: [
      "Single-file HTML export",
      "Full Next.js project export",
      "ZIP download",
      "Clean, readable code output",
      "All assets included",
      "Deploy to Vercel, Netlify, or anywhere",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Sparkles size={20} className="text-[#6d5efc]" />
            WeBuild
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">Home</Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#6d5efc] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-16 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Features</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
          Everything you need to go from idea to live website — powered by AI.
        </p>
      </section>

      {/* Feature sections */}
      <div className="mx-auto max-w-4xl px-4 pb-24 space-y-20">
        {SECTIONS.map((sec, i) => (
          <section
            key={sec.title}
            className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12"
          >
            <div className="flex-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6d5efc]/10">
                <sec.icon size={24} className="text-[#a99bff]" />
              </div>
              <h2 className="mb-3 text-2xl font-bold">{sec.title}</h2>
              <p className="mb-6 text-zinc-400">{sec.description}</p>
              <ul className="space-y-2">
                {sec.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Zap size={12} className="shrink-0 text-[#6d5efc]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex h-52 w-full items-center justify-center rounded-2xl border border-zinc-800 bg-[#141418] md:w-80">
              <sec.icon size={48} className="text-zinc-800" />
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="border-t border-zinc-800 py-20 text-center">
        <h2 className="text-3xl font-bold">Ready to build?</h2>
        <p className="mx-auto mt-3 max-w-md text-zinc-400">
          Start free — no credit card required.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Open Dashboard
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
