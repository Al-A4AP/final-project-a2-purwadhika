import type { FC } from 'react';
import { useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { TenantMobileTopbar } from './TenantMobileTopbar';
import { TenantSidebar } from './TenantSidebar';

const TenantLayout: FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/tenant/dashboard');
  };

  if (!isAuthenticated || user?.role !== 'TENANT') return <Navigate to="/auth/login" replace />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 lg:flex">
      <TenantMobileTopbar userName={user?.name} onMenu={() => setMobileOpen(true)} onBack={handleBack} onLogout={handleLogout} />
      <TenantSidebar className="hidden lg:flex" collapsed={collapsed} userName={user?.name} onLogout={handleLogout} onToggleCollapse={() => setCollapsed(!collapsed)} />
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/50" aria-label="Tutup menu" onClick={() => setMobileOpen(false)} />
          <TenantSidebar className="relative h-full w-72 max-w-[82vw]" collapsed={false} showCollapse={false} userName={user?.name} onNavigate={() => setMobileOpen(false)} onLogout={handleLogout} />
        </div>
      )}
      <main className="min-w-0 flex-1 overflow-auto pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default TenantLayout;
