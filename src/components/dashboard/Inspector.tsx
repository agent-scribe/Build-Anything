"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEditorStore, useActivePage, useSelectedSection } from "@/lib/store/useEditorStore";
import { Icon } from "@/components/sections/_shared";
import { SECTION_META } from "@/components/sections";
import type { SectionType, Theme } from "@/lib/schema/page-schema";
import { SECTION_TYPES } from "@/lib/schema/page-schema";
import type { InspectorTab } from "./DashboardWorkspace";

/* ---- per-type editable scalar fields ---- */

type FieldDef =
  | { key: string; label: string; kind: "text" | "textarea" }
  | { key: string; label: string; kind: "select"; options: readonly string[] }
  | { key: "__ctaLabel" | "__ctaHref"; label: string; kind: "cta" };

const CONTENT_FIELDS: Partial<Record<SectionType, FieldDef[]>> = {
  navbar: [{ key: "logo", label: "Logo text", kind: "text" }],
  hero: [
    { key: "eyebrow", label: "Eyebrow", kind: "text" },
    { key: "headline", label: "Headline", kind: "textarea" },
    { key: "subheadline", label: "Subheadline", kind: "textarea" },
    { key: "__ctaLabel", label: "Button label", kind: "cta" },
    { key: "__ctaHref", label: "Button link", kind: "cta" },
  ],
  features: [
    { key: "title", label: "Title", kind: "text" },
    { key: "subtitle", label: "Subtitle", kind: "text" },
    { key: "columns", label: "Columns", kind: "select", options: ["2", "3", "4"] },
  ],
  products: [
    { key: "title", label: "Title", kind: "text" },
    { key: "subtitle", label: "Subtitle", kind: "text" },
    { key: "columns", label: "Columns", kind: "select", options: ["2", "3", "4"] },
  ],
  pricing: [
    { key: "title", label: "Title", kind: "text" },
    { key: "subtitle", label: "Subtitle", kind: "text" },
  ],
  testimonials: [
    { key: "title", label: "Title", kind: "text" },
    { key: "subtitle", label: "Subtitle", kind: "text" },
  ],
  faq: [
    { key: "title", label: "Title", kind: "text" },
    { key: "subtitle", label: "Subtitle", kind: "text" },
  ],
  cta: [
    { key: "headline", label: "Headline", kind: "textarea" },
    { key: "subheadline", label: "Subheadline", kind: "text" },
    { key: "__ctaLabel", label: "Button label", kind: "cta" },
  ],
  newsletter: [
    { key: "headline", label: "Headline", kind: "text" },
    { key: "subheadline", label: "Subheadline", kind: "text" },
    { key: "buttonLabel", label: "Button label", kind: "text" },
  ],
  logos: [{ key: "title", label: "Title", kind: "text" }],
  stats: [{ key: "title", label: "Title", kind: "text" }],
  footer: [
    { key: "logo", label: "Logo text", kind: "text" },
    { key: "tagline", label: "Tagline", kind: "text" },
    { key: "copyright", label: "Copyright", kind: "text" },
  ],
};

const VARIANTS: Record<SectionType, readonly string[]> = {
  navbar: ["simple", "centered", "split"],
  hero: ["centered", "split-left", "split-right", "minimal"],
  features: ["grid", "alternating", "cards"],
  products: ["grid", "carousel", "featured"],
  pricing: ["cards", "table"],
  testimonials: ["grid", "single", "marquee"],
  faq: ["accordion", "two-column"],
  cta: ["centered", "split", "banner"],
  newsletter: ["inline", "boxed"],
  logos: ["row", "grid"],
  stats: ["row", "cards"],
  footer: ["columns", "simple"],
};

const BACKGROUNDS = ["default", "muted", "card", "primary", "inverted"] as const;
const PADDINGS = ["none", "sm", "md", "lg", "xl"] as const;
const COLOR_KEYS: { key: keyof Theme["colors"]; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "foreground", label: "Foreground" },
  { key: "primary", label: "Primary" },
  { key: "primaryForeground", label: "On primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "muted", label: "Muted" },
  { key: "mutedForeground", label: "Muted text" },
  { key: "border", label: "Border" },
  { key: "card", label: "Card" },
  { key: "cardForeground", label: "Card text" },
];

export function Inspector({ tab, onTab }: { tab: InspectorTab; onTab: (t: InspectorTab) => void }) {
  const hasDoc = useEditorStore((s) => Boolean(s.document));

  return (
    <aside className="flex w-[300px] shrink-0 flex-col border-l border-zinc-800/80 bg-[#0b0b0e]">
      <div className="flex border-b border-zinc-800/80 p-1">
        {(["content", "layers", "theme"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onTab(t)}
            className={cn(
              "flex-1 rounded-lg py-1.5 text-xs font-medium capitalize transition-colors",
              tab === t ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {!hasDoc ? (
          <p className="px-1 pt-6 text-center text-xs text-zinc-600">
            Generate a site to start editing its sections, content, and theme.
          </p>
        ) : tab === "layers" ? (
          <LayersPanel />
        ) : tab === "content" ? (
          <ContentPanel />
        ) : (
          <ThemePanel />
        )}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Layers                                                              */
/* ------------------------------------------------------------------ */

function LayersPanel() {
  const page = useActivePage();
  const selectedId = useEditorStore((s) => s.selectedSectionId);
  const select = useEditorStore((s) => s.selectSection);
  const reorder = useEditorStore((s) => s.reorderSections);
  const toggle = useEditorStore((s) => s.toggleSectionVisibility);
  const remove = useEditorStore((s) => s.removeSection);
  const duplicate = useEditorStore((s) => s.duplicateSection);
  const addSection = useEditorStore((s) => s.addSection);
  const [adding, setAdding] = React.useState(false);

  if (!page) return null;

  return (
    <div className="space-y-1.5">
      {page.sections.map((section, index) => {
        const meta = SECTION_META[section.type];
        const selected = section.id === selectedId;
        return (
          <div
            key={section.id}
            onClick={() => select(section.id)}
            className={cn(
              "group flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm transition-colors",
              selected
                ? "border-[#6d5efc]/40 bg-[#6d5efc]/10 text-zinc-100"
                : "border-transparent text-zinc-300 hover:bg-zinc-900"
            )}
          >
            <Icon name={meta.icon} size={15} className={selected ? "text-[#a99bff]" : "text-zinc-500"} />
            <span className="flex-1 truncate capitalize">{meta.label}</span>
            <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <MiniBtn label="Move up" disabled={index === 0} onClick={(e) => { e.stopPropagation(); reorder(index, index - 1); }}>
                <ChevronUp size={13} />
              </MiniBtn>
              <MiniBtn label="Move down" disabled={index === page.sections.length - 1} onClick={(e) => { e.stopPropagation(); reorder(index, index + 1); }}>
                <ChevronDown size={13} />
              </MiniBtn>
              <MiniBtn label="Duplicate" onClick={(e) => { e.stopPropagation(); duplicate(section.id); }}>
                <Copy size={12} />
              </MiniBtn>
              <MiniBtn label="Delete" onClick={(e) => { e.stopPropagation(); remove(section.id); }}>
                <Trash2 size={12} />
              </MiniBtn>
            </div>
            <MiniBtn label="Toggle visibility" onClick={(e) => { e.stopPropagation(); toggle(section.id); }}>
              {section.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
            </MiniBtn>
          </div>
        );
      })}

      <div className="relative pt-1">
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-800 py-2 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
        >
          <Plus size={14} /> Add section
        </button>
        {adding ? (
          <div className="mt-1 grid max-h-64 grid-cols-1 gap-0.5 overflow-y-auto rounded-xl border border-zinc-800 bg-[#141418] p-1">
            {SECTION_TYPES.map((type) => {
              const meta = SECTION_META[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => { addSection(type); setAdding(false); }}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  <Icon name={meta.icon} size={14} className="text-zinc-500" />
                  <span className="flex-1">{meta.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Content (selected section)                                          */
/* ------------------------------------------------------------------ */

function ContentPanel() {
  const section = useSelectedSection();
  const sectionId = useEditorStore((s) => s.selectedSectionId);
  const updateProps = useEditorStore((s) => s.updateSectionProps);
  const setField = useEditorStore((s) => s.setSectionField);

  if (!section || !sectionId) {
    return <p className="px-1 pt-6 text-center text-xs text-zinc-600">Select a section on the canvas to edit it.</p>;
  }

  const props = section.props as Record<string, unknown>;
  const fields = CONTENT_FIELDS[section.type] ?? [];

  const writeCta = (sub: "label" | "href", value: string) => {
    const current = (props.primaryCta as Record<string, unknown>) ?? {};
    updateProps(sectionId, { primaryCta: { ...current, [sub]: value } });
  };

  return (
    <div className="space-y-4">
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {SECTION_META[section.type].label} content
      </p>

      {fields.map((f) => {
        if (f.kind === "cta") {
          const cta = (props.primaryCta as Record<string, string>) ?? {};
          const sub = f.key === "__ctaLabel" ? "label" : "href";
          return (
            <Field key={f.key} label={f.label}>
              <TextInput value={cta[sub] ?? ""} onChange={(v) => writeCta(sub as "label" | "href", v)} />
            </Field>
          );
        }
        if (f.kind === "select") {
          return (
            <Field key={f.key} label={f.label}>
              <SelectInput
                value={String(props[f.key] ?? f.options[0])}
                options={f.options}
                onChange={(v) => updateProps(sectionId, { [f.key]: f.key === "columns" ? Number(v) : v })}
              />
            </Field>
          );
        }
        return (
          <Field key={f.key} label={f.label}>
            {f.kind === "textarea" ? (
              <TextArea value={String(props[f.key] ?? "")} onChange={(v) => updateProps(sectionId, { [f.key]: v })} />
            ) : (
              <TextInput value={String(props[f.key] ?? "")} onChange={(v) => updateProps(sectionId, { [f.key]: v })} />
            )}
          </Field>
        );
      })}

      <div className="my-3 h-px bg-zinc-800" />
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-zinc-500">Layout</p>

      <Field label="Variant">
        <SelectInput
          value={section.variant}
          options={VARIANTS[section.type]}
          onChange={(v) => setField(sectionId, "variant", v as never)}
        />
      </Field>
      <Field label="Background">
        <SelectInput
          value={section.background ?? "default"}
          options={BACKGROUNDS}
          onChange={(v) => setField(sectionId, "background", v as never)}
        />
      </Field>
      <Field label="Padding">
        <SelectInput
          value={section.paddingY ?? "lg"}
          options={PADDINGS}
          onChange={(v) => setField(sectionId, "paddingY", v as never)}
        />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

function ThemePanel() {
  const theme = useEditorStore((s) => s.document?.theme);
  const setColor = useEditorStore((s) => s.setThemeColor);
  const setToken = useEditorStore((s) => s.setThemeToken);
  const setFont = useEditorStore((s) => s.setFont);
  if (!theme) return null;

  return (
    <div className="space-y-4">
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-zinc-500">Colors</p>
      <div className="space-y-2">
        {COLOR_KEYS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between gap-2">
            <span className="text-sm text-zinc-400">{label}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.colors[key]}
                onChange={(e) => setColor(key, e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border border-zinc-700 bg-transparent p-0"
              />
              <input
                type="text"
                value={theme.colors[key]}
                onChange={(e) => setColor(key, e.target.value)}
                className="w-20 rounded-md border border-zinc-800 bg-[#141418] px-2 py-1 text-xs text-zinc-300 focus:border-zinc-700 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="my-3 h-px bg-zinc-800" />
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-zinc-500">Style</p>
      <Field label="Mode">
        <SelectInput value={theme.mode} options={["light", "dark"]} onChange={(v) => setToken({ mode: v as Theme["mode"] })} />
      </Field>
      <Field label="Radius">
        <SelectInput value={theme.radius} options={["none", "sm", "md", "lg", "xl", "full"]} onChange={(v) => setToken({ radius: v as Theme["radius"] })} />
      </Field>
      <Field label="Density">
        <SelectInput value={theme.density} options={["compact", "comfortable", "spacious"]} onChange={(v) => setToken({ density: v as Theme["density"] })} />
      </Field>
      <Field label="Heading font">
        <TextInput value={theme.fonts.heading} onChange={(v) => setFont("heading", v)} />
      </Field>
      <Field label="Body font">
        <TextInput value={theme.fonts.body} onChange={(v) => setFont("body", v)} />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dark-UI atoms                                                       */
/* ------------------------------------------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-zinc-800 bg-[#141418] px-2.5 py-1.5 text-sm text-zinc-200 focus:border-zinc-700 focus:outline-none"
    />
  );
}

function TextArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={2}
      className="w-full resize-none rounded-lg border border-zinc-800 bg-[#141418] px-2.5 py-1.5 text-sm text-zinc-200 focus:border-zinc-700 focus:outline-none"
    />
  );
}

function SelectInput({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-zinc-800 bg-[#141418] px-2.5 py-1.5 text-sm text-zinc-200 focus:border-zinc-700 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#141418]">
          {o}
        </option>
      ))}
    </select>
  );
}

function MiniBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
