import type { SectionOf } from "@/lib/schema/page-schema";
import { SectionShell, SiteButton } from "./_shared";

export function Navbar({ section }: { section: SectionOf<"navbar"> }) {
  const { logo, links, cta, sticky } = section.props;
  const centered = section.variant === "centered";
  return (
    <SectionShell
      section={section}
      className={sticky ? "sticky top-0 z-20 backdrop-blur-sm" : undefined}
    >
      <nav
        className={
          centered
            ? "grid grid-cols-3 items-center gap-4"
            : "flex items-center justify-between gap-4"
        }
      >
        <span
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--wb-font-heading)" }}
        >
          {logo}
        </span>
        <div
          className={`hidden items-center gap-7 md:flex ${centered ? "justify-center" : "ml-auto mr-2"}`}
          style={{ color: "var(--wb-muted-fg)" }}
        >
          {links.map((l, i) => (
            <a key={i} href={l.href} className="text-sm transition-opacity hover:opacity-80">
              {l.label}
            </a>
          ))}
        </div>
        <div className={centered ? "justify-self-end" : ""}>{cta ? <SiteButton link={cta} /> : null}</div>
      </nav>
    </SectionShell>
  );
}
