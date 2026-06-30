"use client";

import { CheckCircle } from "lucide-react";
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
        <p className="mb-6 text-sm text-zinc-400">Thank you for your purchase. You&apos;ll receive a confirmation email shortly.</p>
        <Link href="/" className="inline-block rounded-xl bg-[#6d5efc] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
          Back to Store
        </Link>
      </div>
    </div>
  );
}
