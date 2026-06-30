/**
 * registry.ts — Query, search, and filter the 2001-template catalog.
 * Lazily builds full SiteDocuments only when requested.
 */

import type { TemplateCategory, TemplateMeta, Template } from "./types";
import { CATALOG, type CatalogEntry } from "./catalog";
import { buildTemplate } from "./factory";
import { STYLE_PRESETS } from "./styles";

/* ------------------------------------------------------------------ */
/* Cache — avoid rebuilding documents repeatedly                       */
/* ------------------------------------------------------------------ */

const _docCache = new Map<string, Template>();

function toTemplate(entry: CatalogEntry): Template {
  const cached = _docCache.get(entry.id);
  if (cached) return cached;

  const style = STYLE_PRESETS[entry.styleIndex];
  const document = buildTemplate({
    id: entry.id,
    style,
    ...entry.config,
  });

  const template: Template = {
    id: entry.id,
    name: entry.name,
    description: entry.description,
    category: entry.category,
    tags: entry.tags,
    ecommerce: entry.ecommerce,
    document,
  };

  _docCache.set(entry.id, template);
  return template;
}

function toMeta(entry: CatalogEntry): TemplateMeta {
  return {
    id: entry.id,
    name: entry.name,
    description: entry.description,
    category: entry.category,
    tags: entry.tags,
    ecommerce: entry.ecommerce,
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Total template count. */
export function getTemplateCount(): number {
  return CATALOG.length;
}

/** All template metadata (no documents — lightweight for listing). */
export function getTemplateMetas(): TemplateMeta[] {
  return CATALOG.map(toMeta);
}

/** Get a single template by ID (builds document on demand). */
export function getTemplate(id: string): Template | undefined {
  const entry = CATALOG.find((e) => e.id === id);
  return entry ? toTemplate(entry) : undefined;
}

/** Get templates by category. */
export function getTemplatesByCategory(category: TemplateCategory): TemplateMeta[] {
  return CATALOG.filter((e) => e.category === category).map(toMeta);
}

/** Get only ecommerce or only website templates. */
export function getTemplatesByType(ecommerce: boolean): TemplateMeta[] {
  return CATALOG.filter((e) => e.ecommerce === ecommerce).map(toMeta);
}

/** Search templates by query (matches name, description, tags). */
export function searchTemplates(query: string): TemplateMeta[] {
  const q = query.toLowerCase().trim();
  if (!q) return getTemplateMetas();
  return CATALOG.filter((e) => {
    const haystack = `${e.name} ${e.description} ${e.tags.join(" ")}`.toLowerCase();
    return q.split(/\s+/).every((word) => haystack.includes(word));
  }).map(toMeta);
}

/** Count templates per category. */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of CATALOG) {
    counts[entry.category] = (counts[entry.category] || 0) + 1;
  }
  return counts;
}

/** Get paginated template metas. */
export function getTemplatePage(
  page: number,
  pageSize: number,
  filters?: {
    category?: TemplateCategory;
    ecommerce?: boolean;
    search?: string;
  }
): { items: TemplateMeta[]; total: number; pages: number } {
  let filtered = CATALOG;

  if (filters?.category) {
    filtered = filtered.filter((e) => e.category === filters.category);
  }
  if (filters?.ecommerce !== undefined) {
    filtered = filtered.filter((e) => e.ecommerce === filters.ecommerce);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter((e) => {
      const haystack = `${e.name} ${e.description} ${e.tags.join(" ")}`.toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }

  const total = filtered.length;
  const pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize).map(toMeta);

  return { items, total, pages };
}
