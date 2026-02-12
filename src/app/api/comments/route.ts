import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockUsers } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, issueId } = body;

    const defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      return NextResponse.json({ error: "No users found" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        issueId,
        authorId: defaultUser.id,
      },
      include: { author: true },
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
