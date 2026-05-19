import type { FC } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const ThemeToggle: FC = () => {
  const { isDark, setTheme } = useThemeStore();

  const handleToggle = () => {
    if (isDark) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-yellow-600 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-slate-600 transition"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
