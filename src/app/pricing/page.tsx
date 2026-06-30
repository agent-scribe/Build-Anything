"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Get started building",
    features: [
      "3 projects",
      "5 AI generations/month",
      "HTML export",
      "Community support",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    description: "For serious builders",
    features: [
      "Unlimited projects",
      "100 AI generations/month",
      "All export formats",
      "Custom domain",
      "Remove branding",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: 49,
    description: "For agencies & resellers",
    features: [
      "Everything in Pro",
      "Unlimited AI generations",
      "AI image generation",
      "White-label reselling",
      "Team collaboration",
      "Dedicated support",
    ],
    cta: "Upgrade to Studio",
    highlighted: false,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState<string | null>(null);

  async function handleUpgrade(tierId: string) {
    if (tierId === "free") return;
    setLoading(tierId);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: tierId === "pro" ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID : process.env.NEXT_PUBLIC_STRIPE_STUDIO_PRICE_ID }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold text-zinc-100">Simple, transparent pricing</h1>
          <p className="text-lg text-zinc-400">Start free. Upgrade when you need more power.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((tier) => (
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

              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check size={15} className="mt-0.5 shrink-0 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleUpgrade(tier.id)}
                disabled={tier.id === "free" || loading !== null}
                className={cn(
                  "mt-6 w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity",
                  tier.highlighted
                    ? "bg-[#6d5efc] text-white hover:opacity-90"
                    : "border border-zinc-700 bg-zinc-800/50 text-zinc-200 hover:bg-zinc-700",
                  (tier.id === "free" || loading !== null) && "opacity-50 cursor-not-allowed",
                )}
              >
                {loading === tier.id ? "Redirecting…" : tier.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
