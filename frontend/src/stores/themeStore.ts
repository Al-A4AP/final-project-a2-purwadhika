import { create } from 'zustand';
import { STORAGE_KEYS } from '@/lib/constants';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'system',
  isDark: false,

  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    let isDark = false;
    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    set({ theme, isDark });
  },

  hydrate: () => {
    const savedTheme = (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'system';
    
    let isDark = false;
    if (savedTheme === 'dark') {
      isDark = true;
    } else if (savedTheme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    set({ theme: savedTheme, isDark });
  },
}));
