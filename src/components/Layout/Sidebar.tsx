"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Bug,
  FolderKanban,
  Columns3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();

  const menuItems = [
    { href: "/", label: t.nav.dashboard, icon: LayoutDashboard },
    { href: "/issues", label: t.nav.issues, icon: Bug },
    { href: "/board", label: t.nav.board, icon: Columns3 },
    { href: "/projects", label: t.nav.projects, icon: FolderKanban },
  ];

  const adminItems = [
    { href: "/admin/users", label: "Manage Users", icon: Users },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-navy-900 border-r border-navy-700 transition-all duration-300 z-40 flex flex-col ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-navy-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Bug className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-white whitespace-nowrap">
              TIKA
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-accent-500/10 text-accent-400 border-l-2 border-accent-500"
                  : "text-gray-400 hover:bg-navy-800 hover:text-gray-200"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-accent-400" : ""}`} />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}

        {/* Admin Section */}
        {user?.role === "admin" && (
          <>
            <div className="pt-4 pb-1 px-3">
              {!collapsed && (
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</p>
              )}
              {collapsed && <div className="border-t border-navy-700" />}
            </div>
            {adminItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-accent-500/10 text-accent-400 border-l-2 border-accent-500"
                      : "text-gray-400 hover:bg-navy-800 hover:text-gray-200"
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-accent-400" : ""}`} />
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-navy-700">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 rounded-lg text-gray-400 hover:bg-navy-800 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
