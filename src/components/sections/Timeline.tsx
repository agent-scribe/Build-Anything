import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { HeadingBlock, SectionShell } from "./_shared";

export function Timeline({ section }: { section: SectionOf<"timeline">; document: SiteDocument }) {
  const { title, subtitle, items } = section.props;

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div className="relative mx-auto max-w-2xl">
        <div className="absolute left-4 top-0 h-full w-px" style={{ background: "var(--wb-border)" }} />
        <div className="space-y-8">
          {items.map((item, i) => (
            <div key={i} className="relative pl-12">
              <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full" style={{ background: "var(--wb-primary)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--wb-primary)" }}>{item.date}</span>
              <h3 className="mt-1 font-semibold" style={{ fontFamily: "var(--wb-font-heading)" }}>{item.title}</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--wb-muted-fg)" }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
