import type { User } from "@/types";

export const initialAuthState = {
  user: null,
  hydrated: false,
  loading: true,
  error: null,
  isAuthenticated: false,
  isTenant: false,
};

export const buildUserAuthState = (user: User | null) => ({
  user,
  hydrated: true,
  loading: false,
  error: null,
  isAuthenticated: !!user,
  isTenant: user?.role === "TENANT",
});

export const buildAuthLoadingState = () => ({
  loading: true,
  error: null,
});
