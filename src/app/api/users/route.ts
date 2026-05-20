import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockUsers } from "@/lib/mockData";
import { getSession } from "@/lib/auth";
import { canAccessProject, isAdmin } from "@/lib/projectAccess";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    if (projectId && !await canAccessProject(session, projectId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        ...(projectId && !isAdmin(session)
          ? { projectMemberships: { some: { projectId } } }
          : projectId
            ? { OR: [{ role: "admin" }, { projectMemberships: { some: { projectId } } }] }
            : {}),
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(mockUsers);
  }
}
