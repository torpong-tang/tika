import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/Dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const token = cookies().get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <DashboardClient />;
}
