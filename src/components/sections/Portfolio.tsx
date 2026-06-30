import type { SectionOf, SiteDocument } from "@/lib/schema/page-schema";
import { HeadingBlock, ImagePlaceholder, SectionShell } from "./_shared";

export function Portfolio({ section }: { section: SectionOf<"portfolio">; document: SiteDocument }) {
  const { title, subtitle, columns, projects } = section.props;
  const cols = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <SectionShell section={section}>
      <HeadingBlock title={title} subtitle={subtitle} />
      <div className={`grid gap-6 ${cols}`}>
        {projects.map((proj, i) => (
          <a key={i} href={proj.href} className="group overflow-hidden rounded-[var(--wb-radius)]" style={{ background: "var(--wb-card)", border: "1px solid var(--wb-border)" }}>
            {proj.image && <ImagePlaceholder src={proj.image.src} alt={proj.title} ratio="aspect-video" className="!rounded-none transition-transform group-hover:scale-105" />}
            <div className="p-4">
              {proj.category && <span className="text-xs font-medium" style={{ color: "var(--wb-primary)" }}>{proj.category}</span>}
              <h3 className="mt-1 font-semibold" style={{ fontFamily: "var(--wb-font-heading)" }}>{proj.title}</h3>
              {proj.description && <p className="mt-1 text-sm" style={{ color: "var(--wb-muted-fg)" }}>{proj.description}</p>}
            </div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}
