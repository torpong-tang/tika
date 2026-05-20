import { prisma } from "./prisma";
import { AuthUser } from "./auth";

export function isAdmin(user: AuthUser | null) {
  return user?.role === "admin";
}

export async function getAccessibleProjectIds(user: AuthUser | null) {
  if (!user || isAdmin(user)) return null;

  const memberships = await prisma.projectMember.findMany({
    where: { userId: user.id },
    select: { projectId: true },
  });

  return memberships.map((membership) => membership.projectId);
}

export async function canAccessProject(user: AuthUser | null, projectId: string) {
  if (!user) return false;
  if (isAdmin(user)) return true;

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: user.id } },
    select: { id: true },
  });

  return !!membership;
}

export async function canAccessIssue(user: AuthUser | null, issueId: string) {
  if (!user) return false;
  if (isAdmin(user)) return true;

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: { projectId: true },
  });

  if (!issue) return false;
  return canAccessProject(user, issue.projectId);
}
