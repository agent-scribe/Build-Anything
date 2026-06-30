"use client";

import * as React from "react";
import {
  FilePlus2,
  Layers,
  Palette,
  Settings,
  ShoppingBag,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEditorStore } from "@/lib/store/useEditorStore";
import type { InspectorTab } from "./DashboardWorkspace";

function RailButton({
  icon: IconCmp,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "group flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
        active ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
      )}
    >
      <IconCmp size={19} strokeWidth={1.75} />
    </button>
  );
}

export function Sidebar({
  panel,
  onPanel,
}: {
  panel: InspectorTab;
  onPanel: (tab: InspectorTab) => void;
}) {
  const newProject = useEditorStore((s) => s.newProject);
  const loadSample = useEditorStore((s) => s.loadSample);

  return (
    <aside className="flex w-14 flex-col items-center gap-1 border-r border-zinc-800/80 bg-[#0b0b0e] py-3">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#6d5efc]">
        <Sparkles size={18} className="text-white" />
      </div>

      <RailButton icon={Wand2} label="Generate" active={panel === "content"} onClick={() => onPanel("content")} />
      <RailButton icon={Layers} label="Layers" active={panel === "layers"} onClick={() => onPanel("layers")} />
      <RailButton icon={Palette} label="Theme" active={panel === "theme"} onClick={() => onPanel("theme")} />
      <RailButton icon={ShoppingBag} label="Products" onClick={() => onPanel("layers")} />

      <div className="my-2 h-px w-6 bg-zinc-800" />

      <RailButton icon={FilePlus2} label="New project" onClick={() => newProject()} />
      <RailButton icon={Sparkles} label="Load sample store" onClick={() => loadSample()} />

      <div className="mt-auto">
        <RailButton icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}
