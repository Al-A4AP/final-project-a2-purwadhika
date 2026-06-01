import type { FC } from 'react';
import { ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { TENANT_NAV } from './tenantNavigation';

interface TenantSidebarProps {
  className?: string;
  collapsed: boolean;
  showCollapse?: boolean;
  userName?: string;
  onNavigate?: () => void;
  onLogout: () => void;
  onToggleCollapse?: () => void;
}

const brandClass = 'text-lg text-slate-900 dark:text-white font-black';

const TenantBrand: FC<{ collapsed: boolean }> = ({ collapsed }) => (
  collapsed ? null : <span className={brandClass}><span className="text-rose-600">PURWA</span>LOKA</span>
);

const SidebarHeader: FC<Pick<TenantSidebarProps, 'collapsed' | 'showCollapse' | 'onToggleCollapse'>> = ({
  collapsed, showCollapse, onToggleCollapse,
}) => (
  <div className="flex items-center justify-between border-b p-4 dark:border-slate-700">
    <TenantBrand collapsed={collapsed} />
    {showCollapse && (
      <button onClick={onToggleCollapse} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700">
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    )}
  </div>
);

const TenantNavLinks: FC<{ collapsed: boolean; onNavigate?: () => void }> = ({ collapsed, onNavigate }) => (
  <nav className="flex-1 space-y-1 p-3">
    {TENANT_NAV.map((item) => <TenantNavItem key={item.to} item={item} collapsed={collapsed} onNavigate={onNavigate} />)}
  </nav>
);

const TenantNavItem: FC<{ item: (typeof TENANT_NAV)[number]; collapsed: boolean; onNavigate?: () => void }> = ({ item, collapsed, onNavigate }) => {
  const Icon = item.icon;
  return (
    <NavLink to={item.to} end={item.to === '/'} onClick={onNavigate} className={({ isActive }) => navClass(isActive)}>
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
};

const navClass = (isActive: boolean) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-700'}`;

const AccountActions: FC<Pick<TenantSidebarProps, 'collapsed' | 'userName' | 'onNavigate' | 'onLogout'>> = (props) => (
  <div className="space-y-1 border-t p-3 dark:border-slate-700">
    <ProfileLink {...props} />
    <LogoutButton collapsed={props.collapsed} onLogout={props.onLogout} />
  </div>
);

const ProfileLink: FC<Pick<TenantSidebarProps, 'collapsed' | 'userName' | 'onNavigate'>> = ({ collapsed, userName, onNavigate }) => (
  <Link to="/tenant/profile" onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-700">
    <User size={18} className="shrink-0" />
    {!collapsed && <span className="truncate">{userName}</span>}
  </Link>
);

const LogoutButton: FC<Pick<TenantSidebarProps, 'collapsed' | 'onLogout'>> = ({ collapsed, onLogout }) => (
  <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20">
    <LogOut size={18} className="shrink-0" />
    {!collapsed && <span>Keluar</span>}
  </button>
);

export const TenantSidebar: FC<TenantSidebarProps> = ({
  className = '', collapsed, showCollapse = true, userName, onNavigate, onLogout, onToggleCollapse,
}) => (
  <aside className={`${collapsed ? 'w-16' : 'w-64'} flex shrink-0 flex-col border-r bg-white transition-all duration-300 dark:border-slate-700 dark:bg-slate-800 ${className}`}>
    <SidebarHeader collapsed={collapsed} showCollapse={showCollapse} onToggleCollapse={onToggleCollapse} />
    <TenantNavLinks collapsed={collapsed} onNavigate={onNavigate} />
    <AccountActions collapsed={collapsed} userName={userName} onNavigate={onNavigate} onLogout={onLogout} />
  </aside>
);
