export type IssueType = "bug" | "task" | "story" | "epic";
export type IssueStatus = "open" | "in_progress" | "in_review" | "testing" | "done" | "closed";
export type IssuePriority = "critical" | "high" | "medium" | "low";
export type UserRole = "admin" | "developer" | "tester" | "manager";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string | null;
  createdAt: string;
  _count?: {
    issues: number;
  };
}

export interface Issue {
  id: string;
  issueKey: string;
  title: string;
  description: string | null;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  project?: Project;
  assigneeId: string | null;
  assignee?: User | null;
  reporterId: string;
  reporter?: User;
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  issueId: string;
  authorId: string;
  author?: User;
}

export interface DashboardStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  closedIssues: number;
  criticalIssues: number;
  byStatus: { status: string; count: number }[];
  byPriority: { priority: string; count: number }[];
  byType: { type: string; count: number }[];
  recentIssues: Issue[];
}
