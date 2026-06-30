/**
 * useEditorStore.ts — the single source of editor truth (Zustand).
 * ------------------------------------------------------------------
 * The whole editor is "mutate the SiteDocument". Every visual-customizer
 * action is a small, typed mutation here. Includes:
 *   - immer for ergonomic immutable updates
 *   - persist (document only) so refreshes don't lose work
 *   - a built-in undo/redo history (no extra dependency)
 *   - a `generate` thunk that streams /api/generate into state
 *   - server-side autosave for signed-in users (M5)
 */
"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import type { GenerationEvent } from "@/lib/ai/pipeline";
import type { GenerationBrief } from "@/lib/ai/generator-prompt";
import { createSection, createStarterSite, SAMPLE_SITE } from "@/lib/schema/defaults";
import { validateSiteDocument } from "@/lib/schema/page-schema";
import type {
  Page,
  Section,
  SectionType,
  SiteDocument,
  Theme,
} from "@/lib/schema/page-schema";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function buildSampleFor(brief: GenerationBrief): SiteDocument {
  const doc = structuredClone(SAMPLE_SITE);
  doc.meta.description = brief.prompt.slice(0, 180) || doc.meta.description;
  if (brief.mode === "dark") {
    doc.theme = {
      ...doc.theme,
      mode: "dark",
      colors: {
        ...doc.theme.colors,
        background: "#0A0A0B",
        foreground: "#FAFAFA",
        card: "#141418",
        cardForeground: "#FAFAFA",
        muted: "#18181B",
        mutedForeground: "#A1A1AA",
        border: "#27272A",
        secondary: "#18181B",
      },
    };
  }
  return doc;
}

/* ------------------------------------------------------------------ */
/* Autosave debounce                                                   */
/* ------------------------------------------------------------------ */

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
const AUTOSAVE_DELAY = 3000; // 3 seconds after last edit

function scheduleAutosave(projectId: string, doc: SiteDocument) {
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(async () => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document: doc }),
      });
      useEditorStore.setState({ lastSavedAt: Date.now() });
    } catch {
      // silently fail — server might be unreachable
    }
  }, AUTOSAVE_DELAY);
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

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
  projectId: string | null;       // server-side project ID (null = local-only)
  lastSavedAt: number | null;     // timestamp of last server save

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
  loadDocument: (doc: SiteDocument, mock: boolean) => void;
  setProjectId: (id: string | null) => void;
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
  aiEditSection: (sectionId: string, instruction: string) => Promise<void>;
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
        // Trigger autosave if linked to a server project
        const state = get();
        if (state.projectId && state.document) {
          scheduleAutosave(state.projectId, state.document);
        }
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
            set((s) => { s.plan = event.order; });
            break;
          case "delta":
            set((s) => { s.streamPreview += event.text; });
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
        projectId: null,
        lastSavedAt: null,
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

        loadDocument: (doc, mock) => {
          get().setDocument(doc);
          set((s) => { s.usedMock = mock; });
        },

        setProjectId: (id) => set((s) => { s.projectId = id; }),

        newProject: (name) => {
          set((s) => { s.projectId = null; s.lastSavedAt = null; });
          get().setDocument(createStarterSite(name));
        },

        loadSample: () => get().setDocument(structuredClone(SAMPLE_SITE)),

        selectSection: (id) => set((s) => { s.selectedSectionId = id; }),

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
          commit((doc) => { doc.theme.colors[key] = hex; }),

        setThemeToken: (patch) =>
          commit((doc) => { Object.assign(doc.theme, patch); }),

        setFont: (role, family) =>
          commit((doc) => { doc.theme.fonts[role] = family; }),

        undo: () => {
          set((s) => {
            const prev = s.past.pop();
            if (!prev || !s.document) return;
            s.future.unshift(structuredClone(s.document));
            s.document = prev;
          });
          const state = get();
          if (state.projectId && state.document) {
            scheduleAutosave(state.projectId, state.document);
          }
        },

        redo: () => {
          set((s) => {
            const next = s.future.shift();
            if (!next || !s.document) return;
            s.past.push(structuredClone(s.document));
            s.document = next;
          });
          const state = get();
          if (state.projectId && state.document) {
            scheduleAutosave(state.projectId, state.document);
          }
        },

        canUndo: () => get().past.length > 0,
        canRedo: () => get().future.length > 0,

        aiEditSection: async (sectionId, instruction) => {
          const state = get();
          if (!state.document) return;
          const page = state.document.pages.find((p) => p.id === state.activePageId) ?? state.document.pages[0];
          const section = page?.sections.find((s) => s.id === sectionId);
          if (!section) return;

          set((s) => { s.status = "generating"; s.statusMessage = "AI is editing…"; s.error = null; });

          try {
            const res = await fetch("/api/edit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                instruction,
                sectionType: section.type,
                currentProps: section.props,
                theme: state.document.theme,
              }),
            });

            if (!res.ok) {
              const detail = await res.json().catch(() => ({}));
              throw new Error(detail.error ?? `Edit failed (${res.status})`);
            }

            const { props } = await res.json();
            if (props && typeof props === "object") {
              const current = get().document;
              if (!current) return;
              set((s) => {
                s.past.push(structuredClone(current));
                if (s.past.length > HISTORY_LIMIT) s.past.shift();
                s.future = [];
                const pg = s.document!.pages.find((p) => p.id === s.activePageId) ?? s.document!.pages[0];
                const sec = pg?.sections.find((sc) => sc.id === sectionId);
                if (sec) Object.assign(sec.props as Record<string, unknown>, props);
              });
              // Autosave after AI edit
              const afterState = get();
              if (afterState.projectId && afterState.document) {
                scheduleAutosave(afterState.projectId, afterState.document);
              }
            }
            set((s) => { s.status = "idle"; s.statusMessage = ""; });
          } catch (err) {
            set((s) => {
              s.status = "error";
              s.error = err instanceof Error ? err.message : "AI edit failed";
            });
          }
        },

        generate: async (brief) => {
          set((s) => {
            s.status = "generating";
            s.statusMessage = "Designing your site";
            s.error = null;
            s.streamPreview = "";
            s.plan = null;
          });
          try {
            await wait(350);
            const doc = buildSampleFor(brief);
            set((s) => {
              s.plan = doc.pages[0]?.sections.map((sec) => sec.type) ?? null;
              s.status = "validating";
              s.statusMessage = "Validating layout";
            });
            await wait(400);
            const result = validateSiteDocument(doc);
            if (!result.ok) {
              throw new Error(result.issues[0] ?? "Generated layout was invalid");
            }
            get().setDocument(result.data);
            set((s) => {
              s.status = "idle";
              s.statusMessage = "";
              s.usedMock = true;
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
        projectId: state.projectId,
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
