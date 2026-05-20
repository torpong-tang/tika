"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Paperclip, X } from "lucide-react";
import { Project, User, IssueType, IssuePriority } from "@/types";

const ISSUE_ATTACHMENT_LIMIT_BYTES = 20 * 1024 * 1024;

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIssueData) => Promise<void> | void;
  editData?: EditIssueData | null;
}

interface CreateIssueData {
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  projectId: string;
  assigneeId: string;
  attachments?: File[];
}

interface EditIssueData extends CreateIssueData {
  id: string;
  status: string;
}

export default function CreateIssueModal({
  isOpen,
  onClose,
  onSubmit,
  editData,
}: CreateIssueModalProps) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateIssueData>({
    title: "",
    description: "",
    type: "bug",
    priority: "medium",
    projectId: "",
    assigneeId: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetch("/api/projects").then((r) => r.json()).then(setProjects);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !form.projectId) {
      setUsers([]);
      return;
    }

    fetch(`/api/users?projectId=${form.projectId}`)
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));
  }, [form.projectId, isOpen]);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title,
        description: editData.description,
        type: editData.type,
        priority: editData.priority,
        projectId: editData.projectId,
        assigneeId: editData.assigneeId,
      });
    } else {
      setForm({
        title: "",
        description: "",
        type: "bug",
        priority: "medium",
        projectId: "",
        assigneeId: "",
      });
    }
    setSelectedFiles([]);
    setError("");
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const selectedSize = selectedFiles.reduce((total, file) => total + file.size, 0);
  const isOverLimit = selectedSize > ISSUE_ATTACHMENT_LIMIT_BYTES;
  const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  const handleFileChange = (files: FileList | null) => {
    const nextFiles = Array.from(files || []);
    setSelectedFiles(nextFiles);
    setError(
      nextFiles.reduce((total, file) => total + file.size, 0) > ISSUE_ATTACHMENT_LIMIT_BYTES
        ? t.issues.attachmentLimitError
        : ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOverLimit) {
      setError(t.issues.attachmentLimitError);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ ...form, attachments: selectedFiles });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.issues.createIssueError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-navy-700">
          <h2 className="text-lg font-semibold text-white">
            {editData ? t.issues.editIssue : t.issues.createIssue}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:bg-navy-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t.issues.issueTitle} *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
              placeholder={t.issues.issueTitle}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t.issues.description}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field min-h-[100px] resize-y"
              placeholder={t.issues.description}
            />
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t.issues.type}
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as IssueType })}
                className="select-field"
              >
                <option value="bug">{t.issueTypes.bug}</option>
                <option value="task">{t.issueTypes.task}</option>
                <option value="story">{t.issueTypes.story}</option>
                <option value="epic">{t.issueTypes.epic}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t.issues.priority}
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as IssuePriority })}
                className="select-field"
              >
                <option value="critical">{t.priorities.critical}</option>
                <option value="high">{t.priorities.high}</option>
                <option value="medium">{t.priorities.medium}</option>
                <option value="low">{t.priorities.low}</option>
              </select>
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t.issues.project} *
            </label>
            <select
              required
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value, assigneeId: "" })}
              className="select-field"
            >
              <option value="">{t.issues.selectProject}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.key})
                </option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t.issues.assignee}
            </label>
            <select
              value={form.assigneeId}
              onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
              className="select-field"
            >
              <option value="">{t.issues.unassigned}</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Attachments */}
          {!editData && (
            <div className="rounded-lg border border-navy-700 bg-navy-800/60 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Paperclip className="h-4 w-4 text-accent-400" />
                  {t.issues.attachments}
                </label>
                <span className={`text-xs ${isOverLimit ? "text-red-400" : "text-gray-500"}`}>
                  {formatFileSize(selectedSize)} / 20 MB
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e.target.files)}
                className="block w-full text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-accent-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-accent-500"
              />
              {selectedFiles.length > 0 && (
                <div className="mt-3 space-y-1">
                  {selectedFiles.map((file) => (
                    <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 text-xs text-gray-400">
                      <span className="truncate">{file.name}</span>
                      <span className="shrink-0">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">{t.issues.attachmentLimitHint}</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              {t.cancel}
            </button>
            <button type="submit" disabled={submitting || isOverLimit} className="btn-primary disabled:opacity-50">
              {submitting ? t.loading : editData ? t.save : t.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
