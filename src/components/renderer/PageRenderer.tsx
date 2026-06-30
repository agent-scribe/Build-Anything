/**
 * PageRenderer — the deterministic schema → UI mapping.
 */
import * as React from "react";
import type { Page, Section, SiteDocument } from "@/lib/schema/page-schema";
import {
  CTA, FAQ, Features, Footer, Hero, Logos, Navbar, Newsletter,
  Pricing, Products, Stats, Testimonials,
  Gallery, Team, Blog, Contact, Comparison, Timeline, Video,
  Banner, Portfolio, Metrics,
} from "@/components/sections";

function renderSection(section: Section, document: SiteDocument): React.ReactNode {
  switch (section.type) {
    case "navbar":       return <Navbar section={section} />;
    case "hero":         return <Hero section={section} />;
    case "features":     return <Features section={section} />;
    case "products":     return <Products section={section} document={document} />;
    case "pricing":      return <Pricing section={section} />;
    case "testimonials": return <Testimonials section={section} />;
    case "faq":          return <FAQ section={section} />;
    case "cta":          return <CTA section={section} />;
    case "newsletter":   return <Newsletter section={section} />;
    case "logos":        return <Logos section={section} />;
    case "stats":        return <Stats section={section} />;
    case "footer":       return <Footer section={section} />;
    case "gallery":      return <Gallery section={section} document={document} />;
    case "team":         return <Team section={section} document={document} />;
    case "blog":         return <Blog section={section} document={document} />;
    case "contact":      return <Contact section={section} document={document} />;
    case "comparison":   return <Comparison section={section} document={document} />;
    case "timeline":     return <Timeline section={section} document={document} />;
    case "video":        return <Video section={section} document={document} />;
    case "banner":       return <Banner section={section} document={document} />;
    case "portfolio":    return <Portfolio section={section} document={document} />;
    case "metrics":      return <Metrics section={section} document={document} />;
  }
}

export function PageRenderer({
  page,
  document,
  selectedId,
  onSelect,
}: {
  page: Page;
  document: SiteDocument;
  selectedId?: string | null;
  onSelect?: (sectionId: string) => void;
}) {
  return (
    <>
      {page.sections.map((section) => {
        if (section.visible === false && !onSelect) return null;
        const editable = Boolean(onSelect);
        const isSelected = selectedId === section.id;
        return (
          <div
            key={section.id}
            onClick={editable ? () => onSelect?.(section.id) : undefined}
            className={editable ? "relative cursor-pointer outline-offset-[-2px] transition-[outline]" : undefined}
            style={
              editable
                ? {
                    outline: isSelected ? "2px solid var(--wb-primary)" : "2px solid transparent",
                    opacity: section.visible === false ? 0.4 : 1,
                  }
                : undefined
            }
          >
            {renderSection(section, document)}
          </div>
        );
      })}
    </>
  );
}
