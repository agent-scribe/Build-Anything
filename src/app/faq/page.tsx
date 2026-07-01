"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

const GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "Do I need to know how to code?",
        a: "No. Describe your business in plain English and Sbuild generates the entire site. You edit visually with drag-and-drop and inline text editing. Code is available on export but never required.",
      },
      {
        q: "How long does it take to build a site?",
        a: "Most people go from prompt to a full, editable site in under a minute. Refining copy and styling to taste usually takes another 10–20 minutes.",
      },
      {
        q: "What do I get for free?",
        a: "The Free plan includes 3 projects, 5 AI generations per month, and HTML export. No credit card required to start.",
      },
    ],
  },
  {
    title: "Ownership & export",
    items: [
      {
        q: "Can I export my site and host it elsewhere?",
        a: "Yes. Export clean single-file HTML, a full Next.js project, or a ZIP. Deploy to Vercel, Netlify, or your own server. There's no proprietary format and no lock-in.",
      },
      {
        q: "Do I own the code and content?",
        a: "100%. Everything Sbuild generates is yours to use, modify, and ship however you like.",
      },
    ],
  },
  {
    title: "E-commerce & payments",
    items: [
      {
        q: "Can I sell products?",
        a: "Yes. E-commerce is built in — product catalogs, a cart drawer, and a checkout flow. Connect your Stripe keys to accept real payments.",
      },
      {
        q: "Are there transaction fees from Sbuild?",
        a: "No. Sbuild doesn't take a cut of your sales. You only pay your normal Stripe processing fees.",
      },
    ],
  },
  {
    title: "Plans & billing",
    items: [
      {
        q: "Can I change or cancel my plan anytime?",
        a: "Yes. Upgrade, downgrade, or cancel whenever you want. Changes take effect at the start of your next billing cycle.",
      },
      {
        q: "Do you offer plans for agencies?",
        a: "The Studio plan includes white-label reselling and team collaboration. For volume or custom needs, reach out via the contact page.",
      },
      {
        q: "What if Sbuild isn't right for me?",
        a: "Start on the free plan to try it risk-free. If a paid plan doesn't fit, downgrade any time — no long-term contract.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      <MarketingNav />

      <section className="mx-auto max-w-3xl px-4 pt-32 pb-12 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Frequently asked questions</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
          Everything you need to know before you start. Can&apos;t find an answer?{" "}
          <Link href="/contact" className="text-[#a99bff] underline underline-offset-2 hover:text-white">
            Get in touch.
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <div className="space-y-10">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">
                {group.title}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-[#6d5efc]/20 bg-gradient-to-br from-[#6d5efc]/5 to-transparent p-8 text-center">
          <h2 className="text-2xl font-bold">Still have questions?</h2>
          <p className="mx-auto mt-2 max-w-md text-zinc-400">
            Start free — no credit card — or send us a message and we&apos;ll help you decide.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Start Building Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

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
