/**
 * types.ts — Real-time collaboration type definitions.
 * Foundation for multi-user editing (Phase 4 will add full CRDT sync).
 */

/** A connected collaborator's presence info. */
export interface CollabUser {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  cursor?: { x: number; y: number };
  selectedSectionId?: string | null;
  lastSeen: number;
}

/** Message types for the collaboration WebSocket protocol. */
export type CollabMessage =
  | { type: "join"; user: Omit<CollabUser, "lastSeen"> }
  | { type: "leave"; userId: string }
  | { type: "cursor"; userId: string; cursor: { x: number; y: number } }
  | { type: "select"; userId: string; sectionId: string | null }
  | { type: "presence"; users: CollabUser[] }
  | { type: "doc-update"; userId: string; patch: DocumentPatch }
  | { type: "doc-sync"; document: unknown };

/** A lightweight patch describing a document change. */
export interface DocumentPatch {
  path: string; // JSON path, e.g. "pages.0.sections.2.props.title"
  op: "replace" | "add" | "remove" | "move";
  value?: unknown;
  from?: string; // For move operations
  timestamp: number;
}

/** Room state for a collaborative editing session. */
export interface CollabRoom {
  id: string;
  projectId: string;
  users: CollabUser[];
  createdAt: number;
}

/** Share link metadata. */
export interface ShareLink {
  id: string;
  projectId: string;
  token: string;
  permission: "view" | "edit";
  createdAt: number;
  expiresAt?: number;
}

/** Collaboration connection status. */
export type CollabStatus = "disconnected" | "connecting" | "connected" | "reconnecting";

/** Preset avatar colors for collaborators. */
export const COLLAB_COLORS = [
  "#6d5efc", // purple (primary)
  "#ec4899", // pink
  "#22c55e", // green
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#ef4444", // red
  "#14b8a6", // teal
  "#8b5cf6", // violet
  "#f97316", // orange
  "#06b6d4", // cyan
];
