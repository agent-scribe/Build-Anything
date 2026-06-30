/**
 * Section library barrel + metadata registry.
 * Components are consumed by PageRenderer (via a type-narrowing switch);
 * SECTION_META powers the dashboard's "Add section" menu and the inspector.
 */
import type { SectionType } from "@/lib/schema/page-schema";

export { Navbar } from "./Navbar";
export { Hero } from "./Hero";
export { Features } from "./Features";
export { Products } from "./Products";
export { Pricing } from "./Pricing";
export { Testimonials } from "./Testimonials";
export { FAQ } from "./FAQ";
export { CTA } from "./CTA";
export { Newsletter } from "./Newsletter";
export { Logos } from "./Logos";
export { Stats } from "./Stats";
export { Footer } from "./Footer";
export { Gallery } from "./Gallery";
export { Team } from "./Team";
export { Blog } from "./Blog";
export { Contact } from "./Contact";
export { Comparison } from "./Comparison";
export { Timeline } from "./Timeline";
export { Video } from "./Video";
export { Banner } from "./Banner";
export { Portfolio } from "./Portfolio";
export { Metrics } from "./Metrics";

export interface SectionMeta {
  label: string;
  icon: string;
  description: string;
  ecommerce?: boolean;
}

export const SECTION_META: Record<SectionType, SectionMeta> = {
  navbar: { label: "Navbar", icon: "menu", description: "Top navigation with logo and links" },
  hero: { label: "Hero", icon: "layout-template", description: "Headline, subtext, and primary CTA" },
  features: { label: "Features", icon: "layout-grid", description: "Grid of benefits with icons" },
  products: { label: "Products", icon: "shopping-bag", description: "Catalog grid with add-to-cart", ecommerce: true },
  pricing: { label: "Pricing", icon: "credit-card", description: "Tiered plan comparison" },
  testimonials: { label: "Testimonials", icon: "quote", description: "Social proof from customers" },
  faq: { label: "FAQ", icon: "circle-help", description: "Expandable questions and answers" },
  cta: { label: "Call to action", icon: "megaphone", description: "Focused conversion block" },
  newsletter: { label: "Newsletter", icon: "mail", description: "Email capture form" },
  logos: { label: "Logo cloud", icon: "badge-check", description: "Trusted-by logo row" },
  stats: { label: "Stats", icon: "trending-up", description: "Headline metrics" },
  footer: { label: "Footer", icon: "panel-bottom", description: "Links, socials, and legal" },
  gallery: { label: "Gallery", icon: "images", description: "Image grid with lightbox" },
  team: { label: "Team", icon: "users", description: "Team member cards" },
  blog: { label: "Blog", icon: "file-text", description: "Blog post cards" },
  contact: { label: "Contact", icon: "mail", description: "Contact form with info" },
  comparison: { label: "Comparison", icon: "columns", description: "Feature comparison table" },
  timeline: { label: "Timeline", icon: "clock", description: "Chronological event timeline" },
  video: { label: "Video", icon: "play-circle", description: "Video embed section" },
  banner: { label: "Banner", icon: "flag", description: "Announcement or promo banner" },
  portfolio: { label: "Portfolio", icon: "folder-open", description: "Project showcase grid" },
  metrics: { label: "Metrics", icon: "bar-chart-3", description: "Animated counter cards" },
};
