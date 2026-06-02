import type { FC, ReactNode } from 'react';
import { ArrowLeft, Home, LogOut, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TenantMobileTopbarProps {
  userName?: string;
  onBack: () => void;
  onLogout: () => void;
  onMenu: () => void;
}

const iconButton = 'flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';

const IconActionButton: FC<{ label: string; onClick: () => void; children: ReactNode }> = ({ label, onClick, children }) => (
  <button onClick={onClick} className={iconButton} title={label} aria-label={label}>
    {children}
  </button>
);

const IconNavLink: FC<{ label: string; to: string; children: ReactNode }> = ({ label, to, children }) => (
  <Link to={to} className={iconButton} title={label} aria-label={label}>
    {children}
  </Link>
);

const TenantProfileLink: FC<{ userName?: string }> = ({ userName }) => (
  <Link to="/tenant/profile" className="flex min-w-0 flex-1 items-center justify-end gap-2 px-2 text-sm font-medium text-slate-700 dark:text-slate-200">
    <User size={18} className="shrink-0" />
    <span className="truncate">{userName}</span>
  </Link>
);

const TenantTopbarNavigation: FC<Pick<TenantMobileTopbarProps, 'onBack' | 'onMenu'>> = ({ onBack, onMenu }) => (
  <>
    <IconActionButton label="Buka menu tenant" onClick={onMenu}><Menu size={22} /></IconActionButton>
    <IconActionButton label="Kembali" onClick={onBack}><ArrowLeft size={20} /></IconActionButton>
    <IconNavLink label="Homepage" to="/"><Home size={20} /></IconNavLink>
  </>
);

const TenantLogoutButton: FC<Pick<TenantMobileTopbarProps, 'onLogout'>> = ({ onLogout }) => (
  <IconActionButton label="Logout" onClick={onLogout}>
    <LogOut size={20} className="text-red-600" />
  </IconActionButton>
);

export const TenantMobileTopbar: FC<TenantMobileTopbarProps> = ({ userName, onBack, onLogout, onMenu }) => (
  <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
    <TenantTopbarNavigation onBack={onBack} onMenu={onMenu} />
    <TenantProfileLink userName={userName} />
    <TenantLogoutButton onLogout={onLogout} />
  </header>
);
