"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "./AppLayout";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login" || pathname.endsWith("/login");

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginPage) {
      router.replace("/login");
      return;
    }
    if (user && isLoginPage) {
      router.replace("/");
    }
  }, [loading, user, isLoginPage, router]);

  // Show nothing while checking auth
  if (loading || (!user && !isLoginPage)) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  // Login page — no AppLayout wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Authenticated pages — wrap with sidebar/header
  return <AppLayout>{children}</AppLayout>;
}
