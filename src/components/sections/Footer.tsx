import type { SectionOf } from "@/lib/schema/page-schema";
import { Icon, SectionShell } from "./_shared";

export function Footer({ section }: { section: SectionOf<"footer"> }) {
  const { logo, tagline, columns, socials, copyright } = section.props;

  return (
    <SectionShell section={section}>
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <div className="max-w-xs">
          <span className="text-lg font-semibold" style={{ fontFamily: "var(--wb-font-heading)" }}>
            {logo}
          </span>
          {tagline ? (
            <p className="mt-2 text-sm" style={{ color: "var(--wb-muted-fg)" }}>
              {tagline}
            </p>
          ) : null}
          {socials.length ? (
            <div className="mt-4 flex gap-3">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--wb-radius)] transition-opacity hover:opacity-80"
                  style={{ background: "var(--wb-muted)", color: "var(--wb-fg)" }}
                >
                  <Icon name={s.platform} size={16} />
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="mb-3 text-sm font-medium">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((link, li) => (
                  <li key={li}>
                    <a
                      href={link.href}
                      className="text-sm transition-opacity hover:opacity-80"
                      style={{ color: "var(--wb-muted-fg)" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-10 border-t pt-6 text-xs" style={{ borderColor: "var(--wb-border)", color: "var(--wb-muted-fg)" }}>
        {copyright}
      </p>
    </SectionShell>
  );
}
