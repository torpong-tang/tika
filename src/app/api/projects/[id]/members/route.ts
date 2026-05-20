import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canManageProjects } from "@/lib/permissions";

export const dynamic = "force-dynamic";

async function requireProjectAdmin() {
  const session = await getSession();
  if (!session) return { error: "Not authenticated", status: 401 };
  if (!canManageProjects(session)) return { error: "Forbidden: Admin only", status: 403 };
  return { session };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireProjectAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const members = await prisma.projectMember.findMany({
    where: { projectId: params.id },
    orderBy: { user: { name: "asc" } },
    include: {
      user: { select: { id: true, name: true, email: true, role: true, isActive: true } },
    },
  });

  return NextResponse.json(members);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireProjectAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const userIds = Array.isArray(body.userIds) ? Array.from(new Set(body.userIds as string[])) : [];

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.projectMember.deleteMany({ where: { projectId: params.id } }),
    prisma.projectMember.createMany({
      data: userIds.map((userId) => ({ projectId: params.id, userId })),
    }),
  ]);

  const members = await prisma.projectMember.findMany({
    where: { projectId: params.id },
    orderBy: { user: { name: "asc" } },
    include: {
      user: { select: { id: true, name: true, email: true, role: true, isActive: true } },
    },
  });

  return NextResponse.json(members);
}
