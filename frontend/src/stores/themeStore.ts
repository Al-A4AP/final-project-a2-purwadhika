import { create } from "zustand";
import { applyTheme, hydrateTheme } from "./theme/themeActions";
import type { ThemeStore } from "./theme/themeTypes";

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "system",
  isDark: false,
  setTheme: (theme) => applyTheme(set, theme),
  hydrate: () => hydrateTheme(set),
}));
