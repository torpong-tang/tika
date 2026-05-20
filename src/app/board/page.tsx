"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Issue, IssueStatus } from "@/types";
import {
  Bug,
  CheckSquare,
  BookOpen,
  Zap,
  AlertTriangle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

const columns: IssueStatus[] = ["open", "in_progress", "in_review", "testing", "done", "closed"];

const columnColors: Record<IssueStatus, string> = {
  open: "border-t-blue-500",
  in_progress: "border-t-amber-500",
  in_review: "border-t-purple-500",
  testing: "border-t-cyan-500",
  done: "border-t-green-500",
  closed: "border-t-gray-500",
};

const columnDotColors: Record<IssueStatus, string> = {
  open: "bg-blue-500",
  in_progress: "bg-amber-500",
  in_review: "bg-purple-500",
  testing: "bg-cyan-500",
  done: "bg-green-500",
  closed: "bg-gray-500",
};

const typeIcons: Record<string, React.ReactNode> = {
  bug: <Bug className="w-3.5 h-3.5 text-red-400" />,
  task: <CheckSquare className="w-3.5 h-3.5 text-blue-400" />,
  story: <BookOpen className="w-3.5 h-3.5 text-green-400" />,
  epic: <Zap className="w-3.5 h-3.5 text-purple-400" />,
};

const priorityIcons: Record<string, React.ReactNode> = {
  critical: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
  high: <ArrowUp className="w-3.5 h-3.5 text-orange-400" />,
  medium: <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />,
  low: <ArrowDown className="w-3.5 h-3.5 text-blue-400" />,
};

export default function BoardPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/issues")
      .then((r) => r.json())
      .then((data) => {
        setIssues(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDrop = async (issueId: string, newStatus: IssueStatus) => {
    const issue = issues.find((i) => i.id === issueId);
    if (user?.role === "readonly") return;
    if (!issue || issue.status === newStatus) return;

    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i))
    );

    await fetch(`/api/issues/${issueId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...issue, status: newStatus }),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.nav.board}</h1>
        <p className="text-sm text-gray-400 mt-1">{t.issues.boardView}</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 220px)" }}>
        {columns.map((status) => {
          const columnIssues = issues.filter((i) => i.status === status);
          return (
            <div
              key={status}
              className={`flex-shrink-0 w-72 bg-navy-900/50 rounded-xl border border-navy-700 border-t-2 ${columnColors[status]} flex flex-col`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const issueId = e.dataTransfer.getData("issueId");
                handleDrop(issueId, status);
              }}
            >
              {/* Column Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${columnDotColors[status]}`} />
                  <span className="text-sm font-semibold text-gray-300">
                    {t.statuses[status]}
                  </span>
                </div>
                <span className="text-xs bg-navy-800 text-gray-400 px-2 py-0.5 rounded-full">
                  {columnIssues.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {columnIssues.map((issue) => (
                  <Link
                    key={issue.id}
                    href={`/issues/${issue.id}`}
                    draggable={user?.role !== "readonly"}
                    onDragStart={(e) => {
                      if (user?.role === "readonly") return;
                      e.dataTransfer.setData("issueId", issue.id);
                    }}
                    className={`block bg-navy-800 border border-navy-700 rounded-lg p-3 hover:border-accent-500/40 transition-all group ${
                      user?.role === "readonly" ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {typeIcons[issue.type]}
                      <span className="text-xs font-mono text-accent-400">{issue.issueKey}</span>
                    </div>
                    <p className="text-sm text-gray-200 group-hover:text-white mb-3 line-clamp-2">
                      {issue.title}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {priorityIcons[issue.priority]}
                      </div>
                      {issue.assignee ? (
                        <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-bold">
                          {issue.assignee.name.charAt(0)}
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-gray-500 text-xs">
                          ?
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
