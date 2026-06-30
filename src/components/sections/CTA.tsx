import type { SectionOf } from "@/lib/schema/page-schema";
import { SectionShell, SiteButton } from "./_shared";
import { EditableText } from "@/lib/store/InlineEditContext";

export function CTA({ section }: { section: SectionOf<"cta"> }) {
  const { headline, subheadline, primaryCta, secondaryCta } = section.props;
  const split = section.variant === "split";

  return (
    <SectionShell section={section}>
      <div
        className={
          split
            ? "flex flex-col items-center justify-between gap-6 md:flex-row md:text-left"
            : "mx-auto max-w-2xl text-center"
        }
      >
        <div className={split ? "" : "mx-auto max-w-2xl"}>
          <EditableText
            sectionId={section.id}
            propPath="headline"
            value={headline}
            as="h2"
            className="text-3xl font-semibold tracking-tight md:text-4xl"
            style={{ fontFamily: "var(--wb-font-heading)" }}
          />
          {subheadline ? (
            <EditableText
              sectionId={section.id}
              propPath="subheadline"
              value={subheadline}
              as="p"
              className="mt-3 text-lg opacity-90"
            />
          ) : null}
        </div>
        <div className={`flex flex-wrap gap-3 ${split ? "" : "mt-8 justify-center"}`}>
          <SiteButton link={primaryCta} />
          {secondaryCta ? <SiteButton link={secondaryCta} /> : null}
        </div>
      </div>
    </SectionShell>
  );
}
