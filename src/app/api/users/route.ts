import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockUsers } from "@/lib/mockData";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json(mockUsers);
  }
}
