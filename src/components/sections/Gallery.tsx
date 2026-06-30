import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { HeadingBlock, ImagePlaceholder, SectionShell } from "./_shared";

export function Gallery({ section }: { section: SectionOf<"gallery">; document: SiteDocument }) {
  const { title, subtitle, columns, items } = section.props;
  const cols = columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div className={`grid gap-4 ${cols}`}>
        {items.map((item, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[var(--wb-radius)]">
            <ImagePlaceholder src={item.image.src} alt={item.image.alt} ratio="aspect-square" />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm text-white">{item.caption}</p>
                {item.category && <p className="text-xs text-white/60">{item.category}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
