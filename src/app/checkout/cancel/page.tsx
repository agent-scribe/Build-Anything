"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0e]">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#141418] p-8 text-center">
        <XCircle size={48} className="mx-auto mb-4 text-amber-500" />
        <h1 className="mb-2 text-2xl font-bold text-zinc-100">Checkout Cancelled</h1>
        <p className="mb-6 text-sm text-zinc-400">
          Your cart is still saved. Come back when you&apos;re ready!
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-[#6d5efc] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
