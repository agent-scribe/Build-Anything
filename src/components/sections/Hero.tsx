import type { SectionOf } from "@/lib/schema/page-schema";
import { ImagePlaceholder, SectionShell, SiteButton } from "./_shared";
import { EditableText } from "@/lib/store/InlineEditContext";

export function Hero({ section }: { section: SectionOf<"hero"> }) {
  const { eyebrow, headline, subheadline, primaryCta, secondaryCta, image } = section.props;
  const split = section.variant === "split-left" || section.variant === "split-right";
  const reverse = section.variant === "split-right";

  const copy = (
    <div className={split ? "max-w-xl" : "mx-auto max-w-3xl text-center"}>
      {eyebrow ? (
        <EditableText
          sectionId={section.id}
          propPath="eyebrow"
          value={eyebrow}
          as="span"
          className="mb-4 inline-block text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--wb-accent)" }}
        />
      ) : null}
      <EditableText
        sectionId={section.id}
        propPath="headline"
        value={headline}
        as="h1"
        className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
        style={{ fontFamily: "var(--wb-font-heading)" }}
      />
      <EditableText
        sectionId={section.id}
        propPath="subheadline"
        value={subheadline}
        as="p"
        className={`mt-5 text-lg md:text-xl ${split ? "" : "mx-auto"} max-w-2xl`}
        style={{ color: "var(--wb-muted-fg)" }}
      />
      <div className={`mt-8 flex flex-wrap gap-3 ${split ? "" : "justify-center"}`}>
        <SiteButton link={primaryCta} />
        {secondaryCta ? <SiteButton link={secondaryCta} /> : null}
      </div>
    </div>
  );

  if (!split) {
    return (
      <SectionShell section={section}>
        {copy}
        {image ? <ImagePlaceholder src={image.src} alt={image.alt} ratio="aspect-[16/9]" className="mt-14" /> : null}
      </SectionShell>
    );
  }

  return (
    <SectionShell section={section}>
      <div
        className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
      >
        {copy}
        <ImagePlaceholder src={image?.src} alt={image?.alt ?? "Hero image"} ratio="aspect-square" />
      </div>
    </SectionShell>
  );
}
