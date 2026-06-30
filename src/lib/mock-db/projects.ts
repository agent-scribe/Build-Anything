"use client";

import type { SiteDocument } from "@/lib/schema/page-schema";

export interface SavedProject {
  id: string;
  name: string;
  industry?: string;
  document: SiteDocument;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "webuild-projects";

function readAll(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(projects: SavedProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function listProjects(): SavedProject[] {
  return readAll().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getProject(id: string): SavedProject | undefined {
  return readAll().find((p) => p.id === id);
}

export function saveProject(doc: SiteDocument, existingId?: string): SavedProject {
  const projects = readAll();
  const now = new Date().toISOString();

  if (existingId) {
    const idx = projects.findIndex((p) => p.id === existingId);
    if (idx !== -1) {
      projects[idx] = { ...projects[idx], document: doc, name: doc.meta.name, updatedAt: now };
      writeAll(projects);
      return projects[idx];
    }
  }

  const project: SavedProject = {
    id: `proj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: doc.meta.name,
    industry: doc.meta.industry,
    document: doc,
    createdAt: now,
    updatedAt: now,
  };
  projects.push(project);
  writeAll(projects);
  return project;
}

export function deleteProject(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}
