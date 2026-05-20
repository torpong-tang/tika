import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockIssues } from "@/lib/mockData";
import { getSession } from "@/lib/auth";
import { canWriteIssues } from "@/lib/permissions";
import { canAccessProject, getAccessibleProjectIds } from "@/lib/projectAccess";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const type = searchParams.get("type");
    const projectId = searchParams.get("projectId");
    const assigneeId = searchParams.get("assigneeId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const search = searchParams.get("search");
    const session = await getSession();
    const accessibleProjectIds = await getAccessibleProjectIds(session);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (type) where.type = type;
    if (projectId) {
      if (accessibleProjectIds && !accessibleProjectIds.includes(projectId)) {
        return NextResponse.json([]);
      }
      where.projectId = projectId;
    } else if (accessibleProjectIds) {
      where.projectId = { in: accessibleProjectIds };
    }
    if (assigneeId) where.assigneeId = assigneeId === "unassigned" ? null : assigneeId;
    if (dateFrom || dateTo) {
      where.createdAt = {
        ...(dateFrom ? { gte: new Date(`${dateFrom}T00:00:00.000Z`) } : {}),
        ...(dateTo ? { lte: new Date(`${dateTo}T23:59:59.999Z`) } : {}),
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { issueKey: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        project: true,
        assignee: true,
        reporter: true,
        _count: { select: { comments: true, attachments: true } },
      },
    });

    return NextResponse.json(issues);
  } catch {
    let filtered = [...mockIssues];
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const type = searchParams.get("type");
    const projectId = searchParams.get("projectId");
    if (status) filtered = filtered.filter((i) => i.status === status);
    if (priority) filtered = filtered.filter((i) => i.priority === priority);
    if (type) filtered = filtered.filter((i) => i.type === type);
    if (projectId) filtered = filtered.filter((i) => i.projectId === projectId);
    return NextResponse.json(filtered);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, priority, projectId, assigneeId } = body;
    const session = await getSession();
    if (!canWriteIssues(session)) {
      return NextResponse.json({ error: "Readonly users cannot create issues" }, { status: 403 });
    }

    // Get the project to generate issue key
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (!await canAccessProject(session, projectId)) {
      return NextResponse.json({ error: "You do not have access to this project" }, { status: 403 });
    }

    const issueCount = await prisma.issue.count({ where: { projectId } });
    const issueKey = `${project.key}-${issueCount + 1}`;

    const issue = await prisma.issue.create({
      data: {
        issueKey,
        title,
        description: description || null,
        type: type || "bug",
        priority: priority || "medium",
        status: "open",
        projectId,
        assigneeId: assigneeId || null,
        reporterId: session!.id,
        activities: {
          create: {
            action: "created",
            field: "issue",
            newValue: title,
            actorId: session!.id,
          },
        },
      },
      include: {
        project: true,
        assignee: true,
        reporter: true,
        activities: { include: { actor: true }, orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json(issue, { status: 201 });
  } catch (error) {
    console.error("Issues POST error:", error);
    return NextResponse.json({ error: "Database not connected. Cannot create issues in demo mode." }, { status: 503 });
  }
}
