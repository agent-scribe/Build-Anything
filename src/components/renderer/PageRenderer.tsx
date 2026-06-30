/**
 * PageRenderer — the deterministic schema → UI mapping.
 * ------------------------------------------------------------------
 * Given a validated Page (+ its parent document for catalog lookups),
 * renders each section through the typed component library. A `select`
 * callback makes sections clickable on the editor canvas; omit it for a
 * clean public render (and for export).
 */
import * as React from "react";
import type { Page, Section, SiteDocument } from "@/lib/schema/page-schema";
import {
  CTA,
  FAQ,
  Features,
  Footer,
  Hero,
  Logos,
  Navbar,
  Newsletter,
  Pricing,
  Products,
  Stats,
  Testimonials,
} from "@/components/sections";

/** Type-narrowing switch: TS knows `section.props` precisely in each branch. */
function renderSection(section: Section, document: SiteDocument): React.ReactNode {
  switch (section.type) {
    case "navbar":
      return <Navbar section={section} />;
    case "hero":
      return <Hero section={section} />;
    case "features":
      return <Features section={section} />;
    case "products":
      return <Products section={section} document={document} />;
    case "pricing":
      return <Pricing section={section} />;
    case "testimonials":
      return <Testimonials section={section} />;
    case "faq":
      return <FAQ section={section} />;
    case "cta":
      return <CTA section={section} />;
    case "newsletter":
      return <Newsletter section={section} />;
    case "logos":
      return <Logos section={section} />;
    case "stats":
      return <Stats section={section} />;
    case "footer":
      return <Footer section={section} />;
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
  /** When provided, sections become clickable and the selected one is outlined. */
  selectedId?: string | null;
  onSelect?: (sectionId: string) => void;
}) {
  return (
    <>
      {page.sections.map((section) => {
        if (section.visible === false && !onSelect) return null; // hide in public render only
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
