"use client";

import * as React from "react";
import { Minus, Plus, ShoppingCart, Trash2, X, Info } from "lucide-react";
import { useCart, formatMoney } from "@/lib/ecommerce/cart";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const lines = useCart((s) => s.lines);
  const isOpen = useCart((s) => s.isOpen);
  const setOpen = useCart((s) => s.setOpen);
  const remove = useCart((s) => s.remove);
  const setQuantity = useCart((s) => s.setQuantity);
  const { count, subtotal, currency } = useCart((s) => s.totals());
  const router = useRouter();

  function handleCheckout() {
    setOpen(false);
    router.push("/checkout/success");
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-800 bg-[#0e0e11]">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#6d5efc]" />
            <h2 className="text-lg font-semibold text-zinc-100">Cart ({count})</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <ShoppingCart size={40} className="mb-3 opacity-40" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-3 rounded-xl border border-zinc-800 bg-[#141418] p-3">
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-100">{line.name}</p>
                      <p className="text-sm text-[#6d5efc]">{formatMoney(line.price, line.currency)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setQuantity(line.productId, line.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 hover:text-zinc-200">
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm text-zinc-200">{line.quantity}</span>
                      <button type="button" onClick={() => setQuantity(line.productId, line.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 hover:text-zinc-200">
                        <Plus size={12} />
                      </button>
                      <button type="button" onClick={() => remove(line.productId)} className="ml-auto rounded-md p-1 text-zinc-600 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-zinc-800 p-5">
            {/* Demo note */}
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
              <Info size={12} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-[10px] text-amber-300/80">
                <strong>Demo:</strong> This simulates checkout. A buyer connects their Stripe keys for real payments.
              </p>
            </div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total</span>
              <span className="text-lg font-semibold text-zinc-100">{formatMoney(subtotal, currency)}</span>
            </div>
            <button type="button" onClick={handleCheckout} className="w-full rounded-xl bg-[#6d5efc] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              Checkout (Demo)
            </button>
          </div>
        )}
      </div>
    </>
  );
}
