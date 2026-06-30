import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

async function ownerGuard(id: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: { ownerId: true },
  });
  return project?.ownerId === userId ? project : null;
}

/** GET /api/projects/:id — fetch full project with document. */
export async function GET(_req: Request, ctx: Ctx) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.ownerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

/** PATCH /api/projects/:id — update document (autosave). */
export async function PATCH(req: Request, ctx: Ctx) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!await ownerGuard(id, userId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name) data.name = body.name;
  if (body.document) data.document = body.document;

  const project = await prisma.project.update({ where: { id }, data });
  return NextResponse.json({ project });
}

/** DELETE /api/projects/:id */
export async function DELETE(_req: Request, ctx: Ctx) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  if (!await ownerGuard(id, userId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
