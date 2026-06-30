"use client";

import { CheckCircle, Info } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/ecommerce/cart";
import * as React from "react";

export default function CheckoutSuccessPage() {
  const clear = useCart((s) => s.clear);
  React.useEffect(() => { clear(); }, [clear]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0e]">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#141418] p-8 text-center">
        <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold text-zinc-100">Order Confirmed!</h1>
        <p className="mb-4 text-sm text-zinc-400">
          Thank you for your purchase. You&apos;ll receive a confirmation email shortly.
        </p>
        
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-left">
          <Info size={14} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-xs text-amber-300/80">
            <strong>Demo Mode:</strong> No real payment was processed. 
            When Stripe keys are configured, this will process real transactions.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-[#6d5efc] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
