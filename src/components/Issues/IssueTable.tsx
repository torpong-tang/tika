"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Issue, IssueStatus, IssuePriority, IssueType } from "@/types";
import {
  Bug,
  CheckSquare,
  BookOpen,
  Zap,
  AlertTriangle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  MessageSquare,
} from "lucide-react";

const typeIcons: Record<IssueType, React.ReactNode> = {
  bug: <Bug className="w-4 h-4 text-red-400" />,
  task: <CheckSquare className="w-4 h-4 text-blue-400" />,
  story: <BookOpen className="w-4 h-4 text-green-400" />,
  epic: <Zap className="w-4 h-4 text-purple-400" />,
};

const priorityIcons: Record<IssuePriority, React.ReactNode> = {
  critical: <AlertTriangle className="w-4 h-4 text-red-500" />,
  high: <ArrowUp className="w-4 h-4 text-orange-400" />,
  medium: <ArrowRight className="w-4 h-4 text-yellow-400" />,
  low: <ArrowDown className="w-4 h-4 text-blue-400" />,
};

const statusColors: Record<IssueStatus, string> = {
  open: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  in_review: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  testing: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  done: "bg-green-500/20 text-green-400 border-green-500/30",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

interface IssueTableProps {
  issues: Issue[];
}

export default function IssueTable({ issues }: IssueTableProps) {
  const { t } = useLanguage();

  if (issues.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Bug className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">{t.issues.noIssues}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-navy-700">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.issues.type}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.issues.issueKey}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.issues.issueTitle}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.issues.status}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.issues.priority}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t.issues.assignee}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800">
            {issues.map((issue) => (
              <tr
                key={issue.id}
                className="hover:bg-navy-800/50 transition-colors group"
              >
                <td className="px-4 py-3">
                  {typeIcons[issue.type]}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-accent-400">{issue.issueKey}</span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/issues/${issue.id}`}
                    className="text-sm text-gray-200 hover:text-accent-400 transition-colors font-medium"
                  >
                    {issue.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge border ${statusColors[issue.status]}`}>
                    {t.statuses[issue.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {priorityIcons[issue.priority]}
                    <span className="text-sm text-gray-300">{t.priorities[issue.priority]}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {issue.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-bold">
                        {issue.assignee.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-300">{issue.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">{t.issues.unassigned}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {issue._count && issue._count.comments > 0 && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-xs">{issue._count.comments}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
