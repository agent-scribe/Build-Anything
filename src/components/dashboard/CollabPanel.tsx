"use client";

import * as React from "react";
import {
  Copy,
  Link2,
  Loader2,
  Share2,
  Trash2,
  Users,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCollabStore } from "@/lib/collab";
import { useMockAuth } from "@/lib/mock-auth/context";
import { useEditorStore } from "@/lib/store/useEditorStore";

export function CollabPanel({ onClose }: { onClose: () => void }) {
  const { user } = useMockAuth();
  const projectId = useEditorStore((s) => s.projectId);
  const status = useCollabStore((s) => s.status);
  const currentUser = useCollabStore((s) => s.currentUser);
  const peers = useCollabStore((s) => s.peers);
  const shareLinks = useCollabStore((s) => s.shareLinks);
  const connect = useCollabStore((s) => s.connect);
  const disconnect = useCollabStore((s) => s.disconnect);
  const createShareLink = useCollabStore((s) => s.createShareLink);
  const revokeShareLink = useCollabStore((s) => s.revokeShareLink);

  const [copied, setCopied] = React.useState<string | null>(null);

  const projectLinks = shareLinks.filter(
    (l) => l.projectId === (projectId || "demo")
  );

  function handleConnect() {
    if (status === "connected") {
      disconnect();
    } else {
      connect(projectId || "demo", user?.name || "Anonymous");
    }
  }

  function handleCreateLink(permission: "view" | "edit") {
    const link = createShareLink(projectId || "demo", permission);
    copyLink(link.token);
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/dashboard?share=${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(token);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#141418] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#6d5efc]" />
            <h2 className="text-base font-semibold text-zinc-100">
              Collaboration
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Connection status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status === "connected" ? (
                <Wifi size={14} className="text-green-400" />
              ) : status === "connecting" || status === "reconnecting" ? (
                <Loader2 size={14} className="animate-spin text-amber-400" />
              ) : (
                <WifiOff size={14} className="text-zinc-500" />
              )}
              <span className="text-sm text-zinc-300">
                {status === "connected"
                  ? "Connected"
                  : status === "connecting"
                  ? "Connecting..."
                  : status === "reconnecting"
                  ? "Reconnecting..."
                  : "Disconnected"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleConnect}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                status === "connected"
                  ? "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  : "bg-[#6d5efc] text-white hover:opacity-90"
              )}
            >
              {status === "connected" ? "Disconnect" : "Go Live"}
            </button>
          </div>

          {/* Connected users */}
          {status === "connected" && (
            <div>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Online ({1 + peers.length})
              </h3>
              <div className="space-y-2">
                {/* Current user */}
                {currentUser && (
                  <div className="flex items-center gap-3 rounded-lg bg-zinc-800/30 px-3 py-2">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: currentUser.color }}
                    >
                      {currentUser.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-200">
                        {currentUser.name}{" "}
                        <span className="text-xs text-zinc-500">(you)</span>
                      </p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                )}

                {/* Peers */}
                {peers.map((peer) => (
                  <div
                    key={peer.id}
                    className="flex items-center gap-3 rounded-lg bg-zinc-800/30 px-3 py-2"
                  >
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: peer.color }}
                    >
                      {peer.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-200">
                        {peer.name}
                      </p>
                      {peer.selectedSectionId && (
                        <p className="text-[10px] text-zinc-500">
                          Editing section...
                        </p>
                      )}
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share links */}
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Share Links
            </h3>

            {projectLinks.length > 0 && (
              <div className="mb-3 space-y-2">
                {projectLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2"
                  >
                    <Link2 size={12} className="shrink-0 text-zinc-500" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs text-zinc-300">
                        ...?share={link.token.slice(0, 8)}...
                      </p>
                      <p className="text-[10px] text-zinc-600">
                        {link.permission === "edit" ? "Can edit" : "View only"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyLink(link.token)}
                      className="rounded p-1 text-zinc-500 hover:text-zinc-300"
                      title="Copy link"
                    >
                      {copied === link.token ? (
                        <span className="text-[10px] text-green-400">Copied</span>
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => revokeShareLink(link.id)}
                      className="rounded p-1 text-zinc-500 hover:text-red-400"
                      title="Revoke"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleCreateLink("edit")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#6d5efc] py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
              >
                <Share2 size={12} />
                Share (Edit)
              </button>
              <button
                type="button"
                onClick={() => handleCreateLink("view")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-700 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
              >
                <Share2 size={12} />
                Share (View)
              </button>
            </div>
          </div>

          {/* Demo note */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-300/80">
            <strong>Demo:</strong> Collaboration is simulated locally. A buyer
            can integrate Liveblocks or PartyKit for real-time multi-user sync.
          </div>
        </div>
      </div>
    </div>
  );
}
