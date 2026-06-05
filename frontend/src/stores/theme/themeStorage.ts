import { STORAGE_KEYS } from "@/lib/constants";
import type { Theme } from "./themeTypes";

const themes: Theme[] = ["light", "dark", "system"];

export const getStoredTheme = (): Theme =>
  normalizeTheme(localStorage.getItem(STORAGE_KEYS.THEME));

export const saveTheme = (theme: Theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme);

const normalizeTheme = (value: string | null): Theme =>
  isTheme(value) ? value : "system";

const isTheme = (value: string | null): value is Theme =>
  value !== null && themes.includes(value as Theme);
