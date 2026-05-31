import type { User } from "@/types";

export const initialAuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isTenant: false,
};

export const buildUserAuthState = (user: User | null) => ({
  user,
  isAuthenticated: !!user,
  isTenant: user?.role === "TENANT",
});
