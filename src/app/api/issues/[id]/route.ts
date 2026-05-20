import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockIssues } from "@/lib/mockData";
import { getSession } from "@/lib/auth";
import { canDeleteIssues, canWriteIssues } from "@/lib/permissions";
import { canAccessIssue, canAccessProject } from "@/lib/projectAccess";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const issue = await prisma.issue.findUnique({
      where: { id: params.id },
      include: {
        project: true,
        assignee: true,
        reporter: true,
        comments: {
          orderBy: { createdAt: "desc" },
          include: { author: true },
        },
        attachments: {
          orderBy: { createdAt: "desc" },
          include: { uploader: true },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          include: { actor: true },
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    if (!await canAccessProject(session, issue.projectId)) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(issue);
  } catch {
    const mock = mockIssues.find((i) => i.id === params.id);
    if (mock) return NextResponse.json(mock);
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const session = await getSession();
    if (!canWriteIssues(session)) {
      return NextResponse.json({ error: "Readonly users cannot update issues" }, { status: 403 });
    }
    if (!await canAccessIssue(session, params.id)) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const current = await prisma.issue.findUnique({ where: { id: params.id } });
    if (!current) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    if (body.projectId && !await canAccessProject(session, body.projectId)) {
      return NextResponse.json({ error: "You do not have access to this project" }, { status: 403 });
    }

    const trackedFields = ["status", "priority", "assigneeId", "projectId"] as const;
    const activityCreates = trackedFields
      .filter((field) => body[field] !== undefined && String(current[field] ?? "") !== String(body[field] ?? ""))
      .map((field) => ({
        action: "updated",
        field,
        oldValue: String(current[field] ?? "Unassigned"),
        newValue: String(body[field] ?? "Unassigned"),
        actorId: session!.id,
      }));

    const issue = await prisma.issue.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        status: body.status,
        priority: body.priority,
        assigneeId: body.assigneeId || null,
        projectId: body.projectId,
        ...(activityCreates.length > 0 ? { activities: { create: activityCreates } } : {}),
      },
      include: {
        project: true,
        assignee: true,
        reporter: true,
        activities: { include: { actor: true }, orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json(issue);
  } catch {
    const mock = mockIssues.find((i) => i.id === params.id);
    if (mock) return NextResponse.json({ ...mock, status: "updated (demo)" });
    return NextResponse.json({ error: "Demo mode - changes not persisted" }, { status: 200 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!canDeleteIssues(session)) {
      return NextResponse.json({ error: "Only admins and managers can delete issues" }, { status: 403 });
    }
    if (!await canAccessIssue(session, params.id)) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    await prisma.issue.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Issue deleted" });
  } catch {
    return NextResponse.json({ message: "Demo mode - delete not persisted" });
  }
}
