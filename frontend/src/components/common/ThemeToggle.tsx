import type { FC } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

type ThemeMode = 'light' | 'dark' | 'system';

const ThemeToggle: FC = () => {
  const { theme, setTheme } = useThemeStore();
  return (
    <button onClick={() => setTheme(getNextTheme(theme))} className={buttonClass} title={getThemeTitle(theme)} aria-label={getThemeTitle(theme)}>
      <ThemeIcon theme={theme} />
    </button>
  );
};

const ThemeIcon: FC<{ theme: ThemeMode }> = ({ theme }) => {
  if (theme === 'light') return <Sun size={20} />;
  if (theme === 'dark') return <Moon size={20} />;
  return <Monitor size={20} />;
};

const getNextTheme = (theme: ThemeMode): ThemeMode => {
  if (theme === 'light') return 'dark';
  if (theme === 'dark') return 'system';
  return 'light';
};

const getThemeTitle = (theme: ThemeMode) =>
  `Tema saat ini: ${theme}. Klik untuk mengganti tema.`;

const buttonClass = 'p-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-yellow-600 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-slate-600 transition flex items-center justify-center';

export default ThemeToggle;
