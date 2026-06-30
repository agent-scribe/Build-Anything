"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

/* Sections that have editable item arrays */
const ITEM_SECTIONS = new Set<SectionType>(["features", "testimonials", "faq", "pricing", "stats", "logos"]);

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
/* Layers — now with drag-and-drop via dnd-kit                         */
/* ------------------------------------------------------------------ */

function SortableLayer({
  section,
  index,
  total,
  selected,
  onSelect,
  onToggle,
  onRemove,
  onDuplicate,
}: {
  section: { id: string; type: SectionType; visible?: boolean };
  index: number;
  total: number;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  const meta = SECTION_META[section.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        "group flex items-center gap-1.5 rounded-lg border px-1.5 py-1.5 text-sm transition-colors",
        selected
          ? "border-[#6d5efc]/40 bg-[#6d5efc]/10 text-zinc-100"
          : "border-transparent text-zinc-300 hover:bg-zinc-900"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-zinc-600 hover:text-zinc-300 active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <Icon name={meta.icon} size={15} className={selected ? "text-[#a99bff]" : "text-zinc-500"} />
      <span className="flex-1 truncate capitalize">{meta.label}</span>
      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <MiniBtn label="Duplicate" onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
          <Copy size={12} />
        </MiniBtn>
        <MiniBtn label="Delete" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
          <Trash2 size={12} />
        </MiniBtn>
      </div>
      <MiniBtn label="Toggle visibility" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
        {section.visible === false ? <EyeOff size={13} /> : <Eye size={13} />}
      </MiniBtn>
    </div>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!page) return null;

  const sectionIds = page.sections.map((s) => s.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionIds.indexOf(active.id as string);
    const newIndex = sectionIds.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorder(oldIndex, newIndex);
    }
  }

  return (
    <div className="space-y-1.5">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
          {page.sections.map((section, index) => (
            <SortableLayer
              key={section.id}
              section={section}
              index={index}
              total={page.sections.length}
              selected={section.id === selectedId}
              onSelect={() => select(section.id)}
              onToggle={() => toggle(section.id)}
              onRemove={() => remove(section.id)}
              onDuplicate={() => duplicate(section.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

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
/* Content (selected section) — now with per-item editing              */
/* ------------------------------------------------------------------ */

function ContentPanel() {
  const section = useSelectedSection();
  const sectionId = useEditorStore((s) => s.selectedSectionId);
  const updateProps = useEditorStore((s) => s.updateSectionProps);
  const setField = useEditorStore((s) => s.setSectionField);

  const aiEdit = useEditorStore((s) => s.aiEditSection);
  const status = useEditorStore((s) => s.status);
  const [aiInstruction, setAiInstruction] = React.useState("");

  if (!section || !sectionId) {
    return <p className="px-1 pt-6 text-center text-xs text-zinc-600">Select a section on the canvas to edit it.</p>;
  }

  const aiEditing = status === "generating";
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

      {/* Per-item editing for sections with arrays */}
      {ITEM_SECTIONS.has(section.type) && (
        <ItemEditor sectionId={sectionId} sectionType={section.type} props={props} updateProps={updateProps} />
      )}

      {/* AI-assisted edit */}
      <div className="my-3 h-px bg-zinc-800" />
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-zinc-500">AI Edit</p>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={aiInstruction}
          onChange={(e) => setAiInstruction(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && aiInstruction.trim() && !aiEditing) {
              aiEdit(sectionId, aiInstruction.trim());
              setAiInstruction("");
            }
          }}
          placeholder="e.g. make it warmer, add urgency…"
          disabled={aiEditing}
          className="flex-1 rounded-lg border border-zinc-800 bg-[#141418] px-2.5 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-700 focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          disabled={!aiInstruction.trim() || aiEditing}
          onClick={() => { aiEdit(sectionId, aiInstruction.trim()); setAiInstruction(""); }}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6d5efc] text-white transition-opacity hover:opacity-90 disabled:opacity-30"
          aria-label="Apply AI edit"
        >
          {aiEditing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
        </button>
      </div>

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
/* ItemEditor — add/remove/edit items in array-based sections          */
/* ------------------------------------------------------------------ */

interface ItemEditorProps {
  sectionId: string;
  sectionType: SectionType;
  props: Record<string, unknown>;
  updateProps: (id: string, patch: Record<string, unknown>) => void;
}

type ItemShape = Record<string, unknown>;

const ITEM_FIELD_MAP: Partial<Record<SectionType, { arrayKey: string; fields: { key: string; label: string }[]; defaults: ItemShape }>> = {
  features: {
    arrayKey: "items",
    fields: [
      { key: "icon", label: "Icon" },
      { key: "title", label: "Title" },
      { key: "description", label: "Description" },
    ],
    defaults: { icon: "star", title: "New Feature", description: "Describe this feature." },
  },
  testimonials: {
    arrayKey: "items",
    fields: [
      { key: "quote", label: "Quote" },
      { key: "author", label: "Author" },
      { key: "role", label: "Role" },
    ],
    defaults: { quote: "Great product!", author: "Jane Doe", role: "CEO" },
  },
  faq: {
    arrayKey: "items",
    fields: [
      { key: "question", label: "Question" },
      { key: "answer", label: "Answer" },
    ],
    defaults: { question: "New question?", answer: "Answer goes here." },
  },
  pricing: {
    arrayKey: "plans",
    fields: [
      { key: "name", label: "Plan name" },
      { key: "price", label: "Price" },
      { key: "period", label: "Period" },
      { key: "description", label: "Description" },
    ],
    defaults: { name: "New Plan", price: "$0", period: "/mo", description: "Plan description", features: ["Feature 1"], cta: { label: "Get started", href: "#", variant: "primary" }, highlighted: false },
  },
  stats: {
    arrayKey: "items",
    fields: [
      { key: "value", label: "Value" },
      { key: "label", label: "Label" },
    ],
    defaults: { value: "100+", label: "New Stat" },
  },
  logos: {
    arrayKey: "logos",
    fields: [
      { key: "name", label: "Name" },
    ],
    defaults: { name: "Brand" },
  },
};

function ItemEditor({ sectionId, sectionType, props, updateProps }: ItemEditorProps) {
  const config = ITEM_FIELD_MAP[sectionType];
  if (!config) return null;

  const items = (props[config.arrayKey] as ItemShape[]) ?? [];
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  function updateItem(index: number, key: string, value: string) {
    const updated = items.map((item, i) => i === index ? { ...item, [key]: value } : item);
    updateProps(sectionId, { [config.arrayKey]: updated });
  }

  function addItem() {
    updateProps(sectionId, { [config.arrayKey]: [...items, { ...config.defaults }] });
    setExpandedIndex(items.length);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    updateProps(sectionId, { [config.arrayKey]: items.filter((_, i) => i !== index) });
    setExpandedIndex(null);
  }

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    updateProps(sectionId, { [config.arrayKey]: updated });
    setExpandedIndex(to);
  }

  return (
    <>
      <div className="my-3 h-px bg-zinc-800" />
      <div className="flex items-center justify-between">
        <p className="px-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
          {config.arrayKey === "plans" ? "Plans" : config.arrayKey === "logos" ? "Logos" : "Items"} ({items.length})
        </p>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-1">
        {items.map((item, index) => {
          const label = String(item[config.fields[0].key] ?? `Item ${index + 1}`);
          const isExpanded = expandedIndex === index;
          return (
            <div key={index} className="rounded-lg border border-zinc-800/60 bg-[#111114]">
              <div
                className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm text-zinc-300"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <Pencil size={12} className="text-zinc-600" />
                <span className="flex-1 truncate">{label}</span>
                <div className="flex items-center gap-0.5">
                  <MiniBtn label="Move up" disabled={index === 0} onClick={(e) => { e.stopPropagation(); moveItem(index, index - 1); }}>
                    <ChevronUp size={12} />
                  </MiniBtn>
                  <MiniBtn label="Move down" disabled={index === items.length - 1} onClick={(e) => { e.stopPropagation(); moveItem(index, index + 1); }}>
                    <ChevronDown size={12} />
                  </MiniBtn>
                  <MiniBtn label="Remove" disabled={items.length <= 1} onClick={(e) => { e.stopPropagation(); removeItem(index); }}>
                    <X size={12} />
                  </MiniBtn>
                </div>
              </div>
              {isExpanded && (
                <div className="space-y-2 border-t border-zinc-800/40 px-2 py-2">
                  {config.fields.map((f) => (
                    <Field key={f.key} label={f.label}>
                      <TextInput value={String(item[f.key] ?? "")} onChange={(v) => updateItem(index, f.key, v)} />
                    </Field>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
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
