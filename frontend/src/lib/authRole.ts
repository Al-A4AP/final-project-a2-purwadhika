import type { Role } from "@/types";

export type TargetAuthRole = Role | undefined;

export const getAuthRoleFromPath = (path: string): TargetAuthRole => {
  if (path.includes("/tenant")) return "TENANT";
  if (path.includes("/user")) return "USER";
  return undefined;
};

export const getRoleHome = (role?: Role) =>
  role === "TENANT" ? "/tenant/dashboard" : "/";
export const getRoleName = (role?: TargetAuthRole) =>
  role === "TENANT" ? "Tenant" : role === "USER" ? "Penyewa" : "Akun";
export const getRoleLoginPath = (role?: TargetAuthRole) => "/auth/login";
export const getRoleRegisterPath = (role?: TargetAuthRole) =>
  role === "TENANT"
    ? "/auth/register/tenant"
    : role === "USER"
      ? "/auth/register/user"
      : "/auth/register";
export const getRoleMismatchMessage = (role?: TargetAuthRole) =>
  `Gunakan halaman login ${getRoleName(role)} untuk akun dengan role yang sesuai.`;
