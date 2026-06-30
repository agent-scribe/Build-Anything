/**
 * useEditorStore.ts — the single source of editor truth (Zustand).
 * ------------------------------------------------------------------
 * The whole editor is "mutate the SiteDocument". Every visual-customizer
 * action is a small, typed mutation here. Includes:
 *   - immer for ergonomic immutable updates
 *   - persist (document only) so refreshes don't lose work
 *   - a built-in undo/redo history (no extra dependency)
 *   - a `generate` thunk that streams /api/generate into state
 */
"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import type { GenerationEvent } from "@/lib/ai/pipeline";
import type { GenerationBrief } from "@/lib/ai/generator-prompt";
import { createSection, createStarterSite, SAMPLE_SITE } from "@/lib/schema/defaults";
import type {
  Page,
  Section,
  SectionType,
  SiteDocument,
  Theme,
} from "@/lib/schema/page-schema";

export type EditorStatus =
  | "idle"
  | "planning"
  | "generating"
  | "validating"
  | "repairing"
  | "done"
  | "error";

interface EditorState {
  document: SiteDocument | null;
  activePageId: string | null;
  selectedSectionId: string | null;

  // generation
  status: EditorStatus;
  statusMessage: string;
  streamPreview: string;
  plan: string[] | null;
  usedMock: boolean;
  error: string | null;

  // history
  past: SiteDocument[];
  future: SiteDocument[];

  // lifecycle
  setDocument: (doc: SiteDocument) => void;
  newProject: (name?: string) => void;
  loadSample: () => void;

  // selection
  selectSection: (id: string | null) => void;
  setActivePage: (id: string) => void;

  // section mutations
  updateSectionProps: (sectionId: string, patch: Record<string, unknown>) => void;
  setSectionField: <K extends keyof Section>(sectionId: string, key: K, value: Section[K]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  reorderSections: (from: number, to: number) => void;
  addSection: (type: SectionType, atIndex?: number) => void;
  duplicateSection: (sectionId: string) => void;
  removeSection: (sectionId: string) => void;

  // theme mutations
  setThemeColor: (key: keyof Theme["colors"], hex: string) => void;
  setThemeToken: (patch: Partial<Pick<Theme, "radius" | "mode" | "density">>) => void;
  setFont: (role: "heading" | "body", family: string) => void;

  // history
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // engine
  generate: (brief: GenerationBrief) => Promise<void>;
}

const HISTORY_LIMIT = 50;

export const useEditorStore = create<EditorState>()(
  persist(
    immer((set, get) => {
      /** Snapshot current doc into history, then apply a mutation to the draft. */
      const commit = (recipe: (doc: SiteDocument) => void) => {
        const current = get().document;
        if (!current) return;
        set((s) => {
          s.past.push(structuredClone(current));
          if (s.past.length > HISTORY_LIMIT) s.past.shift();
          s.future = [];
          if (s.document) recipe(s.document);
        });
      };

      const findActivePage = (doc: SiteDocument, activePageId: string | null): Page | undefined =>
        doc.pages.find((p) => p.id === activePageId) ?? doc.pages[0];

      const handleEvent = (event: GenerationEvent) => {
        switch (event.type) {
          case "status":
            set((s) => {
              s.status = event.stage === "done" ? "done" : (event.stage as EditorStatus);
              s.statusMessage = event.message;
            });
            break;
          case "plan":
            set((s) => {
              s.plan = event.order;
            });
            break;
          case "delta":
            set((s) => {
              s.streamPreview += event.text;
            });
            break;
          case "result":
            get().setDocument(event.document);
            set((s) => {
              s.status = "idle";
              s.statusMessage = "";
              s.usedMock = event.usedMock;
              s.streamPreview = "";
            });
            break;
          case "error":
            set((s) => {
              s.status = "error";
              s.error = event.issues?.length ? `${event.message} (${event.issues[0]})` : event.message;
            });
            break;
        }
      };

      return {
        document: null,
        activePageId: null,
        selectedSectionId: null,
        status: "idle",
        statusMessage: "",
        streamPreview: "",
        plan: null,
        usedMock: false,
        error: null,
        past: [],
        future: [],

        setDocument: (doc) =>
          set((s) => {
            s.document = doc;
            s.activePageId = doc.pages[0]?.id ?? null;
            s.selectedSectionId = doc.pages[0]?.sections[0]?.id ?? null;
            s.past = [];
            s.future = [];
            s.error = null;
          }),

        newProject: (name) => get().setDocument(createStarterSite(name)),
        loadSample: () => get().setDocument(structuredClone(SAMPLE_SITE)),

        selectSection: (id) =>
          set((s) => {
            s.selectedSectionId = id;
          }),

        setActivePage: (id) =>
          set((s) => {
            s.activePageId = id;
            const page = s.document?.pages.find((p) => p.id === id);
            s.selectedSectionId = page?.sections[0]?.id ?? null;
          }),

        updateSectionProps: (sectionId, patch) =>
          commit((doc) => {
            const page = findActivePage(doc, get().activePageId);
            const section = page?.sections.find((sec) => sec.id === sectionId);
            if (section) Object.assign(section.props as Record<string, unknown>, patch);
          }),

        setSectionField: (sectionId, key, value) =>
          commit((doc) => {
            const page = findActivePage(doc, get().activePageId);
            const section = page?.sections.find((sec) => sec.id === sectionId);
            if (section) (section as Record<string, unknown>)[key as string] = value;
          }),

        toggleSectionVisibility: (sectionId) =>
          commit((doc) => {
            const page = findActivePage(doc, get().activePageId);
            const section = page?.sections.find((sec) => sec.id === sectionId);
            if (section) section.visible = !section.visible;
          }),

        reorderSections: (from, to) =>
          commit((doc) => {
            const page = findActivePage(doc, get().activePageId);
            if (!page) return;
            if (from < 0 || to < 0 || from >= page.sections.length || to >= page.sections.length) return;
            const [moved] = page.sections.splice(from, 1);
            page.sections.splice(to, 0, moved);
          }),

        addSection: (type, atIndex) =>
          commit((doc) => {
            const page = findActivePage(doc, get().activePageId);
            if (!page) return;
            const section = createSection(type);
            const index = atIndex ?? page.sections.length;
            page.sections.splice(index, 0, section);
            // select the new section after commit
            queueMicrotask(() => get().selectSection(section.id));
          }),

        duplicateSection: (sectionId) =>
          commit((doc) => {
            const page = findActivePage(doc, get().activePageId);
            if (!page) return;
            const index = page.sections.findIndex((sec) => sec.id === sectionId);
            if (index === -1) return;
            const copy = structuredClone(page.sections[index]) as Section;
            copy.id = `${copy.type}-${Math.random().toString(36).slice(2, 7)}`;
            page.sections.splice(index + 1, 0, copy);
          }),

        removeSection: (sectionId) =>
          commit((doc) => {
            const page = findActivePage(doc, get().activePageId);
            if (!page || page.sections.length <= 1) return;
            page.sections = page.sections.filter((sec) => sec.id !== sectionId);
            if (get().selectedSectionId === sectionId) {
              queueMicrotask(() => get().selectSection(page.sections[0]?.id ?? null));
            }
          }),

        setThemeColor: (key, hex) =>
          commit((doc) => {
            doc.theme.colors[key] = hex;
          }),

        setThemeToken: (patch) =>
          commit((doc) => {
            Object.assign(doc.theme, patch);
          }),

        setFont: (role, family) =>
          commit((doc) => {
            doc.theme.fonts[role] = family;
          }),

        undo: () =>
          set((s) => {
            const prev = s.past.pop();
            if (!prev || !s.document) return;
            s.future.unshift(structuredClone(s.document));
            s.document = prev;
          }),

        redo: () =>
          set((s) => {
            const next = s.future.shift();
            if (!next || !s.document) return;
            s.past.push(structuredClone(s.document));
            s.document = next;
          }),

        canUndo: () => get().past.length > 0,
        canRedo: () => get().future.length > 0,

        generate: async (brief) => {
          set((s) => {
            s.status = "generating";
            s.statusMessage = "Designing your site";
            s.error = null;
            s.streamPreview = "";
            s.plan = null;
          });

          try {
            const res = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...brief, stream: false }),
            });
            const data = (await res.json().catch(() => ({}))) as {
              document?: SiteDocument;
              usedMock?: boolean;
              error?: string;
            };
            const doc = data.document;
            if (!res.ok || !doc) {
              throw new Error(data.error ?? `Request failed (${res.status})`);
            }
            set((s) => {
              s.plan = doc.pages[0]?.sections.map((sec) => sec.type) ?? null;
              s.status = "validating";
              s.statusMessage = "Validating layout";
            });
            await new Promise((r) => setTimeout(r, 250));
            get().setDocument(doc);
            set((s) => {
              s.status = "idle";
              s.statusMessage = "";
              s.usedMock = Boolean(data.usedMock);
              s.streamPreview = "";
            });
          } catch (err) {
            set((s) => {
              s.status = "error";
              s.error = err instanceof Error ? err.message : "Generation failed";
            });
          }
        },
      };
    }),
    {
      name: "webuild-editor",
      partialize: (state) => ({
        document: state.document,
        activePageId: state.activePageId,
        selectedSectionId: state.selectedSectionId,
      }),
    }
  )
);

/* ------------------------------------------------------------------ */
/* Convenience selectors                                               */
/* ------------------------------------------------------------------ */

export function useActivePage(): Page | null {
  return useEditorStore((s) => {
    if (!s.document) return null;
    return s.document.pages.find((p) => p.id === s.activePageId) ?? s.document.pages[0] ?? null;
  });
}

export function useSelectedSection(): Section | null {
  return useEditorStore((s) => {
    if (!s.document) return null;
    const page = s.document.pages.find((p) => p.id === s.activePageId) ?? s.document.pages[0];
    return page?.sections.find((sec) => sec.id === s.selectedSectionId) ?? null;
  });
}
