import type { FC } from 'react';
import { useState } from 'react';
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, ShoppingBag, BarChart2, MessageSquare, Tag, LogOut, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const NAV = [
  { to: '/tenant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tenant/properties', icon: Building2, label: 'Properti Saya' },
  { to: '/tenant/orders', icon: ShoppingBag, label: 'Pesanan' },
  { to: '/tenant/reviews', icon: MessageSquare, label: 'Ulasan Tamu' },
  { to: '/tenant/categories', icon: Tag, label: 'Kategori' },
  { to: '/tenant/reports', icon: BarChart2, label: 'Laporan' },
];

const TenantLayout: FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  if (!isAuthenticated || user?.role !== 'TENANT') return <Navigate to="/auth/login" replace />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
      <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white dark:bg-slate-800 border-r dark:border-slate-700 flex flex-col transition-all duration-300 shrink-0`}>
        <div className="p-4 border-b dark:border-slate-700 flex items-center justify-between">
          {!collapsed && <span className="text-lg"><span className="text-rose-600 font-black">PURWA</span><span className="text-slate-900 dark:text-white font-black">LOKA</span></span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t dark:border-slate-700 space-y-1">
          <Link to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            <User size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{user?.name}</span>}
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default TenantLayout;
