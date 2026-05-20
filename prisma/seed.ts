import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash("password123", 12);

  // ── Admin Users (5) ──
  const admins = [
    { name: "Torpong T.", email: "torpong.t@gmail.com" },
    { name: "Ananya Srisuk", email: "ananya.admin@tika.dev" },
    { name: "Robert Park", email: "robert.admin@tika.dev" },
    { name: "Kanya Wichit", email: "kanya.admin@tika.dev" },
    { name: "David Lee", email: "david.admin@tika.dev" },
  ];
  for (const u of admins) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { isActive: true },
      create: { ...u, password: defaultPassword, role: "admin", isActive: true },
    });
  }

  // ── Developer Users (5) ──
  const developers = [
    { name: "John Smith", email: "john@tika.dev" },
    { name: "Somchai Kaew", email: "somchai.dev@tika.dev" },
    { name: "Emily Wang", email: "emily.dev@tika.dev" },
    { name: "Nattapong Sae", email: "nattapong.dev@tika.dev" },
    { name: "Mike Chen", email: "mike@tika.dev" },
  ];
  for (const u of developers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { isActive: true },
      create: { ...u, password: defaultPassword, role: "developer", isActive: true },
    });
  }

  // ── Tester Users (5) ──
  const testers = [
    { name: "Sara Johnson", email: "sara@tika.dev" },
    { name: "Ploy Thanakit", email: "ploy.test@tika.dev" },
    { name: "James Brown", email: "james.test@tika.dev" },
    { name: "Naree Wongsakul", email: "naree.test@tika.dev" },
    { name: "Lisa Park", email: "lisa.test@tika.dev" },
  ];
  for (const u of testers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { isActive: true },
      create: { ...u, password: defaultPassword, role: "tester", isActive: true },
    });
  }

  // ── Manager Users (5) ──
  const managers = [
    { name: "Pravit Chantra", email: "pravit.mgr@tika.dev" },
    { name: "Susan Miller", email: "susan.mgr@tika.dev" },
    { name: "Wichai Prom", email: "wichai.mgr@tika.dev" },
    { name: "Karen White", email: "karen.mgr@tika.dev" },
    { name: "Arthit Saeng", email: "arthit.mgr@tika.dev" },
  ];
  for (const u of managers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { isActive: true },
      create: { ...u, password: defaultPassword, role: "manager", isActive: true },
    });
  }

  // ── Disabled User (for testing) ──
  await prisma.user.upsert({
    where: { email: "disabled@tika.dev" },
    update: { isActive: false },
    create: { name: "Disabled User", email: "disabled@tika.dev", password: defaultPassword, role: "developer", isActive: false },
  });

  // ── Read-only Users (view only) ──
  await prisma.user.upsert({
    where: { email: "readonly@tika.dev" },
    update: { isActive: true, role: "readonly" },
    create: {
      name: "Readonly Viewer",
      email: "readonly@tika.dev",
      password: defaultPassword,
      role: "readonly",
      isActive: true,
    },
  });

  // References for issues
  const user1 = await prisma.user.findUnique({ where: { email: "torpong.t@gmail.com" } });
  const user2 = await prisma.user.findUnique({ where: { email: "john@tika.dev" } });
  const user3 = await prisma.user.findUnique({ where: { email: "sara@tika.dev" } });
  const user4 = await prisma.user.findUnique({ where: { email: "mike@tika.dev" } });
  if (!user1 || !user2 || !user3 || !user4) throw new Error("Users not found");

  // Create Projects
  const project1 = await prisma.project.upsert({
    where: { key: "WEB" },
    update: {},
    create: {
      name: "Web Application",
      key: "WEB",
      description: "Main web application project",
    },
  });

  const project2 = await prisma.project.upsert({
    where: { key: "MOB" },
    update: {},
    create: {
      name: "Mobile App",
      key: "MOB",
      description: "Mobile application project",
    },
  });

  const project3 = await prisma.project.upsert({
    where: { key: "API" },
    update: {},
    create: {
      name: "API Backend",
      key: "API",
      description: "Backend API services",
    },
  });

  const projectAccess: Record<string, string[]> = {
    "john@tika.dev": [project1.id, project3.id],
    "somchai.dev@tika.dev": [project1.id],
    "emily.dev@tika.dev": [project2.id],
    "nattapong.dev@tika.dev": [project3.id],
    "mike@tika.dev": [project1.id, project2.id, project3.id],
    "sara@tika.dev": [project1.id, project2.id, project3.id],
    "ploy.test@tika.dev": [project1.id],
    "james.test@tika.dev": [project2.id],
    "naree.test@tika.dev": [project3.id],
    "lisa.test@tika.dev": [project1.id, project2.id],
    "pravit.mgr@tika.dev": [project1.id, project2.id, project3.id],
    "susan.mgr@tika.dev": [project1.id],
    "wichai.mgr@tika.dev": [project2.id],
    "karen.mgr@tika.dev": [project3.id],
    "arthit.mgr@tika.dev": [project1.id, project3.id],
    "readonly@tika.dev": [project1.id],
  };

  for (const [email, projectIds] of Object.entries(projectAccess)) {
    const member = await prisma.user.findUnique({ where: { email } });
    if (!member) continue;
    for (const projectId of projectIds) {
      await prisma.projectMember.upsert({
        where: { projectId_userId: { projectId, userId: member.id } },
        update: {},
        create: { userId: member.id, projectId },
      });
    }
  }

  // Create Issues
  const issues = [
    {
      issueKey: "WEB-1",
      title: "Login page not rendering correctly on mobile",
      description: "The login page layout breaks on screen sizes below 768px. The form fields overlap with the logo.",
      type: "bug",
      status: "open",
      priority: "high",
      projectId: project1.id,
      assigneeId: user2.id,
      reporterId: user3.id,
    },
    {
      issueKey: "WEB-2",
      title: "Implement dark mode toggle",
      description: "Add a toggle switch in the header to switch between light and dark themes.",
      type: "task",
      status: "in_progress",
      priority: "medium",
      projectId: project1.id,
      assigneeId: user2.id,
      reporterId: user1.id,
    },
    {
      issueKey: "WEB-3",
      title: "Dashboard charts not updating in real-time",
      description: "The dashboard statistics charts do not refresh when new data comes in. User has to manually refresh the page.",
      type: "bug",
      status: "open",
      priority: "critical",
      projectId: project1.id,
      assigneeId: user4.id,
      reporterId: user3.id,
    },
    {
      issueKey: "WEB-4",
      title: "Add export to PDF feature",
      description: "Users should be able to export reports to PDF format.",
      type: "story",
      status: "in_review",
      priority: "medium",
      projectId: project1.id,
      assigneeId: user4.id,
      reporterId: user1.id,
    },
    {
      issueKey: "WEB-5",
      title: "Optimize image loading performance",
      description: "Images on the gallery page take too long to load. Implement lazy loading and compression.",
      type: "task",
      status: "done",
      priority: "high",
      projectId: project1.id,
      assigneeId: user2.id,
      reporterId: user1.id,
    },
    {
      issueKey: "MOB-1",
      title: "App crashes on Android 12 when opening camera",
      description: "The app crashes immediately when the user tries to open the camera on Android 12 devices.",
      type: "bug",
      status: "open",
      priority: "critical",
      projectId: project2.id,
      assigneeId: user4.id,
      reporterId: user3.id,
    },
    {
      issueKey: "MOB-2",
      title: "Push notification not received on iOS",
      description: "Push notifications are not being delivered to iOS devices after the latest update.",
      type: "bug",
      status: "in_progress",
      priority: "high",
      projectId: project2.id,
      assigneeId: user2.id,
      reporterId: user3.id,
    },
    {
      issueKey: "MOB-3",
      title: "Implement biometric authentication",
      description: "Add fingerprint and face ID authentication support for the mobile app.",
      type: "story",
      status: "testing",
      priority: "medium",
      projectId: project2.id,
      assigneeId: user4.id,
      reporterId: user1.id,
    },
    {
      issueKey: "API-1",
      title: "Rate limiting not working correctly",
      description: "The API rate limiter allows more requests than configured. Expected 100 req/min but allowing 500+.",
      type: "bug",
      status: "open",
      priority: "high",
      projectId: project3.id,
      assigneeId: user2.id,
      reporterId: user3.id,
    },
    {
      issueKey: "API-2",
      title: "Add pagination to user list endpoint",
      description: "The /api/users endpoint returns all users at once. Need to add cursor-based pagination.",
      type: "task",
      status: "done",
      priority: "medium",
      projectId: project3.id,
      assigneeId: user4.id,
      reporterId: user1.id,
    },
    {
      issueKey: "API-3",
      title: "Database connection pool exhaustion",
      description: "Under heavy load, the database connection pool gets exhausted causing 500 errors.",
      type: "bug",
      status: "in_progress",
      priority: "critical",
      projectId: project3.id,
      assigneeId: user2.id,
      reporterId: user3.id,
    },
    {
      issueKey: "WEB-6",
      title: "Form validation messages not displaying",
      description: "When submitting forms with invalid data, validation error messages are not shown to the user.",
      type: "bug",
      status: "testing",
      priority: "medium",
      projectId: project1.id,
      assigneeId: user2.id,
      reporterId: user3.id,
    },
  ];

  for (const issue of issues) {
    const savedIssue = await prisma.issue.upsert({
      where: { issueKey: issue.issueKey },
      update: {},
      create: issue,
    });
    await prisma.issueActivity.upsert({
      where: { id: `seed-${savedIssue.issueKey}` },
      update: {},
      create: {
        id: `seed-${savedIssue.issueKey}`,
        action: "created",
        field: "issue",
        newValue: savedIssue.title,
        issueId: savedIssue.id,
        actorId: savedIssue.reporterId,
      },
    });
  }

  // Create Comments
  const allIssues = await prisma.issue.findMany();
  const webIssue1 = allIssues.find((i) => i.issueKey === "WEB-1");
  const webIssue3 = allIssues.find((i) => i.issueKey === "WEB-3");
  const mobIssue1 = allIssues.find((i) => i.issueKey === "MOB-1");

  if (webIssue1) {
    await prisma.comment.create({
      data: {
        content: "I can reproduce this on Chrome mobile emulator. Looks like a CSS flexbox issue.",
        issueId: webIssue1.id,
        authorId: user2.id,
      },
    });
    await prisma.comment.create({
      data: {
        content: "Added a fix using media queries. Please review PR #42.",
        issueId: webIssue1.id,
        authorId: user2.id,
      },
    });
  }

  if (webIssue3) {
    await prisma.comment.create({
      data: {
        content: "This might be related to the WebSocket connection dropping. Investigating...",
        issueId: webIssue3.id,
        authorId: user4.id,
      },
    });
  }

  if (mobIssue1) {
    await prisma.comment.create({
      data: {
        content: "Confirmed on Samsung Galaxy S22 with Android 12. The crash log shows a permission issue.",
        issueId: mobIssue1.id,
        authorId: user3.id,
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
