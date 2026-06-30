/**
 * Stable, dependency-free id helpers.
 * `uid` is collision-resistant enough for client-side document nodes;
 * persisted entities get cuid/uuid from Prisma on the server.
 */
export function uid(prefix = "id"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}-${time}${rand}`;
}

/** Deterministic kebab-case slug from a label. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "section";
}
