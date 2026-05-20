import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockUsers } from "@/lib/mockData";
import { getSession } from "@/lib/auth";
import { canWriteIssues } from "@/lib/permissions";
import { canAccessIssue } from "@/lib/projectAccess";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, issueId } = body;
    const session = await getSession();
    if (!canWriteIssues(session)) {
      return NextResponse.json({ error: "Readonly users cannot comment" }, { status: 403 });
    }
    if (!await canAccessIssue(session, issueId)) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        issueId,
        authorId: session!.id,
      },
      include: { author: true },
    });

    await prisma.issueActivity.create({
      data: {
        action: "commented",
        field: "comment",
        newValue: content.slice(0, 180),
        issueId,
        actorId: session!.id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    const now = new Date().toISOString();
    return NextResponse.json({
      id: `demo-${Date.now()}`,
      content: "Demo mode - comment not persisted",
      issueId: "",
      authorId: "u1",
      author: mockUsers[0],
      createdAt: now,
      updatedAt: now,
    }, { status: 201 });
  }
}
