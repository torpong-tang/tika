import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockProjects } from "@/lib/mockData";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { issues: true } },
      },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(mockProjects);
  }
}

export async function POST(request: NextRequest) {
  try {
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
