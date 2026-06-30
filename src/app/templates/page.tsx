"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Globe,
  LayoutGrid,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  getTemplatePage,
  getCategoryCounts,
  getTemplateCount,
  CATEGORY_LABELS,
  type TemplateCategory,
  type TemplateMeta,
} from "@/lib/templates";

const PAGE_SIZE = 24;
type Filter = "all" | "ecommerce" | "website";

export default function TemplatesPage() {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [category, setCategory] = React.useState<TemplateCategory | null>(null);
  const [page, setPage] = React.useState(1);
  const [showCats, setShowCats] = React.useState(false);

  const categoryCounts = React.useMemo(() => getCategoryCounts(), []);
  const totalCount = React.useMemo(() => getTemplateCount(), []);
  const categories = Object.entries(CATEGORY_LABELS) as [TemplateCategory, string][];

  const result = React.useMemo(
    () =>
      getTemplatePage(page, PAGE_SIZE, {
        category: category ?? undefined,
        ecommerce: filter === "all" ? undefined : filter === "ecommerce",
        search: search || undefined,
      }),
    [page, category, filter, search]
  );

  React.useEffect(() => setPage(1), [search, filter, category]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/60 bg-[#09090b]/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Sparkles size={20} className="text-[#6d5efc]" />
            WeBuild
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">Home</Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#6d5efc] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-8 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">Template Gallery</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
          {totalCount.toLocaleString()} ready-to-use templates across {categories.length} categories.
          Pick one and make it yours.
        </p>
      </section>

      {/* Filters */}
      <div className="sticky top-14 z-40 border-b border-zinc-800/60 bg-[#09090b]/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-lg border border-zinc-800 bg-[#141418] py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center rounded-lg border border-zinc-800 bg-[#141418]">
            {(["all", "ecommerce", "website"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs transition-colors",
                  filter === f ? "bg-[#6d5efc]/15 text-[#a99bff]" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {f === "ecommerce" && <ShoppingBag size={12} />}
                {f === "website" && <Globe size={12} />}
                {f === "all" ? "All" : f === "ecommerce" ? "Stores" : "Websites"}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCats(!showCats)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors",
                category
                  ? "border-[#6d5efc]/40 bg-[#6d5efc]/10 text-[#a99bff]"
                  : "border-zinc-800 bg-[#141418] text-zinc-400 hover:text-zinc-200"
              )}
            >
              {category ? CATEGORY_LABELS[category] : "Category"}
              <ChevronDown size={12} />
            </button>
            {showCats && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCats(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 max-h-80 w-56 overflow-y-auto rounded-xl border border-zinc-800 bg-[#141418] py-1 shadow-xl">
                  <button
                    type="button"
                    onClick={() => { setCategory(null); setShowCats(false); }}
                    className={cn("flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-zinc-800/60", !category ? "text-[#a99bff]" : "text-zinc-300")}
                  >
                    All Categories
                    <span className="text-zinc-600">{totalCount}</span>
                  </button>
                  {categories.map(([key, label]) => {
                    const count = categoryCounts[key] || 0;
                    if (!count) return null;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { setCategory(key); setShowCats(false); }}
                        className={cn("flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-zinc-800/60", category === key ? "text-[#a99bff]" : "text-zinc-300")}
                      >
                        {label}
                        <span className="text-zinc-600">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {result.items.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-zinc-500">
            <Search size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No templates match your filters</p>
            <button
              type="button"
              onClick={() => { setSearch(""); setFilter("all"); setCategory(null); }}
              className="mt-2 text-xs text-[#a99bff] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {result.items.map((meta) => (
              <Link
                key={meta.id}
                href="/dashboard"
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#141418] transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-[#6d5efc]/5"
              >
                <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
                  <Sparkles size={24} className="text-zinc-700 transition-colors group-hover:text-[#6d5efc]/50" />
                  {meta.ecommerce && (
                    <span className="absolute right-2 top-2 rounded bg-[#6d5efc]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#a99bff]">
                      E-Commerce
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-sm font-medium text-zinc-200 line-clamp-1">{meta.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">{meta.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {meta.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {result.pages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, result.total)} of {result.total.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <PgBtn onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</PgBtn>
              {Array.from({ length: Math.min(result.pages, 7) }, (_, i) => {
                let p: number;
                if (result.pages <= 7) p = i + 1;
                else if (page <= 4) p = i + 1;
                else if (page >= result.pages - 3) p = result.pages - 6 + i;
                else p = page - 3 + i;
                return <PgBtn key={p} onClick={() => setPage(p)} active={p === page}>{p}</PgBtn>;
              })}
              <PgBtn onClick={() => setPage(page + 1)} disabled={page === result.pages}>Next</PgBtn>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="border-t border-zinc-800 py-16 text-center">
        <h2 className="text-2xl font-bold">Like what you see?</h2>
        <p className="mt-2 text-zinc-400">Open the editor to customize any template with full visual control.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6d5efc] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Open Editor
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}

function PgBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs transition-colors",
        active ? "bg-[#6d5efc] text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
        disabled && "pointer-events-none opacity-30"
      )}
    >
      {children}
    </button>
  );
}
