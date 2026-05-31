import type { Theme } from "./themeTypes";

export const resolveIsDark = (theme: Theme) => {
  if (theme === "dark") return true;
  if (theme === "system") return prefersDarkScheme();
  return false;
};

export const applyThemeClass = (isDark: boolean) => {
  document.documentElement.classList.toggle("dark", isDark);
};

const prefersDarkScheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;
