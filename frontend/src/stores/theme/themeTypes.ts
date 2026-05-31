export type Theme = "light" | "dark" | "system";

export interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  hydrate: () => void;
}

export type ThemeSet = (partial: Partial<ThemeStore>) => void;
