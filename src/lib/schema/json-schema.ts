/**
 * json-schema.ts — the model-facing contract.
 * ------------------------------------------------------------------
 * Claude follows a TypeScript-interface-style description far more
 * reliably than raw JSON Schema (fewer tokens, less ambiguity, no
 * `$ref` chasing). `SCHEMA_CONTRACT` is injected verbatim into the
 * system prompt. It is kept in lockstep with `page-schema.ts` — if you
 * change the Zod schema, change this string. The Zod `safeParse` is the
 * backstop that catches any drift.
 *
 * If you prefer a generated JSON Schema, install `zod-to-json-schema`
 * and swap `SCHEMA_CONTRACT` for `zodToJsonSchema(SiteDocumentSchema)`.
 * The pipeline works with either because validation is always Zod.
 */

export const SCHEMA_CONTRACT = `
type Hex = string;            // "#0A0A0B"
type Icon = string;           // a lucide-react icon name, e.g. "sparkles", "shield-check", "leaf"

interface Link { label: string; href: string; variant?: "primary"|"secondary"|"ghost"|"link"; external?: boolean }
interface Image { src: string; alt: string; width?: number; height?: number }
// For src you MAY use a placeholder token "{{unsplash:KEYWORDS}}" (e.g. "{{unsplash:green-skincare-bottle}}").

interface Theme {
  colors: {
    background: Hex; foreground: Hex; primary: Hex; primaryForeground: Hex;
    secondary: Hex; accent: Hex; muted: Hex; mutedForeground: Hex;
    border: Hex; card: Hex; cardForeground: Hex;
  };
  fonts: { heading: string; body: string };           // real Google Font family names
  radius: "none"|"sm"|"md"|"lg"|"xl"|"full";
  mode: "light"|"dark";
  density: "compact"|"comfortable"|"spacious";
}

// Every section shares these. id must be unique & kebab-case ("hero-1").
type SectionBase = {
  id: string;
  visible?: boolean;                                   // default true
  paddingY?: "none"|"sm"|"md"|"lg"|"xl";               // default "lg"
  background?: "default"|"muted"|"card"|"primary"|"inverted";
};

type Section =
  | SectionBase & { type:"navbar"; variant?:"simple"|"centered"|"split";
      props:{ logo:string; links:Link[]; cta?:Link; sticky?:boolean } }
  | SectionBase & { type:"hero"; variant?:"centered"|"split-left"|"split-right"|"minimal";
      props:{ eyebrow?:string; headline:string; subheadline:string; primaryCta:Link; secondaryCta?:Link; image?:Image } }
  | SectionBase & { type:"features"; variant?:"grid"|"alternating"|"cards";
      props:{ title:string; subtitle?:string; columns?:2|3|4; items:{icon:Icon; title:string; description:string}[] } }
  | SectionBase & { type:"products"; variant?:"grid"|"carousel"|"featured";
      props:{ title:string; subtitle?:string; columns?:2|3|4; productIds:string[] } }  // productIds reference SiteDocument.products[].id; [] means all
  | SectionBase & { type:"pricing"; variant?:"cards"|"table";
      props:{ title:string; subtitle?:string; plans:{name:string; price:string; period?:string; description?:string; features:string[]; cta:Link; highlighted?:boolean}[] } }
  | SectionBase & { type:"testimonials"; variant?:"grid"|"single"|"marquee";
      props:{ title:string; subtitle?:string; items:{quote:string; author:string; role?:string; avatar?:Image; rating?:number}[] } }
  | SectionBase & { type:"faq"; variant?:"accordion"|"two-column";
      props:{ title:string; subtitle?:string; items:{question:string; answer:string}[] } }
  | SectionBase & { type:"cta"; variant?:"centered"|"split"|"banner";
      props:{ headline:string; subheadline?:string; primaryCta:Link; secondaryCta?:Link } }
  | SectionBase & { type:"newsletter"; variant?:"inline"|"boxed";
      props:{ headline:string; subheadline?:string; placeholder?:string; buttonLabel?:string; disclaimer?:string } }
  | SectionBase & { type:"logos"; variant?:"row"|"grid";
      props:{ title?:string; logos:{name:string; image?:Image}[] } }
  | SectionBase & { type:"stats"; variant?:"row"|"cards";
      props:{ title?:string; items:{value:string; label:string}[] } }   // 2-4 items
  | SectionBase & { type:"footer"; variant?:"columns"|"simple";
      props:{ logo:string; tagline?:string; columns:{heading:string; links:Link[]}[]; socials:{platform:Icon; href:string}[]; copyright:string } };

interface Product {
  id: string; name: string; description: string;
  price: number; compareAtPrice?: number; currency: string;   // currency is a 3-letter code "USD"
  image: Image; images?: Image[]; tags?: string[]; inventory?: number; badge?: string;
}

interface Page {
  id: string; name: string; path: string;                     // path starts with "/"; home is "/"
  seo?: { title: string; description: string };
  sections: Section[];                                         // at least 1
}

interface SiteDocument {
  version: "1.0";
  meta: { name: string; description: string; industry?: string; designNotes?: string };
  theme: Theme;
  products: Product[];                                         // [] for non-ecommerce sites
  pages: Page[];                                               // at least 1; first is the home page
}
`.trim();

/** Enumerations the UI and validators share, surfaced for menus and quick reference. */
export const ENUMS = {
  sectionTypes: [
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
  ],
  radius: ["none", "sm", "md", "lg", "xl", "full"],
  mode: ["light", "dark"],
  density: ["compact", "comfortable", "spacious"],
} as const;
