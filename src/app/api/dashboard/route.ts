import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMockDashboard } from "@/lib/mockData";
import { getSession } from "@/lib/auth";
import { getAccessibleProjectIds } from "@/lib/projectAccess";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    const accessibleProjectIds = await getAccessibleProjectIds(session);
    const where = accessibleProjectIds ? { projectId: { in: accessibleProjectIds } } : {};
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
      prisma.issue.count({ where }),
      prisma.issue.count({ where: { ...where, status: "open" } }),
      prisma.issue.count({ where: { ...where, status: "in_progress" } }),
      prisma.issue.count({ where: { ...where, status: { in: ["done", "closed"] } } }),
      prisma.issue.count({ where: { ...where, priority: "critical" } }),
      prisma.issue.groupBy({ by: ["status"], where, _count: { id: true } }),
      prisma.issue.groupBy({ by: ["priority"], where, _count: { id: true } }),
      prisma.issue.groupBy({ by: ["type"], where, _count: { id: true } }),
      prisma.issue.findMany({
        where,
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
