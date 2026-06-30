/**
 * types.ts — Template system type definitions.
 * Expanded categories covering 15+ industries for 2001 templates.
 */

import type { SiteDocument } from "@/lib/schema/page-schema";

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export type TemplateCategory =
  | "ecommerce"
  | "saas"
  | "creative"
  | "services"
  | "food"
  | "health"
  | "education"
  | "nonprofit"
  | "realestate"
  | "entertainment"
  | "automotive"
  | "pets"
  | "travel"
  | "sports"
  | "beauty"
  | "legal"
  | "finance"
  | "construction"
  | "agriculture";

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  ecommerce: "E-Commerce",
  saas: "SaaS & Tech",
  creative: "Creative & Portfolio",
  services: "Professional Services",
  food: "Food & Hospitality",
  health: "Health & Fitness",
  education: "Education",
  nonprofit: "Nonprofits",
  realestate: "Real Estate",
  entertainment: "Entertainment & Events",
  automotive: "Automotive",
  pets: "Pets & Animals",
  travel: "Travel & Tourism",
  sports: "Sports & Outdoors",
  beauty: "Beauty & Personal Care",
  legal: "Legal",
  finance: "Finance & Insurance",
  construction: "Construction & Home",
  agriculture: "Agriculture & Farm",
};

export const CATEGORY_ICONS: Record<TemplateCategory, string> = {
  ecommerce: "shopping-bag",
  saas: "code-2",
  creative: "palette",
  services: "briefcase",
  food: "utensils",
  health: "heart-pulse",
  education: "graduation-cap",
  nonprofit: "hand-heart",
  realestate: "home",
  entertainment: "music",
  automotive: "car",
  pets: "dog",
  travel: "plane",
  sports: "dumbbell",
  beauty: "sparkles",
  legal: "scale",
  finance: "landmark",
  construction: "hammer",
  agriculture: "sprout",
};

/* ------------------------------------------------------------------ */
/* Template metadata & full template                                   */
/* ------------------------------------------------------------------ */

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  ecommerce: boolean;
  thumbnail?: string;
}

export interface Template extends TemplateMeta {
  document: SiteDocument;
}
