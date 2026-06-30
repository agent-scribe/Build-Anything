import type { SectionOf } from "@/lib/schema/page-schema";
import { SectionShell } from "./_shared";

export function Logos({ section }: { section: SectionOf<"logos"> }) {
  const { title, logos } = section.props;
  return (
    <SectionShell section={section}>
      {title ? (
        <p className="mb-8 text-center text-sm" style={{ color: "var(--wb-muted-fg)" }}>
          {title}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
        {logos.map((l, i) => (
          <span
            key={i}
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--wb-font-heading)" }}
          >
            {l.name}
          </span>
        ))}
      </div>
    </SectionShell>
  );
}
