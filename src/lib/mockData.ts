const now = new Date().toISOString();
const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

export const mockUsers = [
  { id: "u1", name: "Somchai Prasert", email: "somchai@tika.dev", role: "admin", avatar: null, createdAt: monthAgo, updatedAt: now },
  { id: "u2", name: "Naree Wongsakul", email: "naree@tika.dev", role: "developer", avatar: null, createdAt: monthAgo, updatedAt: now },
  { id: "u3", name: "Johnson Smith", email: "johnson@tika.dev", role: "developer", avatar: null, createdAt: monthAgo, updatedAt: now },
  { id: "u4", name: "Ploy Thanakit", email: "ploy@tika.dev", role: "tester", avatar: null, createdAt: monthAgo, updatedAt: now },
  { id: "u5", name: "David Chen", email: "david@tika.dev", role: "manager", avatar: null, createdAt: monthAgo, updatedAt: now },
];

export const mockProjects = [
  { id: "p1", name: "Web Application", key: "WEB", description: "Main customer-facing web application with React frontend and API backend", createdAt: monthAgo, updatedAt: now, _count: { issues: 6 } },
  { id: "p2", name: "Mobile App", key: "MOB", description: "iOS and Android mobile application built with React Native", createdAt: monthAgo, updatedAt: now, _count: { issues: 4 } },
  { id: "p3", name: "API Platform", key: "API", description: "Core REST API platform and microservices infrastructure", createdAt: twoWeeksAgo, updatedAt: now, _count: { issues: 5 } },
];

export const mockIssues = [
  {
    id: "i1", issueKey: "WEB-1", title: "Login page crashes on invalid email format", description: "When a user enters an email without @ symbol and clicks submit, the entire page crashes with an unhandled exception. Stack trace points to email validation regex.", type: "bug", status: "open", priority: "critical",
    projectId: "p1", assigneeId: "u2", reporterId: "u1",
    project: mockProjects[0], assignee: mockUsers[1], reporter: mockUsers[0],
    createdAt: weekAgo, updatedAt: weekAgo,
    _count: { comments: 3 },
    comments: [
      { id: "c1", content: "Confirmed this bug. The regex pattern is missing escape characters.", issueId: "i1", authorId: "u2", author: mockUsers[1], createdAt: weekAgo, updatedAt: weekAgo },
      { id: "c2", content: "I can reproduce this on Chrome and Firefox. Safari shows a different error.", issueId: "i1", authorId: "u4", author: mockUsers[3], createdAt: weekAgo, updatedAt: weekAgo },
      { id: "c3", content: "Fix is ready, will submit PR today.", issueId: "i1", authorId: "u2", author: mockUsers[1], createdAt: now, updatedAt: now },
    ],
  },
  {
    id: "i2", issueKey: "WEB-2", title: "Implement user profile settings page", description: "Create a new settings page where users can update their profile information, change password, and manage notification preferences.", type: "story", status: "in_progress", priority: "high",
    projectId: "p1", assigneeId: "u3", reporterId: "u5",
    project: mockProjects[0], assignee: mockUsers[2], reporter: mockUsers[4],
    createdAt: twoWeeksAgo, updatedAt: now,
    _count: { comments: 1 },
    comments: [
      { id: "c4", content: "Design mockups are approved. Starting implementation.", issueId: "i2", authorId: "u3", author: mockUsers[2], createdAt: weekAgo, updatedAt: weekAgo },
    ],
  },
  {
    id: "i3", issueKey: "WEB-3", title: "Dashboard loading time exceeds 5 seconds", description: "The main dashboard takes over 5 seconds to load due to unoptimized database queries. Need to add proper indexing and implement caching.", type: "bug", status: "in_review", priority: "high",
    projectId: "p1", assigneeId: "u2", reporterId: "u4",
    project: mockProjects[0], assignee: mockUsers[1], reporter: mockUsers[3],
    createdAt: twoWeeksAgo, updatedAt: weekAgo,
    _count: { comments: 2 },
    comments: [
      { id: "c5", content: "Added Redis caching layer. Load time is now under 500ms.", issueId: "i3", authorId: "u2", author: mockUsers[1], createdAt: weekAgo, updatedAt: weekAgo },
      { id: "c6", content: "Verified performance improvement in staging. Looks great!", issueId: "i3", authorId: "u4", author: mockUsers[3], createdAt: weekAgo, updatedAt: weekAgo },
    ],
  },
  {
    id: "i4", issueKey: "WEB-4", title: "Add dark mode toggle to UI", description: "Users have requested a dark mode option. Implement a theme toggle in the header that persists in localStorage.", type: "story", status: "done", priority: "medium",
    projectId: "p1", assigneeId: "u3", reporterId: "u5",
    project: mockProjects[0], assignee: mockUsers[2], reporter: mockUsers[4],
    createdAt: monthAgo, updatedAt: weekAgo,
    _count: { comments: 1 },
    comments: [
      { id: "c7", content: "Dark mode is live! Great work team.", issueId: "i4", authorId: "u5", author: mockUsers[4], createdAt: weekAgo, updatedAt: weekAgo },
    ],
  },
  {
    id: "i5", issueKey: "WEB-5", title: "Export report data to CSV format", description: "Add ability to export filtered report data to CSV files for offline analysis.", type: "task", status: "open", priority: "low",
    projectId: "p1", assigneeId: null, reporterId: "u5",
    project: mockProjects[0], assignee: null, reporter: mockUsers[4],
    createdAt: weekAgo, updatedAt: weekAgo,
    _count: { comments: 0 },
    comments: [],
  },
  {
    id: "i6", issueKey: "WEB-6", title: "Fix broken image upload on Safari", description: "Image uploads fail on Safari browser due to incompatible HEIF format handling.", type: "bug", status: "testing", priority: "medium",
    projectId: "p1", assigneeId: "u2", reporterId: "u4",
    project: mockProjects[0], assignee: mockUsers[1], reporter: mockUsers[3],
    createdAt: weekAgo, updatedAt: now,
    _count: { comments: 1 },
    comments: [
      { id: "c8", content: "Added HEIF to JPEG conversion before upload. Testing on Safari now.", issueId: "i6", authorId: "u2", author: mockUsers[1], createdAt: now, updatedAt: now },
    ],
  },
  {
    id: "i7", issueKey: "MOB-1", title: "Push notifications not working on Android 14", description: "Users on Android 14 are not receiving push notifications. Likely related to new notification permission changes.", type: "bug", status: "in_progress", priority: "critical",
    projectId: "p2", assigneeId: "u3", reporterId: "u4",
    project: mockProjects[1], assignee: mockUsers[2], reporter: mockUsers[3],
    createdAt: weekAgo, updatedAt: now,
    _count: { comments: 2 },
    comments: [
      { id: "c9", content: "Investigating the new Android 14 notification permission model.", issueId: "i7", authorId: "u3", author: mockUsers[2], createdAt: weekAgo, updatedAt: weekAgo },
      { id: "c10", content: "Found the issue - need to request POST_NOTIFICATIONS permission at runtime.", issueId: "i7", authorId: "u3", author: mockUsers[2], createdAt: now, updatedAt: now },
    ],
  },
  {
    id: "i8", issueKey: "MOB-2", title: "Implement biometric authentication", description: "Add fingerprint and Face ID support for quick login on mobile devices.", type: "story", status: "open", priority: "high",
    projectId: "p2", assigneeId: "u3", reporterId: "u5",
    project: mockProjects[1], assignee: mockUsers[2], reporter: mockUsers[4],
    createdAt: twoWeeksAgo, updatedAt: twoWeeksAgo,
    _count: { comments: 0 },
    comments: [],
  },
  {
    id: "i9", issueKey: "MOB-3", title: "App crashes when switching from background", description: "Intermittent crash when bringing the app back from background after 10+ minutes. Memory leak suspected in the chat module.", type: "bug", status: "in_progress", priority: "high",
    projectId: "p2", assigneeId: "u2", reporterId: "u4",
    project: mockProjects[1], assignee: mockUsers[1], reporter: mockUsers[3],
    createdAt: weekAgo, updatedAt: now,
    _count: { comments: 1 },
    comments: [
      { id: "c11", content: "Memory profiling shows a leak in the WebSocket connection handler.", issueId: "i9", authorId: "u2", author: mockUsers[1], createdAt: now, updatedAt: now },
    ],
  },
  {
    id: "i10", issueKey: "MOB-4", title: "Optimize image caching for offline mode", description: "Images should be cached locally so users can view previously loaded content without internet.", type: "task", status: "done", priority: "medium",
    projectId: "p2", assigneeId: "u3", reporterId: "u5",
    project: mockProjects[1], assignee: mockUsers[2], reporter: mockUsers[4],
    createdAt: monthAgo, updatedAt: weekAgo,
    _count: { comments: 0 },
    comments: [],
  },
  {
    id: "i11", issueKey: "API-1", title: "Rate limiting not enforced on /api/auth endpoints", description: "The authentication endpoints lack rate limiting, making them vulnerable to brute force attacks. Need to implement token bucket rate limiting.", type: "bug", status: "open", priority: "critical",
    projectId: "p3", assigneeId: "u2", reporterId: "u4",
    project: mockProjects[2], assignee: mockUsers[1], reporter: mockUsers[3],
    createdAt: weekAgo, updatedAt: weekAgo,
    _count: { comments: 1 },
    comments: [
      { id: "c12", content: "This is a security priority. Please address ASAP.", issueId: "i11", authorId: "u5", author: mockUsers[4], createdAt: weekAgo, updatedAt: weekAgo },
    ],
  },
  {
    id: "i12", issueKey: "API-2", title: "Implement GraphQL endpoint for mobile clients", description: "Mobile clients need a GraphQL endpoint to reduce over-fetching and improve performance on slow connections.", type: "epic", status: "in_progress", priority: "medium",
    projectId: "p3", assigneeId: "u3", reporterId: "u5",
    project: mockProjects[2], assignee: mockUsers[2], reporter: mockUsers[4],
    createdAt: twoWeeksAgo, updatedAt: now,
    _count: { comments: 1 },
    comments: [
      { id: "c13", content: "Schema design is complete. Starting resolver implementation.", issueId: "i12", authorId: "u3", author: mockUsers[2], createdAt: now, updatedAt: now },
    ],
  },
  {
    id: "i13", issueKey: "API-3", title: "Database connection pool exhaustion under load", description: "Under heavy load (>1000 concurrent requests), the connection pool gets exhausted. Need to tune pool settings and add connection recycling.", type: "bug", status: "closed", priority: "critical",
    projectId: "p3", assigneeId: "u2", reporterId: "u4",
    project: mockProjects[2], assignee: mockUsers[1], reporter: mockUsers[3],
    createdAt: monthAgo, updatedAt: twoWeeksAgo,
    _count: { comments: 2 },
    comments: [
      { id: "c14", content: "Increased pool size from 10 to 50 and added idle timeout.", issueId: "i13", authorId: "u2", author: mockUsers[1], createdAt: twoWeeksAgo, updatedAt: twoWeeksAgo },
      { id: "c15", content: "Load test passed with 2000 concurrent connections. Closing.", issueId: "i13", authorId: "u4", author: mockUsers[3], createdAt: twoWeeksAgo, updatedAt: twoWeeksAgo },
    ],
  },
  {
    id: "i14", issueKey: "API-4", title: "Add comprehensive API documentation with Swagger", description: "Set up Swagger/OpenAPI documentation for all REST endpoints with examples and authentication details.", type: "task", status: "in_review", priority: "medium",
    projectId: "p3", assigneeId: "u3", reporterId: "u5",
    project: mockProjects[2], assignee: mockUsers[2], reporter: mockUsers[4],
    createdAt: twoWeeksAgo, updatedAt: weekAgo,
    _count: { comments: 0 },
    comments: [],
  },
  {
    id: "i15", issueKey: "API-5", title: "Migrate authentication to JWT refresh tokens", description: "Replace the current session-based auth with JWT access + refresh token pattern for better scalability.", type: "story", status: "testing", priority: "high",
    projectId: "p3", assigneeId: "u2", reporterId: "u5",
    project: mockProjects[2], assignee: mockUsers[1], reporter: mockUsers[4],
    createdAt: twoWeeksAgo, updatedAt: now,
    _count: { comments: 1 },
    comments: [
      { id: "c16", content: "Token rotation implemented. Running security tests.", issueId: "i15", authorId: "u2", author: mockUsers[1], createdAt: now, updatedAt: now },
    ],
  },
];

export function getMockDashboard() {
  const issues = mockIssues;
  const statusCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};

  issues.forEach((i) => {
    statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
    priorityCounts[i.priority] = (priorityCounts[i.priority] || 0) + 1;
    typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
  });

  return {
    totalIssues: issues.length,
    openIssues: statusCounts["open"] || 0,
    inProgressIssues: statusCounts["in_progress"] || 0,
    closedIssues: (statusCounts["done"] || 0) + (statusCounts["closed"] || 0),
    criticalIssues: priorityCounts["critical"] || 0,
    byStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    byPriority: Object.entries(priorityCounts).map(([priority, count]) => ({ priority, count })),
    byType: Object.entries(typeCounts).map(([type, count]) => ({ type, count })),
    recentIssues: issues.slice(0, 5),
  };
}
