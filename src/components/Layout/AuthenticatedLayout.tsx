"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import AppLayout from "./AppLayout";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();
  const pathname = usePathname();

  // Show nothing while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  // Login page — no AppLayout wrapper
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Authenticated pages — wrap with sidebar/header
  return <AppLayout>{children}</AppLayout>;
}
