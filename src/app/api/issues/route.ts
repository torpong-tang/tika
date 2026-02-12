import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockIssues } from "@/lib/mockData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const type = searchParams.get("type");
    const projectId = searchParams.get("projectId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (type) where.type = type;
    if (projectId) where.projectId = projectId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { issueKey: { contains: search } },
      ];
    }

    const issues = await prisma.issue.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        project: true,
        assignee: true,
        reporter: true,
        _count: { select: { comments: true } },
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

    // Get the project to generate issue key
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const issueCount = await prisma.issue.count({ where: { projectId } });
    const issueKey = `${project.key}-${issueCount + 1}`;

    // Get the first user as default reporter
    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      return NextResponse.json({ error: "No users found" }, { status: 400 });
    }

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
        reporterId: defaultUser.id,
      },
      include: {
        project: true,
        assignee: true,
        reporter: true,
      },
    });

    return NextResponse.json(issue, { status: 201 });
  } catch (error) {
    console.error("Issues POST error:", error);
    return NextResponse.json({ error: "Database not connected. Cannot create issues in demo mode." }, { status: 503 });
  }
}
