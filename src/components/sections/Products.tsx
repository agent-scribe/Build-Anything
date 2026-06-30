"use client";

import type { Product, SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { useCart, formatMoney } from "@/lib/ecommerce/cart";
import { HeadingBlock, ImagePlaceholder, SectionShell } from "./_shared";

const COLS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function Products({
  section,
  document,
}: {
  section: SectionOf<"products">;
  document: SiteDocument;
}) {
  const { title, subtitle, columns, productIds } = section.props;
  const add = useCart((s) => s.add);

  const products: Product[] = productIds.length
    ? productIds.map((id) => document.products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p))
    : document.products;

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div className={`grid gap-6 ${COLS[columns ?? 3]}`}>
        {products.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-[var(--wb-radius)]"
            style={{ background: "var(--wb-card)", border: "1px solid var(--wb-border)" }}
          >
            <div className="relative">
              <ImagePlaceholder src={product.image.src} alt={product.image.alt} ratio="aspect-square" className="!rounded-none" />
              {product.badge ? (
                <span
                  className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ background: "var(--wb-primary)", color: "var(--wb-primary-fg)" }}
                >
                  {product.badge}
                </span>
              ) : null}
            </div>
            <div className="p-4">
              <h3 className="text-base font-medium" style={{ fontFamily: "var(--wb-font-heading)" }}>
                {product.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm" style={{ color: "var(--wb-muted-fg)" }}>
                {product.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{formatMoney(product.price, product.currency)}</span>
                  {product.compareAtPrice ? (
                    <span className="text-sm line-through" style={{ color: "var(--wb-muted-fg)" }}>
                      {formatMoney(product.compareAtPrice, product.currency)}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => add(product)}
                  className="rounded-[var(--wb-radius)] px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: "var(--wb-primary)", color: "var(--wb-primary-fg)" }}
                >
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
