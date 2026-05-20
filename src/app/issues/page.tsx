"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Issue, Project, User } from "@/types";
import IssueTable from "@/components/Issues/IssueTable";
import CreateIssueModal from "@/components/Issues/CreateIssueModal";
import { Plus, Filter } from "lucide-react";

export default function IssuesPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    type: "",
    projectId: "",
    assigneeId: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });
  const canCreate = user?.role !== "readonly";

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.type) params.set("type", filters.type);
    if (filters.projectId) params.set("projectId", filters.projectId);
    if (filters.assigneeId) params.set("assigneeId", filters.assigneeId);
    if (filters.search) params.set("search", filters.search);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);

    const res = await fetch(`/api/issues?${params.toString()}`);
    const data = await res.json();
    setIssues(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchIssues();
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
    fetch("/api/users").then((r) => r.json()).then(setUsers);
  }, [fetchIssues]);

  const handleCreateIssue = async (data: {
    title: string;
    description: string;
    type: string;
    priority: string;
    projectId: string;
    assigneeId: string;
    attachments?: File[];
  }) => {
    const { attachments = [], ...issueData } = data;
    const response = await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issueData),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || "Could not create issue");
    }

    const issue = await response.json();
    for (const file of attachments) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadResponse = await fetch(`/api/issues/${issue.id}/attachments`, {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) {
        const error = await uploadResponse.json().catch(() => null);
        throw new Error(error?.error || "Could not upload attachment");
      }
    }

    setShowCreateModal(false);
    fetchIssues();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.issues.title}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {issues.length} {t.issues.title.toLowerCase()}
          </p>
        </div>
        {canCreate && (
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" />
            {t.issues.createIssue}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />

          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input-field w-auto min-w-[220px]"
            placeholder={t.search}
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="select-field w-auto min-w-[150px]"
          >
            <option value="">{t.issues.allStatuses}</option>
            <option value="open">{t.statuses.open}</option>
            <option value="in_progress">{t.statuses.in_progress}</option>
            <option value="in_review">{t.statuses.in_review}</option>
            <option value="testing">{t.statuses.testing}</option>
            <option value="done">{t.statuses.done}</option>
            <option value="closed">{t.statuses.closed}</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="select-field w-auto min-w-[150px]"
          >
            <option value="">{t.issues.allPriorities}</option>
            <option value="critical">{t.priorities.critical}</option>
            <option value="high">{t.priorities.high}</option>
            <option value="medium">{t.priorities.medium}</option>
            <option value="low">{t.priorities.low}</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="select-field w-auto min-w-[150px]"
          >
            <option value="">{t.issues.allTypes}</option>
            <option value="bug">{t.issueTypes.bug}</option>
            <option value="task">{t.issueTypes.task}</option>
            <option value="story">{t.issueTypes.story}</option>
            <option value="epic">{t.issueTypes.epic}</option>
          </select>

          <select
            value={filters.projectId}
            onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
            className="select-field w-auto min-w-[150px]"
          >
            <option value="">{t.issues.allProjects}</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={filters.assigneeId}
            onChange={(e) => setFilters({ ...filters, assigneeId: e.target.value })}
            className="select-field w-auto min-w-[170px]"
          >
            <option value="">{t.issues.allAssignees}</option>
            <option value="unassigned">{t.issues.unassigned}</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="input-field w-auto"
            aria-label={t.issues.dateFrom}
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="input-field w-auto"
            aria-label={t.issues.dateTo}
          />
        </div>
      </div>

      {/* Issues Table */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
        </div>
      ) : (
        <IssueTable issues={issues} />
      )}

      {/* Create Modal */}
      <CreateIssueModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateIssue}
      />
    </div>
  );
}
