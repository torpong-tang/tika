import { AuthUser } from "./auth";

export const roles = ["admin", "manager", "developer", "tester", "readonly"] as const;

export type AppRole = (typeof roles)[number];

export function isRole(role: string | undefined): role is AppRole {
  return !!role && roles.includes(role as AppRole);
}

export function canWriteIssues(user: AuthUser | null) {
  return !!user && ["admin", "manager", "developer", "tester"].includes(user.role);
}

export function canDeleteIssues(user: AuthUser | null) {
  return !!user && ["admin", "manager"].includes(user.role);
}

export function canManageUsers(user: AuthUser | null) {
  return user?.role === "admin";
}

export function canManageProjects(user: AuthUser | null) {
  return user?.role === "admin";
}
