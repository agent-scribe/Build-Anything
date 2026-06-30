import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/projects — list current user's projects. */
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      industry: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ projects });
}

/** POST /api/projects — create a new project. */
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, industry, document } = body;

  if (!name || !document) {
    return NextResponse.json({ error: "name and document required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      industry: industry ?? null,
      document,
      ownerId: userId,
      versions: {
        create: { label: "Initial", document },
      },
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
