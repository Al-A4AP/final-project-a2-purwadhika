import { authService } from "@/services/authService";
import { buildAuthLoadingState, buildUserAuthState } from "./authState";
import { clearStoredUser } from "./authStorage";
import type { AuthSet } from "./authTypes";

export const hydrateAuthUser = async (set: AuthSet) => {
  set(buildAuthLoadingState());
  try {
    const updatedUser = await authService.getMe();
    set(buildUserAuthState(updatedUser));
  } catch {
    clearAuthSession(set);
  }
};

export const logoutAuthUser = async (set: AuthSet) => {
  await authService.logout().catch(() => undefined);
  clearAuthSession(set);
};

const clearAuthSession = (set: AuthSet) => {
  set(buildUserAuthState(null));
  clearStoredUser();
};
