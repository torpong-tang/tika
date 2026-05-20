import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockProjects } from "@/lib/mockData";
import { getSession } from "@/lib/auth";
import { canManageProjects } from "@/lib/permissions";
import { getAccessibleProjectIds, isAdmin } from "@/lib/projectAccess";

export async function GET() {
  try {
    const session = await getSession();
    const accessibleProjectIds = await getAccessibleProjectIds(session);
    const projects = await prisma.project.findMany({
      where: accessibleProjectIds ? { id: { in: accessibleProjectIds } } : {},
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { issues: true } },
        members: isAdmin(session)
          ? { include: { user: { select: { id: true, name: true, email: true, role: true } } } }
          : false,
      },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(mockProjects);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canManageProjects(session)) {
      return NextResponse.json({ error: "Only admins can create projects" }, { status: 403 });
    }

    const body = await request.json();
    const { name, key, description } = body;

    const project = await prisma.project.create({
      data: { name, key: key.toUpperCase(), description: description || null },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json({ error: "Database not connected. Cannot create projects in demo mode." }, { status: 503 });
  }
}
