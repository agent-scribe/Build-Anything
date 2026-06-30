"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PromptComposer } from "./PromptComposer";
import { CanvasPreview } from "./CanvasPreview";
import { Inspector } from "./Inspector";

export type ViewMode = "design" | "preview";
export type Device = "desktop" | "tablet" | "mobile";
export type InspectorTab = "content" | "layers" | "theme";

/**
 * The generator dashboard. A dark "app chrome" (Linear/Vercel feel) wraps a
 * live canvas that renders the generated site in its OWN theme. Editor truth
 * lives in the Zustand store; this component only owns ephemeral view state.
 */
export function DashboardWorkspace() {
  const [view, setView] = React.useState<ViewMode>("design");
  const [device, setDevice] = React.useState<Device>("desktop");
  const [inspectorTab, setInspectorTab] = React.useState<InspectorTab>("content");

  // Guard against SSR/persisted-store hydration mismatch.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-zinc-200 antialiased">
      <Sidebar panel={inspectorTab} onPanel={setInspectorTab} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar view={view} onView={setView} device={device} onDevice={setDevice} />
        <div className="flex min-h-0 flex-1">
          <main className="flex min-w-0 flex-1 flex-col">
            <PromptComposer />
            {mounted ? (
              <CanvasPreview view={view} device={device} />
            ) : (
              <div className="flex-1 bg-[#0e0e11]" />
            )}
          </main>
          <Inspector tab={inspectorTab} onTab={setInspectorTab} />
        </div>
      </div>
    </div>
  );
}
