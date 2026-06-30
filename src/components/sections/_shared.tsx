/**
 * _shared.tsx — primitives every section is built from.
 * Theme is delivered as CSS variables (set by ThemeProvider), so these
 * stay theme-agnostic and the same components power both the live canvas
 * and the static export.
 */
import * as React from "react";
import { icons as lucideIcons } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Link as LinkModel, Section, Theme } from "@/lib/schema/page-schema";

/* ---- theme → CSS variables ---- */

const RADIUS_PX: Record<Theme["radius"], string> = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  full: "9999px",
};

export function themeStyle(theme: Theme): React.CSSProperties {
  const c = theme.colors;
  return {
    // colors
    ["--wb-bg" as string]: c.background,
    ["--wb-fg" as string]: c.foreground,
    ["--wb-primary" as string]: c.primary,
    ["--wb-primary-fg" as string]: c.primaryForeground,
    ["--wb-secondary" as string]: c.secondary,
    ["--wb-accent" as string]: c.accent,
    ["--wb-muted" as string]: c.muted,
    ["--wb-muted-fg" as string]: c.mutedForeground,
    ["--wb-border" as string]: c.border,
    ["--wb-card" as string]: c.card,
    ["--wb-card-fg" as string]: c.cardForeground,
    ["--wb-radius" as string]: RADIUS_PX[theme.radius],
    ["--wb-font-heading" as string]: `'${theme.fonts.heading}', system-ui, sans-serif`,
    ["--wb-font-body" as string]: `'${theme.fonts.body}', system-ui, sans-serif`,
    backgroundColor: "var(--wb-bg)",
    color: "var(--wb-fg)",
    fontFamily: "var(--wb-font-body)",
  } as React.CSSProperties;
}

/* ---- surface (section background token) ---- */

export function surfaceVars(bg: Section["background"]): React.CSSProperties {
  switch (bg) {
    case "muted":
      return { background: "var(--wb-muted)", color: "var(--wb-fg)" };
    case "card":
      return { background: "var(--wb-card)", color: "var(--wb-card-fg)" };
    case "primary":
      return { background: "var(--wb-primary)", color: "var(--wb-primary-fg)" };
    case "inverted":
      return { background: "var(--wb-fg)", color: "var(--wb-bg)" };
    default:
      return { background: "var(--wb-bg)", color: "var(--wb-fg)" };
  }
}

const PAD_Y: Record<NonNullable<Section["paddingY"]>, string> = {
  none: "py-0",
  sm: "py-8",
  md: "py-14",
  lg: "py-20 md:py-24",
  xl: "py-24 md:py-32",
};

/* ---- SectionShell — wraps every section ---- */

export function SectionShell({
  section,
  className,
  children,
}: {
  section: Section;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={section.id}
      style={surfaceVars(section.background)}
      className={cn("w-full px-6", PAD_Y[section.paddingY ?? "lg"], className)}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/* ---- Heading block ---- */

export function HeadingBlock({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <h2
        className="text-3xl font-semibold tracking-tight md:text-4xl"
        style={{ fontFamily: "var(--wb-font-heading)" }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-lg" style={{ color: "var(--wb-muted-fg)" }}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/* ---- Button ---- */

export function SiteButton({ link, className }: { link: LinkModel; className?: string }) {
  const base =
    "inline-flex items-center justify-center rounded-[var(--wb-radius)] px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90";
  const styleByVariant: Record<LinkModel["variant"], React.CSSProperties> = {
    primary: { background: "var(--wb-primary)", color: "var(--wb-primary-fg)" },
    secondary: { background: "var(--wb-secondary)", color: "var(--wb-fg)" },
    ghost: { background: "transparent", color: "inherit", border: "1px solid var(--wb-border)" },
    link: { background: "transparent", color: "var(--wb-primary)", padding: 0 },
  };
  return (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      className={cn(base, className)}
      style={styleByVariant[link.variant]}
    >
      {link.label}
    </a>
  );
}

/* ---- Icon resolver (lucide by string name) ---- */

function toPascalCase(name: string): string {
  return name
    .replace(/(^\w|[-_\s]\w)/g, (m) => m.replace(/[-_\s]/, "").toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const key = toPascalCase(name) as keyof typeof lucideIcons;
  const Cmp = (lucideIcons[key] ?? lucideIcons.Sparkles) as React.ComponentType<LucideProps>;
  return <Cmp {...props} />;
}

/* ---- styled image placeholder (export + canvas share the look) ---- */

export function ImagePlaceholder({
  alt,
  className,
  ratio = "aspect-[4/3]",
}: {
  alt: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "flex items-center justify-center rounded-[var(--wb-radius)] text-xs",
        ratio,
        className
      )}
      style={{ background: "var(--wb-muted)", color: "var(--wb-muted-fg)" }}
    >
      <span className="px-3 text-center">{alt}</span>
    </div>
  );
}
