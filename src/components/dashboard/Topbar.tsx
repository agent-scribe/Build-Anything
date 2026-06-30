"use client";

import * as React from "react";
import {
  ChevronDown,
  Code2,
  FileText,
  Eye,
  FolderArchive,
  Monitor,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { renderSiteToHtml, renderMultiPageHtml } from "@/lib/export/html";
import { exportReactBundle } from "@/lib/export/react";
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
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const pages = document?.pages ?? [];
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const past = useEditorStore((s) => s.past.length);
  const future = useEditorStore((s) => s.future.length);
  const [exporting, setExporting] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  async function handleExport(format: "html" | "html-zip" | "react") {
    if (!document) return;
    setMenuOpen(false);
    setExporting(true);
    try {
      const slug =
        document.meta.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "site";

      if (format === "html") {
        // Single-page current HTML
        const blob = new Blob([renderSiteToHtml(document)], {
          type: "text/html",
        });
        download(blob, `${slug}.html`);
        return;
      }

      // Both zip formats need JSZip
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      if (format === "html-zip") {
        const htmlFiles = renderMultiPageHtml(document);
        for (const [name, content] of Object.entries(htmlFiles)) {
          zip.file(name, content);
        }
      } else {
        // react project bundle
        const files = exportReactBundle(document);
        for (const [name, content] of Object.entries(files)) {
          zip.file(name, content);
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      download(blob, `${slug}-${format}.zip`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-[#0b0b0e] px-3">
      <div className="flex items-center gap-2.5 text-sm">
        <span className="font-medium text-zinc-100">WeBuild</span>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-400">
          {document?.meta.name ?? "Untitled"}
        </span>
        {usedMock ? (
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[11px] text-amber-400">
            demo
          </span>
        ) : null}
        {pages.length > 1 && (
          <>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-0.5">
              {pages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePage(p.id)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors",
                    p.id === activePageId
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300",
                  )}
                >
                  <FileText size={11} />
                  {p.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-[#141418] p-0.5">
        <SegBtn
          active={view === "design"}
          onClick={() => onView("design")}
          icon={Code2}
          label="Design"
        />
        <SegBtn
          active={view === "preview"}
          onClick={() => onView("preview")}
          icon={Eye}
          label="Preview"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-0.5 rounded-lg border border-zinc-800 bg-[#141418] p-0.5 md:flex">
          <DeviceBtn
            active={device === "desktop"}
            onClick={() => onDevice("desktop")}
            icon={Monitor}
          />
          <DeviceBtn
            active={device === "tablet"}
            onClick={() => onDevice("tablet")}
            icon={Tablet}
          />
          <DeviceBtn
            active={device === "mobile"}
            onClick={() => onDevice("mobile")}
            icon={Smartphone}
          />
        </div>

        <div className="flex items-center gap-0.5">
          <IconBtn disabled={past === 0} onClick={undo} label="Undo">
            <Undo2 size={16} />
          </IconBtn>
          <IconBtn disabled={future === 0} onClick={redo} label="Redo">
            <Redo2 size={16} />
          </IconBtn>
        </div>

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
            <div className="absolute right-0 top-10 z-30 w-56 overflow-hidden rounded-xl border border-zinc-800 bg-[#141418] py-1 shadow-2xl">
              <MenuItem
                onClick={() => handleExport("html")}
                icon={<Code2 size={14} />}
                title="Single HTML"
                subtitle="Current page as clean .html"
              />
              <MenuItem
                onClick={() => handleExport("html-zip")}
                icon={<FolderArchive size={14} />}
                title="Full Site ZIP"
                subtitle="All pages as .html files"
              />
              <MenuItem
                onClick={() => handleExport("react")}
                icon={<Code2 size={14} />}
                title="React Project"
                subtitle="Component files as .zip"
              />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Small sub-components                                                */
/* ------------------------------------------------------------------ */

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
        active
          ? "bg-zinc-700 text-white"
          : "text-zinc-400 hover:text-zinc-200",
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
        active
          ? "bg-zinc-700 text-white"
          : "text-zinc-500 hover:text-zinc-300",
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

function MenuItem({
  onClick,
  icon,
  title,
  subtitle,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-2.5 px-3 py-2 text-left transition-colors hover:bg-zinc-800"
    >
      <span className="mt-0.5 text-zinc-400">{icon}</span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-zinc-100">{title}</span>
        <span className="text-xs text-zinc-500">{subtitle}</span>
      </div>
    </button>
  );
}
