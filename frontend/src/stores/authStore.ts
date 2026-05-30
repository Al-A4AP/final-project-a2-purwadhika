import { create } from "zustand";
import type { User } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { authService } from "@/services/authService";

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isTenant: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isTenant: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isTenant: user?.role === "TENANT" });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      console.error("Logout API failed, clearing local state");
    }
    set({ user: null, isAuthenticated: false, isTenant: false });
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  hydrate: () => {
    authService
      .getMe()
      .then((updatedUser) => {
        set({
          user: updatedUser,
          isAuthenticated: true,
          isTenant: updatedUser.role === "TENANT",
        });
      })
      .catch(() => {
        set({
          user: null,
          isAuthenticated: false,
          isTenant: false,
        });
        localStorage.removeItem(STORAGE_KEYS.USER);
      });
  },
}));
