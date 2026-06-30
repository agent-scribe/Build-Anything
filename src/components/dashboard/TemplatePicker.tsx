"use client";

import * as React from "react";
import {
  Search,
  X,
  ShoppingBag,
  Globe,
  ChevronDown,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEditorStore } from "@/lib/store/useEditorStore";
import {
  getTemplatePage,
  getTemplate,
  getCategoryCounts,
  getTemplateCount,
  CATEGORY_LABELS,
  type TemplateCategory,
  type TemplateMeta,
} from "@/lib/templates";

const PAGE_SIZE = 24;

type Filter = "all" | "ecommerce" | "website";

export function TemplatePicker({ onClose }: { onClose: () => void }) {
  const loadDocument = useEditorStore((s) => s.loadDocument);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [category, setCategory] = React.useState<TemplateCategory | null>(null);
  const [page, setPage] = React.useState(1);
  const [showCats, setShowCats] = React.useState(false);
  const [loading, setLoading] = React.useState<string | null>(null);

  const categoryCounts = React.useMemo(() => getCategoryCounts(), []);
  const totalCount = React.useMemo(() => getTemplateCount(), []);

  const result = React.useMemo(() => {
    return getTemplatePage(page, PAGE_SIZE, {
      category: category ?? undefined,
      ecommerce: filter === "all" ? undefined : filter === "ecommerce",
      search: search || undefined,
    });
  }, [page, category, filter, search]);

  // Reset page when filters change
  React.useEffect(() => setPage(1), [search, filter, category]);

  function handleSelect(meta: TemplateMeta) {
    setLoading(meta.id);
    // Use requestAnimationFrame to let the loading state render
    requestAnimationFrame(() => {
      const template = getTemplate(meta.id);
      if (template) {
        loadDocument(template.document, false);
      }
      setLoading(null);
      onClose();
    });
  }

  const categories = Object.entries(CATEGORY_LABELS) as [TemplateCategory, string][];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-zinc-800 bg-[#0e0e11] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <LayoutGrid size={20} className="text-[#6d5efc]" />
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Choose a Template
              </h2>
              <p className="text-xs text-zinc-500">
                {totalCount.toLocaleString()} templates across{" "}
                {categories.length} categories
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: search + filters */}
        <div className="flex items-center gap-3 border-b border-zinc-800/60 px-5 py-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-lg border border-zinc-800 bg-[#141418] py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-[#141418]">
            <FilterBtn
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </FilterBtn>
            <FilterBtn
              active={filter === "ecommerce"}
              onClick={() => setFilter("ecommerce")}
            >
              <ShoppingBag size={12} />
              Stores
            </FilterBtn>
            <FilterBtn
              active={filter === "website"}
              onClick={() => setFilter("website")}
            >
              <Globe size={12} />
              Websites
            </FilterBtn>
          </div>

          {/* Category dropdown */}
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
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowCats(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 max-h-80 w-56 overflow-y-auto rounded-xl border border-zinc-800 bg-[#141418] py-1 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory(null);
                      setShowCats(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-zinc-800/60",
                      !category ? "text-[#a99bff]" : "text-zinc-300"
                    )}
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
                        onClick={() => {
                          setCategory(key);
                          setShowCats(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-zinc-800/60",
                          category === key
                            ? "text-[#a99bff]"
                            : "text-zinc-300"
                        )}
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

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {result.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Search size={32} className="mb-3 opacity-30" />
              <p className="text-sm">No templates match your filters</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                  setCategory(null);
                }}
                className="mt-2 text-xs text-[#a99bff] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {result.items.map((meta) => (
                <TemplateCard
                  key={meta.id}
                  meta={meta}
                  loading={loading === meta.id}
                  onSelect={() => handleSelect(meta)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {result.pages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-3">
            <p className="text-xs text-zinc-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, result.total)} of{" "}
              {result.total.toLocaleString()}
            </p>
            <div className="flex items-center gap-1">
              <PaginationBtn
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Prev
              </PaginationBtn>
              {Array.from({ length: Math.min(result.pages, 7) }, (_, i) => {
                let p: number;
                if (result.pages <= 7) {
                  p = i + 1;
                } else if (page <= 4) {
                  p = i + 1;
                } else if (page >= result.pages - 3) {
                  p = result.pages - 6 + i;
                } else {
                  p = page - 3 + i;
                }
                return (
                  <PaginationBtn
                    key={p}
                    onClick={() => setPage(p)}
                    active={p === page}
                  >
                    {p}
                  </PaginationBtn>
                );
              })}
              <PaginationBtn
                onClick={() => setPage(page + 1)}
                disabled={page === result.pages}
              >
                Next
              </PaginationBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function TemplateCard({
  meta,
  loading,
  onSelect,
}: {
  meta: TemplateMeta;
  loading: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={loading}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#141418] text-left transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-[#6d5efc]/5"
    >
      {/* Preview placeholder */}
      <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
        <Sparkles
          size={24}
          className="text-zinc-700 transition-colors group-hover:text-[#6d5efc]/50"
        />
        {meta.ecommerce && (
          <span className="absolute right-2 top-2 rounded bg-[#6d5efc]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#a99bff]">
            E-Commerce
          </span>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#6d5efc] border-t-transparent" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3">
        <p className="text-sm font-medium text-zinc-200 line-clamp-1">
          {meta.name}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
          {meta.description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {meta.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 text-xs transition-colors",
        active
          ? "bg-[#6d5efc]/15 text-[#a99bff]"
          : "text-zinc-500 hover:text-zinc-300"
      )}
    >
      {children}
    </button>
  );
}

function PaginationBtn({
  onClick,
  disabled,
  active,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs transition-colors",
        active
          ? "bg-[#6d5efc] text-white"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
        disabled && "pointer-events-none opacity-30"
      )}
    >
      {children}
    </button>
  );
}
