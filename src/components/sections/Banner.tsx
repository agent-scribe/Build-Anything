"use client";
import * as React from "react";
import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { SectionShell } from "./_shared";

const STYLES = {
  info: { bg: "var(--wb-muted)", border: "var(--wb-border)", text: "var(--wb-fg)" },
  success: { bg: "#052e16", border: "#16a34a", text: "#4ade80" },
  warning: { bg: "#451a03", border: "#d97706", text: "#fbbf24" },
  promo: { bg: "var(--wb-primary)", border: "transparent", text: "var(--wb-primary-fg)" },
};

export function Banner({ section }: { section: SectionOf<"banner">; document: SiteDocument }) {
  const { text, cta, dismissable, style } = section.props;
  const [dismissed, setDismissed] = React.useState(false);
  const s = STYLES[style ?? "promo"];

  if (dismissed) return null;

  return (
    <SectionShell section={section}>
      <div className="flex items-center justify-center gap-3 rounded-[var(--wb-radius)] px-4 py-3 text-sm" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
        <span className="font-medium">{text}</span>
        {cta && <a href={cta.href} className="underline font-semibold">{cta.label}</a>}
        {dismissable && (
          <button type="button" onClick={() => setDismissed(true)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        )}
      </div>
    </SectionShell>
  );
}
