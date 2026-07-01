"use client";

import * as React from "react";
import { Info, X } from "lucide-react";

/**
 * BuyerBanner — Persistent top banner for Flippa buyers.
 * Shows MVP status and what needs real keys.
 * Dismissible via localStorage.
 */
export function BuyerBanner() {
  const [dismissed, setDismissed] = React.useState(true);

  React.useEffect(() => {
    setDismissed(localStorage.getItem("wb_buyer_banner") === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 border-b border-indigo-500/30 px-4 py-2.5 text-xs text-indigo-200">
      <Info size={14} className="shrink-0 text-indigo-400" />
      <p className="flex-1">
        <strong className="text-indigo-100">MVP Demo Mode</strong> — Auth, payments, and collaboration are simulated locally.
        See <code className="rounded bg-indigo-500/20 px-1 py-0.5 font-mono text-[10px]">SETUP.md</code> to connect
        Stripe, NextAuth, a database, and your Anthropic API key for production.
      </p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("wb_buyer_banner", "1");
          setDismissed(true);
        }}
        className="shrink-0 rounded p-1 hover:bg-indigo-500/20"
      >
        <X size={12} />
      </button>
    </div>
  );
}
