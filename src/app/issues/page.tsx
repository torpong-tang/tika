"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Issue, Project } from "@/types";
import IssueTable from "@/components/Issues/IssueTable";
import CreateIssueModal from "@/components/Issues/CreateIssueModal";
import { Plus, Filter } from "lucide-react";

export default function IssuesPage() {
  const { t } = useLanguage();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    type: "",
    projectId: "",
  });

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.type) params.set("type", filters.type);
    if (filters.projectId) params.set("projectId", filters.projectId);

    const res = await fetch(`/api/issues?${params.toString()}`);
    const data = await res.json();
    setIssues(data);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchIssues();
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
  }, [fetchIssues]);

  const handleCreateIssue = async (data: unknown) => {
    await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
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
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          {t.issues.createIssue}
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />

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
