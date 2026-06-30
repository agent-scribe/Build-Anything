import type { SectionOf } from "@/lib/schema/page-schema";
import { HeadingBlock, Icon, SectionShell } from "./_shared";
import { EditableText } from "@/lib/store/InlineEditContext";

const COLS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function Features({ section }: { section: SectionOf<"features"> }) {
  const { title, subtitle, items, columns } = section.props;
  const asCards = section.variant === "cards";

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div className={`grid gap-6 ${COLS[columns ?? 3]}`}>
        {items.map((f, i) => (
          <div
            key={i}
            className="rounded-[var(--wb-radius)] p-6"
            style={
              asCards
                ? { background: "var(--wb-card)", border: "1px solid var(--wb-border)" }
                : undefined
            }
          >
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--wb-radius)]"
              style={{ background: "var(--wb-muted)", color: "var(--wb-primary)" }}
            >
              <Icon name={f.icon} size={20} strokeWidth={1.75} />
            </div>
            <EditableText
              sectionId={section.id}
              propPath={`items.${i}.title`}
              value={f.title}
              as="h3"
              className="text-lg font-medium"
              style={{ fontFamily: "var(--wb-font-heading)" }}
            />
            <EditableText
              sectionId={section.id}
              propPath={`items.${i}.description`}
              value={f.description}
              as="p"
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--wb-muted-fg)" }}
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
