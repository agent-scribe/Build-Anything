/**
 * cart.ts — built-in e-commerce cart state (Zustand + persist).
 * ------------------------------------------------------------------
 * Generated storefronts get a working cart for free. The cart stores
 * snapshotted line items so it survives catalog edits and regeneration.
 */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/schema/page-schema";
import { lineFromProduct, type CartLine, type CartTotals } from "./types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;

  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;

  totals: () => CartTotals;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id);
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((l) =>
                l.productId === product.id ? { ...l, quantity: l.quantity + quantity } : l
              ),
            };
          }
          return { isOpen: true, lines: [...state.lines, lineFromProduct(product, quantity)] };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
        })),

      remove: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),

      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ isOpen: open }),

      totals: (): CartTotals => {
        const lines = get().lines;
        const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
        const count = lines.reduce((sum, l) => sum + l.quantity, 0);
        return {
          count,
          subtotal: Math.round(subtotal * 100) / 100,
          currency: lines[0]?.currency ?? "USD",
        };
      },
    }),
    { name: "webuild-cart" }
  )
);

/** Format a money amount in the cart's currency. */
export function formatMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}
