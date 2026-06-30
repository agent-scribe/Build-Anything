"use client";

import * as React from "react";
import { Loader2, MousePointerClick, Sparkles } from "lucide-react";
import { useEditorStore, useActivePage } from "@/lib/store/useEditorStore";
import { ThemeProvider } from "@/components/renderer/ThemeProvider";
import { PageRenderer } from "@/components/renderer/PageRenderer";
import { InlineEditProvider } from "@/lib/store/InlineEditContext";
import type { Device, ViewMode } from "./DashboardWorkspace";

const WIDTH: Record<Device, string> = {
  desktop: "100%",
  tablet: "820px",
  mobile: "390px",
};

export function CanvasPreview({ view, device }: { view: ViewMode; device: Device }) {
  const document = useEditorStore((s) => s.document);
  const page = useActivePage();
  const selectedId = useEditorStore((s) => s.selectedSectionId);
  const selectSection = useEditorStore((s) => s.selectSection);
  const updateProps = useEditorStore((s) => s.updateSectionProps);
  const status = useEditorStore((s) => s.status);
  const statusMessage = useEditorStore((s) => s.statusMessage);

  const busy = status !== "idle" && status !== "error" && status !== "done";
  const editable = view === "design";

  /** Commit an inline text edit back to the store. propPath supports:
   *  - "headline" (top-level prop)
   *  - "primaryCta.label" (nested object)
   *  - "items.0.title" (array item field)
   */
  const handleInlineCommit = React.useCallback(
    (sectionId: string, propPath: string, value: string) => {
      const parts = propPath.split(".");
      if (parts.length === 1) {
        updateProps(sectionId, { [propPath]: value });
        return;
      }

      const state = useEditorStore.getState();
      const pg = state.document?.pages.find((p) => p.id === state.activePageId) ?? state.document?.pages[0];
      const section = pg?.sections.find((s) => s.id === sectionId);
      if (!section) return;
      const props = section.props as Record<string, unknown>;

      if (parts.length === 3 && !isNaN(Number(parts[1]))) {
        // Array path like "items.0.title"
        const arr = [...((props[parts[0]] as unknown[]) ?? [])];
        const idx = Number(parts[1]);
        if (idx < arr.length) {
          arr[idx] = { ...(arr[idx] as Record<string, unknown>), [parts[2]]: value };
          updateProps(sectionId, { [parts[0]]: arr });
        }
      } else {
        // Object path like "primaryCta.label"
        const parent = { ...(props[parts[0]] as Record<string, unknown>) };
        parent[parts[1]] = value;
        updateProps(sectionId, { [parts[0]]: parent });
      }
    },
    [updateProps]
  );

  return (
    <div className="relative flex-1 overflow-auto bg-[#0e0e11] p-4 md:p-6">
      {busy && !document ? (
        <SkeletonState message={statusMessage} />
      ) : !document || !page ? (
        <EmptyState />
      ) : (
        <div className="mx-auto transition-[max-width] duration-300" style={{ maxWidth: WIDTH[device] }}>
          <div className="overflow-hidden rounded-xl border border-zinc-800 shadow-2xl">
            <InlineEditProvider enabled={editable} onCommit={handleInlineCommit}>
              <ThemeProvider theme={document.theme}>
                <PageRenderer
                  page={page}
                  document={document}
                  selectedId={editable ? selectedId : null}
                  onSelect={editable ? selectSection : undefined}
                />
              </ThemeProvider>
            </InlineEditProvider>
          </div>
          {editable ? (
            <p className="mt-3 text-center text-xs text-zinc-600">
              Click any section to select it · Double-click text to edit inline
            </p>
          ) : null}
        </div>
      )}

      {busy && document ? (
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-10">
          <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-[#141418]/90 px-4 py-2 text-xs text-zinc-300 backdrop-blur">
            <Loader2 size={13} className="animate-spin text-[#a99bff]" />
            {statusMessage || "Regenerating…"}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[420px] items-center justify-center">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-[#141418]">
          <Sparkles size={26} className="text-[#a99bff]" />
        </div>
        <h2 className="text-lg font-medium text-zinc-200">Describe your site to begin</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Write a prompt above and WeBuild generates a complete, editable layout. Or load the sample
          store from the sidebar to explore.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 text-xs text-zinc-600">
          <MousePointerClick size={13} />
          Everything you generate is fully editable
        </div>
      </div>
    </div>
  );
}

function SkeletonState({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#141418]">
        <div className="space-y-6 p-10">
          <div className="mx-auto h-3 w-24 animate-pulse rounded bg-zinc-800" />
          <div className="mx-auto h-10 w-2/3 animate-pulse rounded bg-zinc-800" />
          <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-zinc-800/70" />
          <div className="mx-auto h-9 w-32 animate-pulse rounded-lg bg-zinc-800" />
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-zinc-800/60" />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-400">
        <Loader2 size={14} className="animate-spin text-[#a99bff]" />
        {message || "Designing your site…"}
      </p>
    </div>
  );
}
