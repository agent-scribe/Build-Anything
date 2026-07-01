/**
 * factory.ts — Builds a full SiteDocument from a compact TemplateConfig.
 * This is the engine that turns niche data + style preset into a
 * complete, renderable site document with all sections populated.
 */

import type { Section, SiteDocument, Theme, Link } from "@/lib/schema/page-schema";
import type { StylePreset } from "./styles";

/* ------------------------------------------------------------------ */
/* Config types — the compact input format                             */
/* ------------------------------------------------------------------ */

export interface SectionConfig {
  type: Section["type"];
  variant?: string;
  props: Record<string, unknown>;
}

export interface ProductConfig {
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface TemplateConfig {
  id: string;
  style: StylePreset;
  siteName: string;
  tagline: string;
  navLinks?: Link[];
  sections: SectionConfig[];
  products?: ProductConfig[];
  footerCopy?: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

let _counter = 0;
function uid(): string {
  return `t${Date.now().toString(36)}${(++_counter).toString(36)}`;
}

function unsplash(keywords: string) {
  return {
    src: `https://images.unsplash.com/photo-placeholder?w=800&q=80&${keywords}`,
    alt: keywords.split(",")[0] || "image",
  };
}

/** Expand {{unsplash:keywords}} tokens in string props. */
function expandTokens(value: unknown): unknown {
  if (typeof value === "string") {
    const m = value.match(/^\{\{unsplash:(.+)\}\}$/);
    if (m) return unsplash(m[1]);
    return value;
  }
  if (Array.isArray(value)) return value.map(expandTokens);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = expandTokens(v);
    }
    return out;
  }
  return value;
}

function defaultNav(siteName: string): Link[] {
  return [
    { label: "Home", href: "#", variant: "ghost" as const, external: false },
    { label: "Features", href: "#features", variant: "ghost" as const, external: false },
    { label: "About", href: "#about", variant: "ghost" as const, external: false },
    { label: "Contact", href: "#contact", variant: "ghost" as const, external: false },
  ];
}

function ecomNav(siteName: string): Link[] {
  return [
    { label: "Home", href: "#", variant: "ghost" as const, external: false },
    { label: "Shop", href: "#products", variant: "ghost" as const, external: false },
    { label: "About", href: "#about", variant: "ghost" as const, external: false },
    { label: "Contact", href: "#contact", variant: "ghost" as const, external: false },
  ];
}

/* ------------------------------------------------------------------ */
/* Build a product from config                                         */
/* ------------------------------------------------------------------ */

function buildProduct(cfg: ProductConfig, idx: number) {
  const image = unsplash(cfg.image);
  return {
    id: uid(),
    name: cfg.name,
    description: cfg.description,
    price: cfg.price,
    compareAtPrice: idx === 0 ? Math.round(cfg.price * 1.3) : undefined,
    currency: "USD",
    image,
    images: [image],
    tags: [] as string[],
    badge: idx === 0 ? "Best Seller" : undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Build a section from config                                         */
/* ------------------------------------------------------------------ */

function buildSection(cfg: SectionConfig): Section {
  const props = expandTokens(cfg.props) as Record<string, unknown>;
  return {
    type: cfg.type,
    id: uid(),
    visible: true,
    paddingY: "lg",
    background: "default",
    variant: cfg.variant || undefined,
    props,
  } as unknown as Section;
}

/* ------------------------------------------------------------------ */
/* Main factory                                                        */
/* ------------------------------------------------------------------ */

export function buildTemplate(cfg: TemplateConfig): SiteDocument {
  const { style, siteName, sections, products } = cfg;
  const theme: Theme = {
    ...style.theme,
    density: "comfortable",
  };

  const navLinks = cfg.navLinks || (products?.length ? ecomNav(siteName) : defaultNav(siteName));

  // Build navbar
  const navbar: Section = {
    type: "navbar",
    id: uid(),
    visible: true,
    paddingY: "none",
    background: "default",
    props: {
      logo: siteName,
      links: navLinks,
      sticky: true,
    },
  } as unknown as Section;

  // Build content sections
  const contentSections = sections.map(buildSection);

  // Add products section if ecommerce
  let productsSections: Section[] = [];
  if (products?.length) {
    productsSections = [
      {
        type: "products",
        id: uid(),
        visible: true,
        paddingY: "lg",
        background: "default",
        variant: "grid",
        props: {
          title: "Our Products",
          subtitle: "Handpicked for you",
          columns: Math.min(products.length, 3) as 2 | 3 | 4,
          productIds: [],
        },
      } as unknown as Section,
    ];
  }

  // Build footer
  const footer: Section = {
    type: "footer",
    id: uid(),
    visible: true,
    paddingY: "lg",
    background: "default",
    props: {
      logo: siteName,
      tagline: cfg.tagline,
      copyright: cfg.footerCopy || `${new Date().getFullYear()} ${siteName}. All rights reserved.`,
      socials: [],
      columns: [
        { heading: "Company", links: [
          { label: "Privacy", href: "/privacy", variant: "link" as const, external: false },
          { label: "Terms", href: "/terms", variant: "link" as const, external: false },
        ] },
      ],
    },
  } as unknown as Section;

  // Assemble: navbar → content (with products injected after hero) → footer
  const allSections: Section[] = [navbar];

  // Find where to inject products (after hero, before other sections)
  let heroInserted = false;
  for (const section of contentSections) {
    allSections.push(section);
    if (section.type === "hero" && productsSections.length && !heroInserted) {
      allSections.push(...productsSections);
      heroInserted = true;
    }
  }
  // If no hero found, add products at end of content
  if (!heroInserted && productsSections.length) {
    allSections.push(...productsSections);
  }

  allSections.push(footer);

  return {
    version: "1.0",
    meta: {
      name: siteName,
      description: cfg.tagline,
      industry: undefined,
      designNotes: undefined,
    },
    theme,
    products: products?.length ? products.map(buildProduct) : [],
    pages: [
      {
        id: "home",
        name: "Home",
        path: "/",
        sections: allSections,
      },
    ],
  } as SiteDocument;
}
