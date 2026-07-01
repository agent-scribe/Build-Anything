import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Code2,
  Download,
  GripVertical,
  Layers,
  LayoutGrid,
  Rocket,
  ShoppingBag,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "Features",
  description:
    "AI generation, a visual editor, 22 section types, 7,000+ templates, built-in e-commerce, and clean code export — everything you need to ship a high-converting site.",
};

const AUDIENCES = [
  { icon: Rocket, title: "Founders", body: "Launch a credible marketing site or store before you hire a designer." },
  { icon: Briefcase, title: "Agencies", body: "Spin up client sites in minutes and white-label the whole thing." },
  { icon: Users, title: "Freelancers", body: "Deliver 3× faster with a real codebase you can hand off or host." },
];

const SECTIONS = [
  {
    title: "AI-Powered Generation",
    outcome: "Go from a sentence to a full multi-page site.",
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
    outcome: "Full creative control, zero code required.",
    description:
      "Rearrange sections by dragging, edit text inline on the canvas, and fine-tune every property in the inspector panel.",
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
    outcome: "Every building block a converting page needs.",
    description:
      "From hero and pricing to gallery, blog, timeline, comparison tables, and more — assemble any layout.",
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
    title: "7,000+ Starter Templates",
    outcome: "Never start from a blank page.",
    description:
      "Browse a curated library across 19 categories — e-commerce, SaaS, restaurants, portfolios, health, legal, finance, and more. One click to load.",
    icon: LayoutGrid,
    items: [
      "2,801 e-commerce store templates",
      "4,200 website templates",
      "19 industry categories",
      "11 visual style presets",
      "Search and filter by category",
      "Instant load into editor",
    ],
  },
  {
    title: "E-Commerce Ready",
    outcome: "Sell online from day one.",
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
    outcome: "Own your site. No lock-in.",
    description:
      "Export your site as a standalone HTML page, a full Next.js project, or a ZIP file ready to deploy.",
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
      <MarketingNav />

      {/* Header */}
      <section className="pt-32 pb-12 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Everything you need to ship</h1>
        <p className="mx-auto mt-4 max-w-xl px-4 text-lg text-zinc-400">
          One platform to generate, design, and launch a high-converting website or store —
          powered by AI, owned by you.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start Building Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-5xl px-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="rounded-2xl border border-zinc-800 bg-[#141418] p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#6d5efc]/10">
                <a.icon size={18} className="text-[#a99bff]" />
              </div>
              <h3 className="text-sm font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-zinc-400">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature sections */}
      <div className="mx-auto max-w-4xl space-y-20 px-4 py-16">
        {SECTIONS.map((sec) => (
          <section key={sec.title} className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            <div className="flex-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6d5efc]/10">
                <sec.icon size={24} className="text-[#a99bff]" />
              </div>
              <p className="mb-1 text-sm font-medium text-[#a99bff]">{sec.outcome}</p>
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
        <p className="mx-auto mt-3 max-w-md px-4 text-zinc-400">
          Start free — no credit card required. Upgrade only when you need more.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Open Dashboard
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            See pricing
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
