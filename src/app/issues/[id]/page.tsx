"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Issue, Comment, IssueStatus } from "@/types";
import {
  ArrowLeft,
  Bug,
  CheckSquare,
  BookOpen,
  Zap,
  AlertTriangle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Send,
  Trash2,
  Clock,
} from "lucide-react";

const statusColors: Record<IssueStatus, string> = {
  open: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  in_review: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  testing: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  done: "bg-green-500/20 text-green-400 border-green-500/30",
  closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchIssue = async () => {
    const res = await fetch(`/api/issues/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setIssue(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIssue();
  }, [params.id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!issue) return;
    await fetch(`/api/issues/${issue.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...issue, status: newStatus }),
    });
    fetchIssue();
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !issue) return;
    setSubmitting(true);
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment, issueId: issue.id }),
    });
    setNewComment("");
    setSubmitting(false);
    fetchIssue();
  };

  const handleDelete = async () => {
    if (!issue) return;
    if (!confirm("Delete this issue?")) return;
    await fetch(`/api/issues/${issue.id}`, { method: "DELETE" });
    router.push("/issues");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{t.noData}</p>
      </div>
    );
  }

  const typeIcons: Record<string, React.ReactNode> = {
    bug: <Bug className="w-5 h-5 text-red-400" />,
    task: <CheckSquare className="w-5 h-5 text-blue-400" />,
    story: <BookOpen className="w-5 h-5 text-green-400" />,
    epic: <Zap className="w-5 h-5 text-purple-400" />,
  };

  const priorityInfo: Record<string, { icon: React.ReactNode; label: string }> = {
    critical: { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, label: t.priorities.critical },
    high: { icon: <ArrowUp className="w-4 h-4 text-orange-400" />, label: t.priorities.high },
    medium: { icon: <ArrowRight className="w-4 h-4 text-yellow-400" />, label: t.priorities.medium },
    low: { icon: <ArrowDown className="w-4 h-4 text-blue-400" />, label: t.priorities.low },
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="btn-ghost text-sm px-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.issues.title}
      </button>

      {/* Issue Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {typeIcons[issue.type]}
              <span className="text-sm font-mono text-accent-400">{issue.issueKey}</span>
              <span className={`badge border ${statusColors[issue.status]}`}>
                {t.statuses[issue.status]}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white">{issue.title}</h1>
          </div>
          <button onClick={handleDelete} className="btn-ghost text-red-400 hover:text-red-300 px-2">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {issue.description && (
          <div className="mt-4 p-4 bg-navy-800 rounded-lg">
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{issue.description}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Change */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">{t.issues.status}</h3>
            <div className="flex flex-wrap gap-2">
              {(["open", "in_progress", "in_review", "testing", "done", "closed"] as IssueStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`badge border cursor-pointer transition-all ${
                      issue.status === status
                        ? statusColors[status] + " ring-1 ring-offset-1 ring-offset-navy-900"
                        : "bg-navy-800 text-gray-400 border-navy-600 hover:border-gray-500"
                    }`}
                  >
                    {t.statuses[status]}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              {t.issues.comments} ({issue.comments?.length || 0})
            </h3>

            {/* Comment Input */}
            <div className="flex gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                A
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t.issues.writeComment}
                  className="input-field min-h-[80px] resize-y mb-2"
                />
                <button
                  onClick={handleAddComment}
                  disabled={submitting || !newComment.trim()}
                  className="btn-primary text-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t.issues.addComment}
                </button>
              </div>
            </div>

            {/* Comment List */}
            <div className="space-y-4">
              {issue.comments?.map((comment: Comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center text-gray-300 text-xs font-bold flex-shrink-0">
                    {comment.author?.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-200">
                        {comment.author?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 bg-navy-800 p-3 rounded-lg">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Details */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">{t.issues.priority}</p>
              <div className="flex items-center gap-2">
                {priorityInfo[issue.priority]?.icon}
                <span className="text-sm text-gray-200">{priorityInfo[issue.priority]?.label}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">{t.issues.type}</p>
              <div className="flex items-center gap-2">
                {typeIcons[issue.type]}
                <span className="text-sm text-gray-200">
                  {t.issueTypes[issue.type]}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">{t.issues.project}</p>
              <span className="text-sm text-gray-200">{issue.project?.name || "-"}</span>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">{t.issues.assignee}</p>
              {issue.assignee ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-bold">
                    {issue.assignee.name.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-200">{issue.assignee.name}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">{t.issues.unassigned}</span>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">{t.issues.reporter}</p>
              {issue.reporter && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-gray-300 text-xs font-bold">
                    {issue.reporter.name.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-200">{issue.reporter.name}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-navy-700 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{t.issues.created}: {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{t.issues.updated}: {new Date(issue.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
