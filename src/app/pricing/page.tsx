"use client";

import * as React from "react";
import { ArrowRight, Check, Info, Minus, Plus, Sparkles } from "lucide-react";
import { useMockAuth } from "@/lib/mock-auth/context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

const TIERS = [
  {
    id: "free" as const,
    name: "Free",
    price: 0,
    description: "Try Sbuild, no card needed",
    bestFor: "Side projects & first drafts",
    features: [
      "3 projects",
      "5 AI generations/month",
      "HTML export",
      "Community support",
    ],
    notIncluded: ["Custom domain", "Remove Sbuild branding"],
    highlighted: false,
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: 19,
    description: "For serious builders shipping real sites",
    bestFor: "Founders & freelancers",
    features: [
      "Unlimited projects",
      "100 AI generations/month",
      "All export formats (HTML, Next.js, ZIP)",
      "Custom domain",
      "Remove branding",
      "Priority support",
    ],
    notIncluded: ["White-label reselling"],
    highlighted: true,
  },
  {
    id: "studio" as const,
    name: "Studio",
    price: 49,
    description: "For agencies & resellers at scale",
    bestFor: "Agencies & teams",
    features: [
      "Everything in Pro",
      "Unlimited AI generations",
      "AI image generation",
      "White-label reselling",
      "Team collaboration",
      "Dedicated support",
    ],
    notIncluded: [],
    highlighted: false,
  },
];

const PRICING_FAQS = [
  {
    q: "Can I change plans later?",
    a: "Yes — upgrade, downgrade, or cancel anytime. Changes apply at your next billing cycle and nothing is locked in.",
  },
  {
    q: "What counts as an AI generation?",
    a: "One generation is one full site build from a prompt. Editing, dragging, and inline text changes are unlimited on every plan.",
  },
  {
    q: "Do you take a cut of my sales?",
    a: "No. Sbuild never touches your revenue. You only pay standard Stripe processing fees on your own store.",
  },
  {
    q: "Is there a discount for annual billing?",
    a: "Annual billing is coming soon and will save roughly two months versus monthly. Contact us if you'd like it now.",
  },
];

export default function PricingPage() {
  const { user, upgradePlan } = useMockAuth();
  const router = useRouter();

  function handleUpgrade(tierId: "free" | "pro" | "studio") {
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    upgradePlan(tierId);
    router.push("/dashboard?upgraded=true");
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      <MarketingNav />

      <div className="mx-auto max-w-5xl px-4 pt-32 pb-20">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold md:text-5xl">Simple, transparent pricing</h1>
          <p className="text-lg text-zinc-400">Start free. Upgrade only when you need more power. Cancel anytime.</p>
        </div>

        {/* Demo note */}
        <div className="mx-auto mb-10 flex max-w-xl items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <Info size={16} className="mt-0.5 shrink-0 text-amber-400" />
          <div className="text-sm text-amber-300/80">
            <strong>Demo Mode:</strong> Plan upgrades are simulated locally. The buyer connects Stripe
            with their price IDs to enable real billing. See{" "}
            <code className="rounded bg-amber-500/10 px-1 text-amber-200">SETUP.md</code> for configuration details.
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => {
            const isCurrent = user?.plan === tier.id;
            return (
              <div
                key={tier.id}
                className={cn(
                  "flex flex-col rounded-2xl border p-6",
                  tier.highlighted
                    ? "border-[#6d5efc]/50 bg-[#6d5efc]/5 shadow-lg shadow-[#6d5efc]/10"
                    : "border-zinc-800 bg-[#141418]",
                )}
              >
                {tier.highlighted && (
                  <div className="mb-3 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#6d5efc]" />
                    <span className="text-xs font-medium text-[#a99bff]">Most Popular</span>
                  </div>
                )}
                <h2 className="text-xl font-bold text-zinc-100">{tier.name}</h2>
                <p className="mt-1 text-sm text-zinc-500">{tier.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-zinc-100">${tier.price}</span>
                  {tier.price > 0 && <span className="text-sm text-zinc-500">/month</span>}
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-600">
                  Best for {tier.bestFor}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check size={15} className="mt-0.5 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                  {tier.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
                      <Minus size={15} className="mt-0.5 shrink-0 text-zinc-700" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={isCurrent}
                  className={cn(
                    "mt-6 w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity",
                    tier.highlighted
                      ? "bg-[#6d5efc] text-white hover:opacity-90"
                      : "border border-zinc-700 bg-zinc-800/50 text-zinc-200 hover:bg-zinc-700",
                    isCurrent && "cursor-not-allowed opacity-50",
                  )}
                >
                  {isCurrent ? "Current Plan" : tier.price === 0 ? "Start Free" : `Upgrade to ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Reassurance row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
          <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> No credit card to start</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> Cancel anytime</span>
          <span className="flex items-center gap-1.5"><Check size={14} className="text-green-500" /> Export &amp; own your code</span>
        </div>

        {/* Pricing FAQ */}
        <div className="mx-auto mt-20 max-w-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">Pricing questions</h2>
          <div className="space-y-3">
            {PRICING_FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Have another question?{" "}
            <Link href="/faq" className="text-[#a99bff] hover:text-white">See the full FAQ</Link> or{" "}
            <Link href="/contact" className="text-[#a99bff] hover:text-white">contact us</Link>.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#6d5efc]/25 transition-opacity hover:opacity-90"
          >
            Start Building Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

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
