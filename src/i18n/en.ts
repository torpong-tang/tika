const en = {
  // General
  appName: "TIKA Defect Tracker",
  language: "Language",
  english: "English",
  thai: "ไทย",
  search: "Search...",
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  edit: "Edit",
  create: "Create",
  close: "Close",
  confirm: "Confirm",
  actions: "Actions",
  noData: "No data available",
  loading: "Loading...",

  // Navigation
  nav: {
    dashboard: "Dashboard",
    issues: "Issues",
    projects: "Projects",
    board: "Board",
    settings: "Settings",
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    totalIssues: "Total Issues",
    openIssues: "Open Issues",
    inProgress: "In Progress",
    resolved: "Resolved",
    criticalIssues: "Critical Issues",
    recentIssues: "Recent Issues",
    issuesByStatus: "Issues by Status",
    issuesByPriority: "Issues by Priority",
    issuesByType: "Issues by Type",
    overview: "Overview",
  },

  // Issues
  issues: {
    title: "Issues",
    createIssue: "Create Issue",
    editIssue: "Edit Issue",
    issueDetail: "Issue Detail",
    issueKey: "Issue Key",
    issueTitle: "Title",
    description: "Description",
    type: "Type",
    status: "Status",
    priority: "Priority",
    assignee: "Assignee",
    reporter: "Reporter",
    project: "Project",
    created: "Created",
    updated: "Updated",
    comments: "Comments",
    addComment: "Add Comment",
    writeComment: "Write a comment...",
    noIssues: "No issues found",
    filterByStatus: "Filter by Status",
    filterByPriority: "Filter by Priority",
    filterByType: "Filter by Type",
    filterByProject: "Filter by Project",
    allStatuses: "All Statuses",
    allPriorities: "All Priorities",
    allTypes: "All Types",
    allProjects: "All Projects",
    unassigned: "Unassigned",
    selectAssignee: "Select Assignee",
    selectProject: "Select Project",
    listView: "List View",
    boardView: "Board View",
  },

  // Issue Types
  issueTypes: {
    bug: "Bug",
    task: "Task",
    story: "Story",
    epic: "Epic",
  },

  // Statuses
  statuses: {
    open: "Open",
    in_progress: "In Progress",
    in_review: "In Review",
    testing: "Testing",
    done: "Done",
    closed: "Closed",
  },

  // Priorities
  priorities: {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  },

  // Projects
  projects: {
    title: "Projects",
    createProject: "Create Project",
    editProject: "Edit Project",
    projectName: "Project Name",
    projectKey: "Project Key",
    description: "Description",
    issueCount: "Issue Count",
    noProjects: "No projects found",
  },

  // Roles
  roles: {
    admin: "Admin",
    developer: "Developer",
    tester: "Tester",
    manager: "Manager",
  },
};

export default en;
export type Translations = typeof en;
