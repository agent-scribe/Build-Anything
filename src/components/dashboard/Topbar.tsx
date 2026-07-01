"use client";

import * as React from "react";
import {
  ChevronDown,
  Code2,
  Eye,
  Monitor,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
  Upload,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { useCollabStore } from "@/lib/collab";
import { CollabPanel } from "./CollabPanel";
import type { Device, ViewMode } from "./DashboardWorkspace";

export function Topbar({
  view,
  onView,
  device,
  onDevice,
}: {
  view: ViewMode;
  onView: (v: ViewMode) => void;
  device: Device;
  onDevice: (d: Device) => void;
}) {
  const document = useEditorStore((s) => s.document);
  const usedMock = useEditorStore((s) => s.usedMock);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const past = useEditorStore((s) => s.past.length);
  const future = useEditorStore((s) => s.future.length);
  const [exporting, setExporting] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showCollab, setShowCollab] = React.useState(false);
  const collabStatus = useCollabStore((s) => s.status);
  const peerCount = useCollabStore((s) => s.peers.length);

  async function handleExport(format: "html" | "react") {
    if (!document) return;
    setMenuOpen(false);
    setExporting(true);
    import("@/lib/analytics").then((m) => m.analytics.exportSite(format));
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document, format }),
      });
      if (!res.ok) throw new Error("Export failed");
      const slug = document.meta.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "site";
      let blob: Blob;
      let filename: string;
      if (format === "html") {
        blob = await res.blob();
        filename = `${slug}.html`;
      } else {
        const data = await res.json();
        blob = new Blob([JSON.stringify(data.files, null, 2)], { type: "application/json" });
        filename = `${slug}-react-bundle.json`;
      }
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-[#0b0b0e] px-3">
      <div className="flex items-center gap-2.5 text-sm">
        <span className="font-medium text-zinc-100">Sbuild</span>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-400">{document?.meta.name ?? "Untitled"}</span>
        {usedMock ? (
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[11px] text-amber-400">
            demo
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-[#141418] p-0.5">
        <SegBtn active={view === "design"} onClick={() => onView("design")} icon={Code2} label="Design" />
        <SegBtn active={view === "preview"} onClick={() => onView("preview")} icon={Eye} label="Preview" />
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-0.5 rounded-lg border border-zinc-800 bg-[#141418] p-0.5 md:flex">
          <DeviceBtn active={device === "desktop"} onClick={() => onDevice("desktop")} icon={Monitor} />
          <DeviceBtn active={device === "tablet"} onClick={() => onDevice("tablet")} icon={Tablet} />
          <DeviceBtn active={device === "mobile"} onClick={() => onDevice("mobile")} icon={Smartphone} />
        </div>

        <div className="flex items-center gap-0.5">
          <IconBtn disabled={past === 0} onClick={undo} label="Undo">
            <Undo2 size={16} />
          </IconBtn>
          <IconBtn disabled={future === 0} onClick={redo} label="Redo">
            <Redo2 size={16} />
          </IconBtn>
        </div>

        <button
          type="button"
          onClick={() => setShowCollab(true)}
          className="relative flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        >
          <Users size={14} />
          <span className="hidden sm:inline">Collab</span>
          {collabStatus === "connected" && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-white">
              {1 + peerCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            disabled={!document || exporting}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg bg-[#6d5efc] px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Upload size={14} />
            {exporting ? "Exporting…" : "Export"}
            <ChevronDown size={14} />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-10 z-30 w-52 overflow-hidden rounded-xl border border-zinc-800 bg-[#141418] py-1 shadow-2xl">
              <MenuItem onClick={() => handleExport("html")} title="Static HTML" subtitle="Single clean .html file" />
              <MenuItem onClick={() => handleExport("react")} title="React bundle" subtitle="Component file map (.json)" />
            </div>
          ) : null}
        </div>
      </div>

      {showCollab && <CollabPanel onClose={() => setShowCollab(false)} />}
    </header>
  );
}

function SegBtn({
  active,
  onClick,
  icon: IconCmp,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
        active ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"
      )}
    >
      <IconCmp size={13} />
      {label}
    </button>
  );
}

function DeviceBtn({
  active,
  onClick,
  icon: IconCmp,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
        active ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
      )}
    >
      <IconCmp size={15} />
    </button>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
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
      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function MenuItem({ onClick, title, subtitle }: { onClick: () => void; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-zinc-800"
    >
      <span className="text-sm text-zinc-100">{title}</span>
      <span className="text-xs text-zinc-500">{subtitle}</span>
    </button>
  );
}
