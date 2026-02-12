import { test, expect } from "@playwright/test";

// ─── Test Data: 5 users per role ───
const adminUsers = [
  { email: "torpong.t@gmail.com", name: "Torpong T." },
  { email: "ananya.admin@tika.dev", name: "Ananya Srisuk" },
  { email: "robert.admin@tika.dev", name: "Robert Park" },
  { email: "kanya.admin@tika.dev", name: "Kanya Wichit" },
  { email: "david.admin@tika.dev", name: "David Lee" },
];

const developerUsers = [
  { email: "john@tika.dev", name: "John Smith" },
  { email: "somchai.dev@tika.dev", name: "Somchai Kaew" },
  { email: "emily.dev@tika.dev", name: "Emily Wang" },
  { email: "nattapong.dev@tika.dev", name: "Nattapong Sae" },
  { email: "mike@tika.dev", name: "Mike Chen" },
];

const testerUsers = [
  { email: "sara@tika.dev", name: "Sara Johnson" },
  { email: "ploy.test@tika.dev", name: "Ploy Thanakit" },
  { email: "james.test@tika.dev", name: "James Brown" },
  { email: "naree.test@tika.dev", name: "Naree Wongsakul" },
  { email: "lisa.test@tika.dev", name: "Lisa Park" },
];

const managerUsers = [
  { email: "pravit.mgr@tika.dev", name: "Pravit Chantra" },
  { email: "susan.mgr@tika.dev", name: "Susan Miller" },
  { email: "wichai.mgr@tika.dev", name: "Wichai Prom" },
  { email: "karen.mgr@tika.dev", name: "Karen White" },
  { email: "arthit.mgr@tika.dev", name: "Arthit Saeng" },
];

const PASSWORD = "password123";

// ─── Helper: login and verify ───
async function loginAndVerify(page: any, email: string, expectedName: string) {
  await page.goto("/login");
  await page.waitForSelector('input[type="email"]');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  // Should redirect to dashboard
  await page.waitForURL("/", { timeout: 15000 });
  // Wait for auth context to load user data from /api/auth/me
  await expect(page.locator("header")).toContainText(expectedName, { timeout: 15000 });
}

// ─── Helper: logout ───
async function logout(page: any) {
  await page.evaluate(() => {
    document.cookie = "auth-token=; Max-Age=0; path=/";
  });
  await page.goto("/login");
  await page.waitForSelector('input[type="email"]');
}

// ═══════════════════════════════════════════
// TEST SUITE: Admin Role Login (5 users)
// ═══════════════════════════════════════════
test.describe("Admin Role Login", () => {
  for (const user of adminUsers) {
    test(`Admin login: ${user.name} (${user.email})`, async ({ page }) => {
      await loginAndVerify(page, user.email, user.name);
      // Admin should see "Manage Users" in sidebar
      await expect(page.locator("nav")).toContainText("Manage Users", { timeout: 5000 });
      // Admin should be able to access admin page
      await page.goto("/admin/users");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toContainText("Manage Users", { timeout: 5000 });
      await logout(page);
    });
  }
});

// ═══════════════════════════════════════════
// TEST SUITE: Developer Role Login (5 users)
// ═══════════════════════════════════════════
test.describe("Developer Role Login", () => {
  for (const user of developerUsers) {
    test(`Developer login: ${user.name} (${user.email})`, async ({ page }) => {
      await loginAndVerify(page, user.email, user.name);
      // Developer should NOT see "Manage Users"
      await expect(page.locator("nav")).not.toContainText("Manage Users", { timeout: 3000 });
      // Developer can access issues page
      await page.goto("/issues");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toContainText("Issues", { timeout: 5000 });
      await logout(page);
    });
  }
});

// ═══════════════════════════════════════════
// TEST SUITE: Tester Role Login (5 users)
// ═══════════════════════════════════════════
test.describe("Tester Role Login", () => {
  for (const user of testerUsers) {
    test(`Tester login: ${user.name} (${user.email})`, async ({ page }) => {
      await loginAndVerify(page, user.email, user.name);
      // Tester should NOT see "Manage Users"
      await expect(page.locator("nav")).not.toContainText("Manage Users", { timeout: 3000 });
      // Tester can access board page
      await page.goto("/board");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toContainText("Board", { timeout: 5000 });
      await logout(page);
    });
  }
});

// ═══════════════════════════════════════════
// TEST SUITE: Manager Role Login (5 users)
// ═══════════════════════════════════════════
test.describe("Manager Role Login", () => {
  for (const user of managerUsers) {
    test(`Manager login: ${user.name} (${user.email})`, async ({ page }) => {
      await loginAndVerify(page, user.email, user.name);
      // Manager should NOT see "Manage Users"
      await expect(page.locator("nav")).not.toContainText("Manage Users", { timeout: 3000 });
      // Manager can access projects page
      await page.goto("/projects");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toContainText("Projects", { timeout: 5000 });
      await logout(page);
    });
  }
});

// ═══════════════════════════════════════════
// TEST SUITE: Login Error Cases
// ═══════════════════════════════════════════
test.describe("Login Error Cases", () => {
  test("Wrong password shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "torpong.t@gmail.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator(".text-red-400")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".text-red-400")).toContainText("Invalid");
  });

  test("Non-existent user shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "nobody@tika.dev");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page.locator(".text-red-400")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".text-red-400")).toContainText("Invalid");
  });

  test("Disabled user cannot login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "disabled@tika.dev");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page.locator(".text-red-400")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".text-red-400")).toContainText("disabled");
  });

  test("Empty form cannot submit", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[type="submit"]');
    // Should stay on login page (HTML5 validation)
    await expect(page).toHaveURL(/\/login/);
  });
});
