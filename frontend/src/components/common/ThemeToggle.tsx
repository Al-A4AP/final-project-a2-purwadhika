import type { FC } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

const ThemeToggle: FC = () => {
  const { theme, setTheme } = useThemeStore();

  const handleToggle = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    return <Monitor size={20} />;
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-yellow-600 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-slate-600 transition flex items-center justify-center"
      title={`Tema saat ini: ${theme}`}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;
