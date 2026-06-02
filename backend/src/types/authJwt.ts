import type { JwtPayload } from "jsonwebtoken";

export type AuthRole = "USER" | "TENANT";

export interface AuthJwtPayload extends JwtPayload {
  email: string;
  id: string;
  role: AuthRole;
}

const isAuthRole = (value: unknown): value is AuthRole =>
  value === "USER" || value === "TENANT";

export const isAuthJwtPayload = (
  payload: JwtPayload | string | null,
): payload is AuthJwtPayload =>
  typeof payload === "object" &&
  payload !== null &&
  typeof payload.id === "string" &&
  typeof payload.email === "string" &&
  isAuthRole(payload.role);
