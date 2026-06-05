const LEGACY_AUTH_USER_KEY = "auth_user";

export const clearLegacyAuthUser = () => {
  localStorage.removeItem(LEGACY_AUTH_USER_KEY);
};
