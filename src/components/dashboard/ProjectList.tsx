"use client";

import * as React from "react";
import { useMockAuth } from "@/lib/mock-auth/context";
import { listProjects, getProject, saveProject, deleteProject, type SavedProject } from "@/lib/mock-db/projects";
import { useEditorStore } from "@/lib/store/useEditorStore";
import { Plus, FolderOpen, Trash2, Info } from "lucide-react";

export function ProjectList({ onClose }: { onClose: () => void }) {
  const { user } = useMockAuth();
  const [projects, setProjects] = React.useState<SavedProject[]>([]);
  const document = useEditorStore((s) => s.document);
  const loadDocument = useEditorStore((s) => s.loadDocument);
  const setProjectId = useEditorStore((s) => s.setProjectId);

  React.useEffect(() => {
    setProjects(listProjects());
  }, []);

  function openProject(id: string) {
    const project = getProject(id);
    if (!project) return;
    loadDocument(project.document, false);
    setProjectId(project.id);
    onClose();
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    deleteProject(id);
    setProjects(listProjects());
  }

  function saveCurrentAsNew() {
    if (!document) return;
    const project = saveProject(document);
    setProjectId(project.id);
    onClose();
  }

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

        {/* Demo mode note */}
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
          <Info size={13} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-[11px] text-amber-300/80">
            <strong>Demo:</strong> Projects are saved in your browser. 
            A buyer can connect a real database for cloud persistence.
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {projects.length === 0 ? (
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
                    onClick={() => handleDelete(p.id)}
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
