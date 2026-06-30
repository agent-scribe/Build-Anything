import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { HeadingBlock, SectionShell } from "./_shared";

export function Metrics({ section }: { section: SectionOf<"metrics">; document: SiteDocument }) {
  const { title, subtitle, items } = section.props;

  return (
    <SectionShell section={section}>
      {(title || subtitle) && <HeadingBlock title={title ?? ""} subtitle={subtitle} />}
      <div className={`grid gap-6 ${items.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
        {items.map((item, i) => (
          <div key={i} className="rounded-[var(--wb-radius)] p-5 text-center" style={{ background: "var(--wb-card)", border: "1px solid var(--wb-border)" }}>
            <div className="text-3xl font-bold" style={{ fontFamily: "var(--wb-font-heading)" }}>
              {item.prefix}{item.value}{item.suffix}
            </div>
            <div className="mt-1 text-sm" style={{ color: "var(--wb-muted-fg)" }}>{item.label}</div>
            {item.trend && (
              <span className={`mt-1 inline-block text-xs font-medium ${item.trend === "up" ? "text-green-500" : item.trend === "down" ? "text-red-500" : "text-zinc-400"}`}>
                {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→"}
              </span>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
