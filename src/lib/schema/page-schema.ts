/**
 * page-schema.ts — THE CONTRACT
 * ------------------------------------------------------------------
 * This Zod schema is the single source of truth for what a generated
 * site *is*. It powers three things at once:
 *
 *   1. TypeScript types        (via z.infer)        — compile-time safety
 *   2. Runtime validation      (via safeParse)      — guards model output
 *   3. The model's contract    (via json-schema.ts) — what Claude must emit
 *
 * The renderer (`components/renderer/PageRenderer.tsx`) and the editor
 * store both consume these types, so a change here propagates everywhere.
 */
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

export const HexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "must be a hex color like #0A0A0B");

/** A clickable target. `href` may be an anchor (#features), a path (/products) or a URL. */
export const LinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  variant: z.enum(["primary", "secondary", "ghost", "link"]).default("primary"),
  external: z.boolean().default(false),
});
export type Link = z.infer<typeof LinkSchema>;

export const ImageSchema = z.object({
  /** A URL, or a placeholder token the renderer resolves, e.g. "{{unsplash:skincare}}". */
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type ImageRef = z.infer<typeof ImageSchema>;

/** Lucide icon name (kebab or pascal). Validated against the registry at render time. */
export const IconName = z.string().min(1);

/* ------------------------------------------------------------------ */
/* Theme — design tokens that the renderer maps to CSS variables       */
/* ------------------------------------------------------------------ */

export const ThemeSchema = z.object({
  colors: z.object({
    background: HexColor,
    foreground: HexColor,
    primary: HexColor,
    primaryForeground: HexColor,
    secondary: HexColor,
    accent: HexColor,
    muted: HexColor,
    mutedForeground: HexColor,
    border: HexColor,
    card: HexColor,
    cardForeground: HexColor,
  }),
  fonts: z.object({
    heading: z.string().min(1), // e.g. "Sora"
    body: z.string().min(1), // e.g. "Inter"
  }),
  radius: z.enum(["none", "sm", "md", "lg", "xl", "full"]).default("md"),
  mode: z.enum(["light", "dark"]).default("light"),
  density: z.enum(["compact", "comfortable", "spacious"]).default("comfortable"),
});
export type Theme = z.infer<typeof ThemeSchema>;

/* ------------------------------------------------------------------ */
/* Shared section fields                                               */
/* ------------------------------------------------------------------ */

const sectionBase = {
  id: z.string().min(1),
  visible: z.boolean().default(true),
  paddingY: z.enum(["none", "sm", "md", "lg", "xl"]).default("lg"),
  background: z
    .enum(["default", "muted", "card", "primary", "inverted"])
    .default("default"),
};

/* ------------------------------------------------------------------ */
/* Sections — one schema per section type, unified by a discriminator  */
/* ------------------------------------------------------------------ */

export const NavbarSection = z.object({
  type: z.literal("navbar"),
  ...sectionBase,
  variant: z.enum(["simple", "centered", "split"]).default("simple"),
  props: z.object({
    logo: z.string().min(1),
    links: z.array(LinkSchema).max(7).default([]),
    cta: LinkSchema.optional(),
    sticky: z.boolean().default(true),
  }),
});

export const HeroSection = z.object({
  type: z.literal("hero"),
  ...sectionBase,
  variant: z.enum(["centered", "split-left", "split-right", "minimal"]).default("centered"),
  props: z.object({
    eyebrow: z.string().optional(),
    headline: z.string().min(1),
    subheadline: z.string(),
    primaryCta: LinkSchema,
    secondaryCta: LinkSchema.optional(),
    image: ImageSchema.optional(),
  }),
});

export const FeaturesSection = z.object({
  type: z.literal("features"),
  ...sectionBase,
  variant: z.enum(["grid", "alternating", "cards"]).default("grid"),
  props: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
    items: z
      .array(
        z.object({
          icon: IconName,
          title: z.string().min(1),
          description: z.string().min(1),
        })
      )
      .min(2),
  }),
});

export const ProductsSection = z.object({
  type: z.literal("products"),
  ...sectionBase,
  variant: z.enum(["grid", "carousel", "featured"]).default("grid"),
  props: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
    /** References ids in `SiteDocument.products`. Empty means "all". */
    productIds: z.array(z.string()).default([]),
  }),
});

export const PricingSection = z.object({
  type: z.literal("pricing"),
  ...sectionBase,
  variant: z.enum(["cards", "table"]).default("cards"),
  props: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    plans: z
      .array(
        z.object({
          name: z.string().min(1),
          price: z.string().min(1), // "$29" or "Free" — kept as string for copy freedom
          period: z.string().optional(), // "/mo"
          description: z.string().optional(),
          features: z.array(z.string()).min(1),
          cta: LinkSchema,
          highlighted: z.boolean().default(false),
        })
      )
      .min(1)
      .max(4),
  }),
});

export const TestimonialsSection = z.object({
  type: z.literal("testimonials"),
  ...sectionBase,
  variant: z.enum(["grid", "single", "marquee"]).default("grid"),
  props: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    items: z
      .array(
        z.object({
          quote: z.string().min(1),
          author: z.string().min(1),
          role: z.string().optional(),
          avatar: ImageSchema.optional(),
          rating: z.number().int().min(1).max(5).optional(),
        })
      )
      .min(1),
  }),
});

export const FaqSection = z.object({
  type: z.literal("faq"),
  ...sectionBase,
  variant: z.enum(["accordion", "two-column"]).default("accordion"),
  props: z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    items: z
      .array(z.object({ question: z.string().min(1), answer: z.string().min(1) }))
      .min(2),
  }),
});

export const CtaSection = z.object({
  type: z.literal("cta"),
  ...sectionBase,
  variant: z.enum(["centered", "split", "banner"]).default("centered"),
  props: z.object({
    headline: z.string().min(1),
    subheadline: z.string().optional(),
    primaryCta: LinkSchema,
    secondaryCta: LinkSchema.optional(),
  }),
});

export const NewsletterSection = z.object({
  type: z.literal("newsletter"),
  ...sectionBase,
  variant: z.enum(["inline", "boxed"]).default("boxed"),
  props: z.object({
    headline: z.string().min(1),
    subheadline: z.string().optional(),
    placeholder: z.string().default("you@example.com"),
    buttonLabel: z.string().default("Subscribe"),
    disclaimer: z.string().optional(),
  }),
});

export const LogosSection = z.object({
  type: z.literal("logos"),
  ...sectionBase,
  variant: z.enum(["row", "grid"]).default("row"),
  props: z.object({
    title: z.string().optional(),
    logos: z.array(z.object({ name: z.string().min(1), image: ImageSchema.optional() })).min(2),
  }),
});

export const StatsSection = z.object({
  type: z.literal("stats"),
  ...sectionBase,
  variant: z.enum(["row", "cards"]).default("row"),
  props: z.object({
    title: z.string().optional(),
    items: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).min(2).max(4),
  }),
});

export const FooterSection = z.object({
  type: z.literal("footer"),
  ...sectionBase,
  variant: z.enum(["columns", "simple"]).default("columns"),
  props: z.object({
    logo: z.string().min(1),
    tagline: z.string().optional(),
    columns: z
      .array(z.object({ heading: z.string().min(1), links: z.array(LinkSchema).min(1) }))
      .default([]),
    socials: z.array(z.object({ platform: IconName, href: z.string() })).default([]),
    copyright: z.string().min(1),
  }),
});

/** The discriminated union of every section the renderer understands. */
export const SectionSchema = z.discriminatedUnion("type", [
  NavbarSection,
  HeroSection,
  FeaturesSection,
  ProductsSection,
  PricingSection,
  TestimonialsSection,
  FaqSection,
  CtaSection,
  NewsletterSection,
  LogosSection,
  StatsSection,
  FooterSection,
]);
export type Section = z.infer<typeof SectionSchema>;
export type SectionType = Section["type"];

/** Narrowing helper: get the concrete section type for a given literal. */
export type SectionOf<T extends SectionType> = Extract<Section, { type: T }>;

/* ------------------------------------------------------------------ */
/* E-commerce catalog                                                  */
/* ------------------------------------------------------------------ */

export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  currency: z.string().length(3).default("USD"),
  image: ImageSchema,
  images: z.array(ImageSchema).default([]),
  tags: z.array(z.string()).default([]),
  inventory: z.number().int().nonnegative().optional(),
  badge: z.string().optional(),
});
export type Product = z.infer<typeof ProductSchema>;

/* ------------------------------------------------------------------ */
/* Page & Site document                                                */
/* ------------------------------------------------------------------ */

export const PageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  path: z.string().regex(/^\/[a-z0-9\-/]*$/i, "path must start with /"),
  seo: z.object({ title: z.string(), description: z.string() }).optional(),
  sections: z.array(SectionSchema).min(1),
});
export type Page = z.infer<typeof PageSchema>;

/**
 * SiteDocument — the top-level artifact the model produces and the editor mutates.
 * Everything downstream (renderer, export, persistence) speaks this shape.
 */
export const SiteDocumentSchema = z.object({
  version: z.literal("1.0"),
  meta: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    industry: z.string().optional(),
    /** Free-form so the model can self-document its design intent; useful for re-themes. */
    designNotes: z.string().optional(),
  }),
  theme: ThemeSchema,
  products: z.array(ProductSchema).default([]),
  pages: z.array(PageSchema).min(1),
});
export type SiteDocument = z.infer<typeof SiteDocumentSchema>;

/* ------------------------------------------------------------------ */
/* Validation helpers                                                  */
/* ------------------------------------------------------------------ */

export type ValidationResult =
  | { ok: true; data: SiteDocument }
  | { ok: false; issues: string[] };

/** Parse unknown model output into a SiteDocument, returning flat, model-friendly errors. */
export function validateSiteDocument(input: unknown): ValidationResult {
  const result = SiteDocumentSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const issues = result.error.issues.map(
    (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
  );
  return { ok: false, issues };
}

/** All section type literals — handy for UI menus and the prompt. */
export const SECTION_TYPES: readonly SectionType[] = [
  "navbar",
  "hero",
  "features",
  "products",
  "pricing",
  "testimonials",
  "faq",
  "cta",
  "newsletter",
  "logos",
  "stats",
  "footer",
] as const;
