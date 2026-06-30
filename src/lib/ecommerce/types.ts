import type { Product } from "@/lib/schema/page-schema";

/** A line item snapshots price/name so the cart is stable even if the catalog changes. */
export interface CartLine {
  productId: string;
  name: string;
  price: number;
  currency: string;
  imageAlt: string;
  quantity: number;
}

export interface CartTotals {
  count: number;
  subtotal: number;
  currency: string;
}

export function lineFromProduct(product: Product, quantity = 1): CartLine {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency,
    imageAlt: product.image.alt,
    quantity,
  };
}
