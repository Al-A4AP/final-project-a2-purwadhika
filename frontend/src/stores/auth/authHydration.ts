import { authService } from "@/services/authService";
import { buildUserAuthState } from "./authState";
import { clearStoredUser } from "./authStorage";
import type { AuthSet } from "./authTypes";

export const hydrateAuthUser = (set: AuthSet) => {
  authService
    .getMe()
    .then((updatedUser) => set(buildUserAuthState(updatedUser)))
    .catch(() => clearAuthSession(set));
};

export const logoutAuthUser = async (set: AuthSet) => {
  await authService.logout().catch(() => undefined);
  clearAuthSession(set);
};

const clearAuthSession = (set: AuthSet) => {
  set(buildUserAuthState(null));
  clearStoredUser();
};
