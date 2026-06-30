import type { SectionOf } from "@/lib/schema/page-schema";
import { HeadingBlock, SectionShell } from "./_shared";

export function Stats({ section }: { section: SectionOf<"stats"> }) {
  const { title, items } = section.props;
  const cards = section.variant === "cards";

  return (
    <SectionShell section={section}>
      {title ? <HeadingBlock title={title} /> : null}
      <div
        className="mx-auto grid max-w-4xl gap-6"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((stat, i) => (
          <div
            key={i}
            className="text-center"
            style={
              cards
                ? {
                    background: "var(--wb-card)",
                    border: "1px solid var(--wb-border)",
                    borderRadius: "var(--wb-radius)",
                    padding: "1.5rem",
                  }
                : undefined
            }
          >
            <div
              className="text-4xl font-semibold tracking-tight md:text-5xl"
              style={{ fontFamily: "var(--wb-font-heading)", color: "var(--wb-primary)" }}
            >
              {stat.value}
            </div>
            <div className="mt-1 text-sm" style={{ color: "var(--wb-muted-fg)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
