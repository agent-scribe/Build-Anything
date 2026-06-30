import type { SectionOf } from "@/lib/schema/page-schema";
import { HeadingBlock, Icon, SectionShell } from "./_shared";

export function Testimonials({ section }: { section: SectionOf<"testimonials"> }) {
  const { title, subtitle, items } = section.props;
  const single = section.variant === "single" || items.length === 1;
  const cols = single ? 1 : Math.min(items.length, 3);

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div
        className={`mx-auto grid gap-6 ${single ? "max-w-2xl" : "max-w-6xl"}`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((t, i) => (
          <figure
            key={i}
            className="flex flex-col rounded-[var(--wb-radius)] p-6"
            style={{ background: "var(--wb-card)", border: "1px solid var(--wb-border)" }}
          >
            {t.rating ? (
              <div className="mb-3 flex gap-0.5" style={{ color: "var(--wb-accent)" }}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Icon key={s} name="star" size={16} />
                ))}
              </div>
            ) : null}
            <blockquote
              className={`flex-1 ${single ? "text-xl leading-relaxed" : "text-base"}`}
              style={{ fontFamily: single ? "var(--wb-font-heading)" : undefined }}
            >
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-medium">{t.author}</span>
              {t.role ? (
                <span style={{ color: "var(--wb-muted-fg)" }}> · {t.role}</span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
