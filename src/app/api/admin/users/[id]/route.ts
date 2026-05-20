import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { canManageUsers, isRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  if (!session) return { error: "Not authenticated", status: 401 };
  if (!canManageUsers(session)) return { error: "Forbidden: Admin only", status: 403 };
  return { session };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const { name, email, role, isActive, password, projectIds } = body;
    if (role !== undefined && !isRole(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) updateData.password = await hashPassword(password);

    const user = await prisma.$transaction(async (tx) => {
      if (Array.isArray(projectIds)) {
        await tx.projectMember.deleteMany({ where: { userId: params.id } });
        await tx.projectMember.createMany({
          data: Array.from(new Set(projectIds as string[])).map((projectId) => ({ userId: params.id, projectId })),
        });
      }

      return tx.user.update({
        where: { id: params.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          projectMemberships: {
            include: { project: { select: { id: true, name: true, key: true } } },
            orderBy: { project: { name: "asc" } },
          },
        },
      });
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Admin user PUT error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Prevent self-delete
  if (auth.session.id === params.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Admin user DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
