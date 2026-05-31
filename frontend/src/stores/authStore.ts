import { create } from "zustand";
import { hydrateAuthUser, logoutAuthUser } from "./auth/authHydration";
import { buildUserAuthState, initialAuthState } from "./auth/authState";
import type { AuthStore } from "./auth/authTypes";

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialAuthState,
  setUser: (user) => set(buildUserAuthState(user)),
  logout: () => logoutAuthUser(set),
  hydrate: () => hydrateAuthUser(set),
}));
