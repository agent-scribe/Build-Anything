/**
 * defaults.ts — factories for new documents, default themes, and blank
 * sections. `SAMPLE_SITE` doubles as the offline mock generation result
 * so the dashboard is fully explorable with no API key.
 */
import { uid } from "@/lib/utils/id";
import type { Section, SectionType, SiteDocument, Theme } from "./page-schema";

/* ------------------------------------------------------------------ */
/* Themes                                                              */
/* ------------------------------------------------------------------ */

export const DARK_THEME: Theme = {
  colors: {
    background: "#0A0A0B",
    foreground: "#FAFAFA",
    primary: "#6D5EFC",
    primaryForeground: "#FFFFFF",
    secondary: "#18181B",
    accent: "#A99BFF",
    muted: "#1C1C20",
    mutedForeground: "#A1A1AA",
    border: "#26262C",
    card: "#141418",
    cardForeground: "#FAFAFA",
  },
  fonts: { heading: "Sora", body: "Inter" },
  radius: "lg",
  mode: "dark",
  density: "comfortable",
};

export const LIGHT_THEME: Theme = {
  colors: {
    background: "#FFFFFF",
    foreground: "#0A0A0B",
    primary: "#5A7A55",
    primaryForeground: "#FFFFFF",
    secondary: "#F1F3EC",
    accent: "#C8A24A",
    muted: "#F4F4F2",
    mutedForeground: "#6F7A6E",
    border: "#E6E8E1",
    card: "#FBFBF9",
    cardForeground: "#2F3B30",
  },
  fonts: { heading: "Fraunces", body: "Inter" },
  radius: "md",
  mode: "light",
  density: "comfortable",
};

/* ------------------------------------------------------------------ */
/* Blank-section factory — used by the editor's "Add section" menu      */
/* ------------------------------------------------------------------ */

export function createSection(type: SectionType): Section {
  const id = uid(type);
  switch (type) {
    case "navbar":
      return { type, id, visible: true, paddingY: "sm", background: "default", variant: "simple",
        props: { logo: "Brand", links: [{ label: "Features", href: "#features", variant: "link", external: false }], sticky: true } };
    case "hero":
      return { type, id, visible: true, paddingY: "xl", background: "default", variant: "centered",
        props: { headline: "A headline that sells", subheadline: "One clear sentence on the value you deliver.",
          primaryCta: { label: "Get started", href: "#", variant: "primary", external: false } } };
    case "features":
      return { type, id, visible: true, paddingY: "lg", background: "default", variant: "grid",
        props: { title: "Everything you need", columns: 3, items: [
          { icon: "zap", title: "Fast", description: "Describe it." },
          { icon: "shield-check", title: "Reliable", description: "Describe it." },
          { icon: "sparkles", title: "Polished", description: "Describe it." } ] } };
    case "products":
      return { type, id, visible: true, paddingY: "lg", background: "default", variant: "grid",
        props: { title: "Shop the range", columns: 3, productIds: [] } };
    case "pricing":
      return { type, id, visible: true, paddingY: "lg", background: "muted", variant: "cards",
        props: { title: "Simple pricing", plans: [
          { name: "Starter", price: "$0", period: "/mo", features: ["Feature one"], cta: { label: "Start", href: "#", variant: "secondary", external: false }, highlighted: false },
          { name: "Pro", price: "$29", period: "/mo", features: ["Everything in Starter"], cta: { label: "Upgrade", href: "#", variant: "primary", external: false }, highlighted: true } ] } };
    case "testimonials":
      return { type, id, visible: true, paddingY: "lg", background: "default", variant: "grid",
        props: { title: "Loved by customers", items: [ { quote: "This changed how we work.", author: "Alex Doe", role: "Founder" } ] } };
    case "faq":
      return { type, id, visible: true, paddingY: "lg", background: "default", variant: "accordion",
        props: { title: "Questions, answered", items: [
          { question: "How does it work?", answer: "Describe it." },
          { question: "Can I cancel anytime?", answer: "Yes." } ] } };
    case "cta":
      return { type, id, visible: true, paddingY: "xl", background: "primary", variant: "centered",
        props: { headline: "Ready to start?", primaryCta: { label: "Get started", href: "#", variant: "primary", external: false } } };
    case "newsletter":
      return { type, id, visible: true, paddingY: "lg", background: "muted", variant: "boxed",
        props: { headline: "Join the list", placeholder: "you@example.com", buttonLabel: "Subscribe" } };
    case "logos":
      return { type, id, visible: true, paddingY: "md", background: "default", variant: "row",
        props: { title: "Trusted by teams everywhere", logos: [ { name: "Acme" }, { name: "Globex" }, { name: "Umbrella" } ] } };
    case "stats":
      return { type, id, visible: true, paddingY: "lg", background: "muted", variant: "row",
        props: { items: [ { value: "10k+", label: "Customers" }, { value: "99.9%", label: "Uptime" } ] } };
    case "footer":
      return { type, id, visible: true, paddingY: "lg", background: "card", variant: "columns",
        props: { logo: "Brand", columns: [], socials: [], copyright: "© 2026 Brand. All rights reserved." } };
  }
}

/* ------------------------------------------------------------------ */
/* Starter document — empty home page on a dark theme                  */
/* ------------------------------------------------------------------ */

export function createStarterSite(name = "Untitled"): SiteDocument {
  return {
    version: "1.0",
    meta: { name, description: "A new site." },
    theme: DARK_THEME,
    products: [],
    pages: [
      {
        id: uid("page"),
        name: "Home",
        path: "/",
        sections: [createSection("navbar"), createSection("hero"), createSection("footer")],
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* SAMPLE_SITE — a complete e-commerce store; used as the mock result   */
/* ------------------------------------------------------------------ */

export const SAMPLE_SITE: SiteDocument = {
  version: "1.0",
  meta: {
    name: "Verdé",
    description: "Minimalist clean skincare with formulas you can actually pronounce.",
    industry: "beauty & skincare",
    designNotes: "Sage-green editorial palette, serif headings, generous whitespace, calm and premium.",
  },
  theme: LIGHT_THEME,
  products: [
    { id: "p-serum", name: "Restore Serum", description: "A featherlight vitamin-C serum that brightens in 14 days.", price: 48, compareAtPrice: 58, currency: "USD", image: { src: "{{unsplash:green-serum-bottle}}", alt: "Restore Serum" }, images: [], tags: ["bestseller"], badge: "Best seller" },
    { id: "p-cleanser", name: "Daily Cleanser", description: "A pH-balanced gel cleanser that never strips.", price: 24, currency: "USD", image: { src: "{{unsplash:skincare-cleanser}}", alt: "Daily Cleanser" }, images: [], tags: [] },
    { id: "p-cream", name: "Night Cream", description: "Ceramide-rich overnight repair for soft mornings.", price: 36, currency: "USD", image: { src: "{{unsplash:face-cream-jar}}", alt: "Night Cream" }, images: [], tags: [] },
  ],
  pages: [
    {
      id: "page-home",
      name: "Home",
      path: "/",
      seo: { title: "Verdé — Clean skincare, distilled", description: "Minimalist skincare with formulas you can pronounce." },
      sections: [
        { type: "navbar", id: "nav-1", visible: true, paddingY: "sm", background: "default", variant: "split",
          props: { logo: "Verdé", links: [ { label: "Shop", href: "#products", variant: "link", external: false }, { label: "About", href: "#about", variant: "link", external: false } ], cta: { label: "Cart", href: "/cart", variant: "primary", external: false }, sticky: true } },
        { type: "hero", id: "hero-1", visible: true, paddingY: "xl", background: "muted", variant: "centered",
          props: { eyebrow: "New · The Restore range", headline: "Skincare, distilled to what works", subheadline: "Clean formulas. Nothing you can't pronounce. Dermatologist-tested and cruelty-free.",
            primaryCta: { label: "Shop the range", href: "#products", variant: "primary", external: false }, secondaryCta: { label: "Our story", href: "#about", variant: "ghost", external: false },
            image: { src: "{{unsplash:green-skincare-flatlay}}", alt: "Verdé skincare range" } } },
        { type: "logos", id: "logos-1", visible: true, paddingY: "md", background: "default", variant: "row",
          props: { title: "As seen in", logos: [ { name: "VOGUE" }, { name: "Allure" }, { name: "Byrdie" }, { name: "Goop" } ] } },
        { type: "products", id: "products-1", visible: true, paddingY: "lg", background: "default", variant: "grid",
          props: { title: "The essentials", subtitle: "Three steps. That's the whole routine.", columns: 3, productIds: ["p-serum", "p-cleanser", "p-cream"] } },
        { type: "features", id: "features-1", visible: true, paddingY: "lg", background: "muted", variant: "grid",
          props: { title: "Why Verdé", columns: 3, items: [
            { icon: "leaf", title: "Clean formulas", description: "No sulfates, parabens, or synthetic fragrance — ever." },
            { icon: "flask-conical", title: "Clinically dosed", description: "Actives at concentrations that actually do something." },
            { icon: "heart-handshake", title: "Cruelty-free", description: "Leaping Bunny certified and 100% vegan." } ] } },
        { type: "testimonials", id: "testi-1", visible: true, paddingY: "lg", background: "default", variant: "grid",
          props: { title: "What customers say", items: [
            { quote: "My skin has never looked calmer. The serum is unreal.", author: "Maya R.", role: "Verified buyer", rating: 5 },
            { quote: "Finally a routine I can stick to. Three products, done.", author: "Jordan P.", role: "Verified buyer", rating: 5 } ] } },
        { type: "newsletter", id: "news-1", visible: true, paddingY: "lg", background: "primary", variant: "boxed",
          props: { headline: "Join the list — 10% off your first order", subheadline: "Skincare notes, restocks, and the occasional secret sale.", placeholder: "you@example.com", buttonLabel: "Get 10% off", disclaimer: "No spam. Unsubscribe anytime." } },
        { type: "footer", id: "footer-1", visible: true, paddingY: "lg", background: "card", variant: "columns",
          props: { logo: "Verdé", tagline: "Clean skincare, distilled.",
            columns: [
              { heading: "Shop", links: [ { label: "All products", href: "#", variant: "link", external: false }, { label: "Bundles", href: "#", variant: "link", external: false } ] },
              { heading: "Company", links: [ { label: "About", href: "/about", variant: "link", external: false }, { label: "Contact", href: "#", variant: "link", external: false } ] } ],
            socials: [ { platform: "instagram", href: "#" }, { platform: "twitter", href: "#" } ],
            copyright: "© 2026 Verdé. All rights reserved." } },
      ],
    },
    {
      id: "about",
      name: "About",
      path: "/about",
      seo: { title: "About — Verdé", description: "Our story, mission, and the science behind our clean formulas." },
      sections: [
        { type: "navbar", id: "about-nav", visible: true, paddingY: "sm", background: "default", variant: "simple",
          props: { logo: "Verdé", links: [
            { label: "Home", href: "/", variant: "link", external: false },
            { label: "Products", href: "#", variant: "link", external: false },
            { label: "About", href: "/about", variant: "link", external: false } ],
            cta: { label: "Shop now", href: "#", variant: "primary", external: false }, sticky: true } },
        { type: "hero", id: "about-hero", visible: true, paddingY: "lg", background: "default", variant: "centered",
          props: { eyebrow: "Our story", headline: "Skincare that respects your skin and the planet",
            subheadline: "We started Verdé because we believed clean beauty shouldn't mean compromising on results. Every formula is backed by dermatological research and made with sustainably sourced ingredients.",
            primaryCta: { label: "See our ingredients", href: "#", variant: "primary", external: false } } },
        { type: "stats", id: "about-stats", visible: true, paddingY: "lg", background: "muted", variant: "row",
          props: { title: "By the numbers", items: [
            { value: "50K+", label: "Happy customers" },
            { value: "12", label: "Active ingredients" },
            { value: "0", label: "Harmful chemicals" },
            { value: "100%", label: "Vegan & cruelty-free" } ] } },
        { type: "footer", id: "about-footer", visible: true, paddingY: "lg", background: "card", variant: "simple",
          props: { logo: "Verdé", tagline: "Clean skincare, distilled.", columns: [],
            socials: [ { platform: "instagram", href: "#" } ],
            copyright: "© 2026 Verdé. All rights reserved." } },
      ],
    },
  ],
};
