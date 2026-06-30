"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Plus, FolderOpen, Trash2, Loader2 } from "lucide-react";
import { useEditorStore } from "@/lib/store/useEditorStore";

interface ProjectSummary {
  id: string;
  name: string;
  industry: string | null;
  updatedAt: string;
}

export function ProjectList({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const [projects, setProjects] = React.useState<ProjectSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const loadDocument = useEditorStore((s) => s.loadDocument);
  const document = useEditorStore((s) => s.document);
  const setProjectId = useEditorStore((s) => s.setProjectId);

  React.useEffect(() => {
    if (!session) return;
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  async function openProject(id: string) {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) return;
    const { project } = await res.json();
    loadDocument(project.document, false);
    setProjectId(project.id);
    onClose();
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  async function saveCurrentAsNew() {
    if (!document) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.meta.name,
        industry: document.meta.industry,
        document,
      }),
    });
    if (res.ok) {
      const { project } = await res.json();
      setProjectId(project.id);
      onClose();
    }
  }

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#141418] shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-zinc-100">Your Projects</h2>
          <div className="flex items-center gap-2">
            {document && (
              <button
                type="button"
                onClick={saveCurrentAsNew}
                className="flex items-center gap-1.5 rounded-lg bg-[#6d5efc] px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Plus size={14} />
                Save Current
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              Close
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-zinc-500" />
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No saved projects yet. Generate a site and save it!
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-800/50"
                >
                  <button
                    type="button"
                    onClick={() => openProject(p.id)}
                    className="flex items-center gap-2.5 text-left"
                  >
                    <FolderOpen size={16} className="text-[#6d5efc]" />
                    <div>
                      <p className="text-sm font-medium text-zinc-100">{p.name}</p>
                      <p className="text-xs text-zinc-500">
                        {p.industry ? `${p.industry} · ` : ""}
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProject(p.id)}
                    className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
