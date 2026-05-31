import { STORAGE_KEYS } from "@/lib/constants";
import type { Theme } from "./themeTypes";

export const getStoredTheme = (): Theme =>
  (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || "system";

export const saveTheme = (theme: Theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme);
