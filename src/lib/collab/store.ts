/**
 * store.ts — Zustand store for collaboration state.
 * Manages presence, connection status, and share links.
 * Uses localStorage mock for MVP; Phase 4 replaces with real WebSocket.
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { CollabUser, CollabStatus, ShareLink } from "./types";
import { COLLAB_COLORS } from "./types";

/* ------------------------------------------------------------------ */
/* Store shape                                                         */
/* ------------------------------------------------------------------ */

interface CollabState {
  // Connection
  status: CollabStatus;
  roomId: string | null;

  // Presence
  currentUser: CollabUser | null;
  peers: CollabUser[];

  // Share links
  shareLinks: ShareLink[];

  // Actions
  connect: (projectId: string, userName: string) => void;
  disconnect: () => void;
  updateCursor: (x: number, y: number) => void;
  selectSection: (sectionId: string | null) => void;
  createShareLink: (projectId: string, permission: "view" | "edit") => ShareLink;
  revokeShareLink: (linkId: string) => void;
  getShareLinks: (projectId: string) => ShareLink[];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function pickColor(index: number): string {
  return COLLAB_COLORS[index % COLLAB_COLORS.length];
}

function loadShareLinks(): ShareLink[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("wb_share_links");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveShareLinks(links: ShareLink[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("wb_share_links", JSON.stringify(links));
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

export const useCollabStore = create<CollabState>()(
  immer((set, get) => ({
    status: "disconnected",
    roomId: null,
    currentUser: null,
    peers: [],
    shareLinks: loadShareLinks(),

    connect: (projectId, userName) => {
      const user: CollabUser = {
        id: uid(),
        name: userName,
        color: pickColor(Math.floor(Math.random() * COLLAB_COLORS.length)),
        cursor: undefined,
        selectedSectionId: null,
        lastSeen: Date.now(),
      };

      set((s) => {
        s.status = "connected";
        s.roomId = `room-${projectId}`;
        s.currentUser = user;
        // In demo mode, simulate a peer after a short delay
      });

      // Simulate a peer joining after 2s (demo mode)
      setTimeout(() => {
        const state = get();
        if (state.status !== "connected") return;
        set((s) => {
          s.peers = [
            {
              id: uid(),
              name: "Demo Collaborator",
              color: pickColor(3),
              cursor: { x: 450, y: 320 },
              selectedSectionId: null,
              lastSeen: Date.now(),
            },
          ];
        });
      }, 2000);
    },

    disconnect: () => {
      set((s) => {
        s.status = "disconnected";
        s.roomId = null;
        s.currentUser = null;
        s.peers = [];
      });
    },

    updateCursor: (x, y) => {
      set((s) => {
        if (s.currentUser) {
          s.currentUser.cursor = { x, y };
          s.currentUser.lastSeen = Date.now();
        }
      });
    },

    selectSection: (sectionId) => {
      set((s) => {
        if (s.currentUser) {
          s.currentUser.selectedSectionId = sectionId;
        }
      });
    },

    createShareLink: (projectId, permission) => {
      const link: ShareLink = {
        id: uid(),
        projectId,
        token: uid() + uid(),
        permission,
        createdAt: Date.now(),
      };

      set((s) => {
        s.shareLinks.push(link);
      });

      saveShareLinks([...get().shareLinks]);
      return link;
    },

    revokeShareLink: (linkId) => {
      set((s) => {
        s.shareLinks = s.shareLinks.filter((l) => l.id !== linkId);
      });
      saveShareLinks(get().shareLinks);
    },

    getShareLinks: (projectId) => {
      return get().shareLinks.filter((l) => l.projectId === projectId);
    },
  }))
);
