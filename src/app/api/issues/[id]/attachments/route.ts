import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canWriteIssues } from "@/lib/permissions";
import { canAccessIssue } from "@/lib/projectAccess";

const uploadRoot = path.join(process.cwd(), "public", "uploads", "issues");
const ISSUE_ATTACHMENT_LIMIT_BYTES = 20 * 1024 * 1024;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!canWriteIssues(session)) {
    return NextResponse.json({ error: "Readonly users cannot upload attachments" }, { status: 403 });
  }
  if (!await canAccessIssue(session, params.id)) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image attachments are supported" }, { status: 400 });
  }

  const issue = await prisma.issue.findUnique({ where: { id: params.id } });
  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const existingSize = await prisma.issueAttachment.aggregate({
    where: { issueId: params.id },
    _sum: { size: true },
  });
  const currentTotal = existingSize._sum.size || 0;
  if (currentTotal + file.size > ISSUE_ATTACHMENT_LIMIT_BYTES) {
    return NextResponse.json(
      { error: "Issue attachments cannot exceed 20MB total" },
      { status: 400 }
    );
  }

  await mkdir(uploadRoot, { recursive: true });
  const ext = path.extname(file.name) || ".png";
  const filename = `${params.id}-${Date.now()}${ext}`;
  const filepath = path.join(uploadRoot, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, bytes);

  const attachment = await prisma.issueAttachment.create({
    data: {
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: `/uploads/issues/${filename}`,
      issueId: params.id,
      uploaderId: session!.id,
    },
    include: { uploader: true },
  });

  await prisma.issueActivity.create({
    data: {
      action: "attached",
      field: "attachment",
      newValue: file.name,
      issueId: params.id,
      actorId: session!.id,
    },
  });

  return NextResponse.json(attachment, { status: 201 });
}
