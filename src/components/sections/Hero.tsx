import type { SectionOf } from "@/lib/schema/page-schema";
import { ImagePlaceholder, SectionShell, SiteButton } from "./_shared";

export function Hero({ section }: { section: SectionOf<"hero"> }) {
  const { eyebrow, headline, subheadline, primaryCta, secondaryCta, image } = section.props;
  const split = section.variant === "split-left" || section.variant === "split-right";
  const reverse = section.variant === "split-right";

  const copy = (
    <div className={split ? "max-w-xl" : "mx-auto max-w-3xl text-center"}>
      {eyebrow ? (
        <span
          className="mb-4 inline-block text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--wb-accent)" }}
        >
          {eyebrow}
        </span>
      ) : null}
      <h1
        className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl"
        style={{ fontFamily: "var(--wb-font-heading)" }}
      >
        {headline}
      </h1>
      <p
        className={`mt-5 text-lg md:text-xl ${split ? "" : "mx-auto"} max-w-2xl`}
        style={{ color: "var(--wb-muted-fg)" }}
      >
        {subheadline}
      </p>
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
        {image ? <ImagePlaceholder alt={image.alt} ratio="aspect-[16/9]" className="mt-14" /> : null}
      </SectionShell>
    );
  }

  return (
    <SectionShell section={section}>
      <div
        className={`grid items-center gap-10 md:grid-cols-2 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
      >
        {copy}
        <ImagePlaceholder alt={image?.alt ?? "Hero image"} ratio="aspect-square" />
      </div>
    </SectionShell>
  );
}
