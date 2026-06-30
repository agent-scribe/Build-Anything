"use client";

import * as React from "react";
import { Check, Sparkles, Info } from "lucide-react";
import { useMockAuth } from "@/lib/mock-auth/context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const TIERS = [
  {
    id: "free" as const,
    name: "Free",
    price: 0,
    description: "Get started building",
    features: [
      "3 projects",
      "5 AI generations/month",
      "HTML export",
      "Community support",
    ],
    highlighted: false,
  },
  {
    id: "pro" as const,
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
    highlighted: true,
  },
  {
    id: "studio" as const,
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
    highlighted: false,
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
    <div className="min-h-screen bg-[#0b0b0e] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-4xl font-bold text-zinc-100">Simple, transparent pricing</h1>
          <p className="text-lg text-zinc-400">Start free. Upgrade when you need more power.</p>
        </div>

        {/* Demo note */}
        <div className="mx-auto mb-8 flex max-w-xl items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <Info size={16} className="mt-0.5 shrink-0 text-amber-400" />
          <div className="text-sm text-amber-300/80">
            <strong>Demo Mode:</strong> Plan upgrades are simulated locally. 
            The buyer connects Stripe with their price IDs to enable real billing. 
            See <code className="rounded bg-amber-500/10 px-1 text-amber-200">SETUP.md</code> for configuration details.
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
                  disabled={isCurrent}
                  className={cn(
                    "mt-6 w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity",
                    tier.highlighted
                      ? "bg-[#6d5efc] text-white hover:opacity-90"
                      : "border border-zinc-700 bg-zinc-800/50 text-zinc-200 hover:bg-zinc-700",
                    isCurrent && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isCurrent ? "Current Plan" : `Upgrade to ${tier.name}`}
                </button>
              </div>
            );
          })}
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
