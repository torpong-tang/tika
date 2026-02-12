import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockIssues } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      },
    });

    if (!issue) {
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
      },
      include: {
        project: true,
        assignee: true,
        reporter: true,
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
    await prisma.issue.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Issue deleted" });
  } catch {
    return NextResponse.json({ message: "Demo mode - delete not persisted" });
  }
}
