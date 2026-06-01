import type { User } from "@/types";

export interface AuthStore {
  user: User | null;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isTenant: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  hydrate: () => void;
}

export type AuthSet = (partial: Partial<AuthStore>) => void;
