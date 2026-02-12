"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { DashboardStats, IssueStatus, IssuePriority, IssueType } from "@/types";
import Link from "next/link";
import {
  Bug,
  FolderOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const statusColors: Record<IssueStatus, string> = {
  open: "bg-blue-500",
  in_progress: "bg-amber-500",
  in_review: "bg-purple-500",
  testing: "bg-cyan-500",
  done: "bg-green-500",
  closed: "bg-gray-500",
};

const priorityColors: Record<IssuePriority, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-400",
};

const typeColors: Record<IssueType, string> = {
  bug: "bg-red-500",
  task: "bg-blue-500",
  story: "bg-green-500",
  epic: "bg-purple-500",
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: t.dashboard.totalIssues,
      value: stats.totalIssues,
      icon: Bug,
      color: "from-accent-500 to-accent-600",
      iconBg: "bg-accent-500/20",
      iconColor: "text-accent-400",
    },
    {
      label: t.dashboard.openIssues,
      value: stats.openIssues,
      icon: FolderOpen,
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      label: t.dashboard.inProgress,
      value: stats.inProgressIssues,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      label: t.dashboard.resolved,
      value: stats.closedIssues,
      icon: CheckCircle2,
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      label: t.dashboard.criticalIssues,
      value: stats.criticalIssues,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.dashboard.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{t.dashboard.overview}</p>
        </div>
        <TrendingUp className="w-6 h-6 text-accent-400" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card-hover p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-sm text-gray-400 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Status */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">{t.dashboard.issuesByStatus}</h3>
          <div className="space-y-3">
            {stats.byStatus.map((item) => {
              const total = stats.totalIssues || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">
                      {t.statuses[item.status as IssueStatus] || item.status}
                    </span>
                    <span className="text-sm font-medium text-gray-300">{item.count}</span>
                  </div>
                  <div className="w-full bg-navy-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${statusColors[item.status as IssueStatus] || "bg-gray-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Priority */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">{t.dashboard.issuesByPriority}</h3>
          <div className="space-y-3">
            {stats.byPriority.map((item) => {
              const total = stats.totalIssues || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">
                      {t.priorities[item.priority as IssuePriority] || item.priority}
                    </span>
                    <span className="text-sm font-medium text-gray-300">{item.count}</span>
                  </div>
                  <div className="w-full bg-navy-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${priorityColors[item.priority as IssuePriority] || "bg-gray-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Type */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">{t.dashboard.issuesByType}</h3>
          <div className="space-y-3">
            {stats.byType.map((item) => {
              const total = stats.totalIssues || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">
                      {t.issueTypes[item.type as IssueType] || item.type}
                    </span>
                    <span className="text-sm font-medium text-gray-300">{item.count}</span>
                  </div>
                  <div className="w-full bg-navy-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${typeColors[item.type as IssueType] || "bg-gray-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300">{t.dashboard.recentIssues}</h3>
          <Link href="/issues" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
            {t.issues.title} →
          </Link>
        </div>
        <div className="space-y-2">
          {stats.recentIssues.map((issue) => (
            <Link
              key={issue.id}
              href={`/issues/${issue.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-mono text-accent-400 flex-shrink-0">{issue.issueKey}</span>
                <span className="text-sm text-gray-300 group-hover:text-white truncate">{issue.title}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <span className={`badge border ${
                  issue.status === "open" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                  issue.status === "in_progress" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                  issue.status === "done" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                  "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }`}>
                  {t.statuses[issue.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
