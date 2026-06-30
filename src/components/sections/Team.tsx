import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { HeadingBlock, ImagePlaceholder, SectionShell } from "./_shared";

export function Team({ section }: { section: SectionOf<"team">; document: SiteDocument }) {
  const { title, subtitle, columns, members } = section.props;
  const cols = columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div className={`grid gap-6 ${cols}`}>
        {members.map((m, i) => (
          <div key={i} className="text-center">
            <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full">
              <ImagePlaceholder src={m.avatar?.src} alt={m.name} ratio="aspect-square" className="!rounded-full" />
            </div>
            <h3 className="font-semibold" style={{ fontFamily: "var(--wb-font-heading)" }}>{m.name}</h3>
            <p className="text-sm" style={{ color: "var(--wb-primary)" }}>{m.role}</p>
            {m.bio && <p className="mt-1 text-sm" style={{ color: "var(--wb-muted-fg)" }}>{m.bio}</p>}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
