import { applyThemeClass, resolveIsDark } from "./themeDom";
import { getStoredTheme, saveTheme } from "./themeStorage";
import type { Theme, ThemeSet } from "./themeTypes";

export const applyTheme = (set: ThemeSet, theme: Theme) => {
  saveTheme(theme);
  setThemeState(set, theme);
};

export const hydrateTheme = (set: ThemeSet) => setThemeState(set, getStoredTheme());

const setThemeState = (set: ThemeSet, theme: Theme) => {
  const isDark = resolveIsDark(theme);
  applyThemeClass(isDark);
  set({ theme, isDark });
};
