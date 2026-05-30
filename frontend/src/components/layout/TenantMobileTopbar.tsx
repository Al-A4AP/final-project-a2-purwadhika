import type { FC } from 'react';
import { ArrowLeft, Home, LogOut, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TenantMobileTopbarProps {
  userName?: string;
  onBack: () => void;
  onLogout: () => void;
  onMenu: () => void;
}

const iconButton = 'flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';

export const TenantMobileTopbar: FC<TenantMobileTopbarProps> = ({ userName, onBack, onLogout, onMenu }) => (
  <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
    <button onClick={onMenu} className={iconButton} aria-label="Buka menu tenant">
      <Menu size={22} />
    </button>
    <button onClick={onBack} className={iconButton} aria-label="Kembali">
      <ArrowLeft size={20} />
    </button>
    <Link to="/" className={iconButton} aria-label="Homepage">
      <Home size={20} />
    </Link>
    <Link to="/tenant/profile" className="flex min-w-0 flex-1 items-center justify-end gap-2 px-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      <User size={18} className="shrink-0" />
      <span className="truncate">{userName}</span>
    </Link>
    <button onClick={onLogout} className={iconButton} aria-label="Logout">
      <LogOut size={20} className="text-red-600" />
    </button>
  </header>
);
