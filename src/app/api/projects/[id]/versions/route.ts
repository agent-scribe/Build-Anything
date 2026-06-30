import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** GET /api/projects/:id/versions — list version history. */
export async function GET(_req: Request, ctx: Ctx) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { ownerId: true },
  });
  if (!project || project.ownerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const versions = await prisma.version.findMany({
    where: { projectId: id },
    orderBy: { createdAt: "desc" },
    select: { id: true, label: true, createdAt: true },
    take: 50,
  });

  return NextResponse.json({ versions });
}

/** POST /api/projects/:id/versions — create a named snapshot. */
export async function POST(req: Request, ctx: Ctx) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.ownerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const label = typeof body.label === "string" ? body.label : null;

  const version = await prisma.version.create({
    data: {
      label,
      document: project.document,
      projectId: id,
    },
  });

  return NextResponse.json({ version }, { status: 201 });
}
