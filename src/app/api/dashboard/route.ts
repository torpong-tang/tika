import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMockDashboard } from "@/lib/mockData";

export async function GET() {
  try {
    const [
      totalIssues,
      openIssues,
      inProgressIssues,
      closedIssues,
      criticalIssues,
      byStatus,
      byPriority,
      byType,
      recentIssues,
    ] = await Promise.all([
      prisma.issue.count(),
      prisma.issue.count({ where: { status: "open" } }),
      prisma.issue.count({ where: { status: "in_progress" } }),
      prisma.issue.count({ where: { status: { in: ["done", "closed"] } } }),
      prisma.issue.count({ where: { priority: "critical" } }),
      prisma.issue.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.issue.groupBy({ by: ["priority"], _count: { id: true } }),
      prisma.issue.groupBy({ by: ["type"], _count: { id: true } }),
      prisma.issue.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          project: true,
          assignee: true,
          reporter: true,
          _count: { select: { comments: true } },
        },
      }),
    ]);

    return NextResponse.json({
      totalIssues,
      openIssues,
      inProgressIssues,
      closedIssues,
      criticalIssues,
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
      byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count.id })),
      byType: byType.map((t) => ({ type: t.type, count: t._count.id })),
      recentIssues,
    });
  } catch {
    return NextResponse.json(getMockDashboard());
  }
}
