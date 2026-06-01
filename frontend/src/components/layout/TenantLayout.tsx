import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import { Navigate, Outlet, useNavigate, type NavigateFunction } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ScrollToTop } from './ScrollToTop';
import { TenantMobileTopbar } from './TenantMobileTopbar';
import { TenantSidebar } from './TenantSidebar';

type LogoutFn = () => Promise<void> | void;

interface TenantLayoutState {
  closeMobile: () => void;
  collapsed: boolean;
  handleBack: () => void;
  handleLogout: () => Promise<void>;
  isTenant: boolean;
  mobileOpen: boolean;
  openMobile: () => void;
  toggleCollapse: () => void;
  userName?: string;
}

interface TenantLayoutStateParams {
  collapsed: boolean;
  isAuthenticated: boolean;
  logout: LogoutFn;
  mobileOpen: boolean;
  navigate: NavigateFunction;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
  user?: { name?: string; role?: string } | null;
}

const TenantLayout: FC = () => {
  const state = useTenantLayoutState();
  if (!state.isTenant) return <Navigate to="/auth/login" replace />;
  return <TenantLayoutView state={state} />;
};

const useTenantLayoutState = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  return buildTenantLayoutState({ collapsed, isAuthenticated, logout, mobileOpen, navigate, setCollapsed, setMobileOpen, user });
};

const buildTenantLayoutState = (params: TenantLayoutStateParams) => ({
  closeMobile: () => params.setMobileOpen(false),
  collapsed: params.collapsed,
  handleBack: createBackHandler(params.navigate),
  handleLogout: createLogoutHandler(params.logout, params.navigate),
  isTenant: params.isAuthenticated && params.user?.role === 'TENANT',
  mobileOpen: params.mobileOpen,
  openMobile: () => params.setMobileOpen(true),
  toggleCollapse: () => params.setCollapsed((value) => !value),
  userName: params.user?.name,
});

const createLogoutHandler = (logout: LogoutFn, navigate: NavigateFunction) => async () => {
  await logout();
  navigate('/auth/login', { replace: true });
};

const createBackHandler = (navigate: NavigateFunction) => () => {
  if (window.history.length > 1) navigate(-1);
  else navigate('/tenant/dashboard');
};

const TenantLayoutView: FC<{ state: TenantLayoutState }> = ({ state }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 lg:flex">
    <ScrollToTop />
    <TenantMobileTopbar userName={state.userName} onMenu={state.openMobile} onBack={state.handleBack} onLogout={state.handleLogout} />
    <DesktopSidebar state={state} />
    <TenantMobileDrawer state={state} />
    <TenantMain />
  </div>
);

const DesktopSidebar: FC<{ state: TenantLayoutState }> = ({ state }) => (
  <TenantSidebar className="hidden lg:flex" collapsed={state.collapsed} userName={state.userName} onLogout={state.handleLogout} onToggleCollapse={state.toggleCollapse} />
);

const TenantMobileDrawer: FC<{ state: TenantLayoutState }> = ({ state }) => (
  state.mobileOpen ? (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button className="absolute inset-0 bg-slate-950/50" aria-label="Tutup menu" onClick={state.closeMobile} />
      <TenantSidebar className="relative h-full w-72 max-w-[82vw]" collapsed={false} showCollapse={false} userName={state.userName} onNavigate={state.closeMobile} onLogout={state.handleLogout} />
    </div>
  ) : null
);

const TenantMain: FC = () => (
  <main data-scroll-root className="min-w-0 flex-1 overflow-auto pt-16 lg:pt-0">
    <Outlet />
  </main>
);

export default TenantLayout;
