import type { FC, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';
import type { AuthNotice } from '@/lib/authNotice';
import type { User } from '@/types';
import { Loading } from '@/components/common/Loading';

interface ProtectedRouteProps {
  component: ReactNode;
  role?: 'USER' | 'TENANT';
}

const homeRedirect = (authNotice: AuthNotice) => (
  <Navigate to="/" replace state={{ authNotice }} />
);

const isCheckingAuth = (loading: boolean, hydrated: boolean) => loading || !hydrated;

const getRedirectNotice = (user: User | null, isAuthenticated: boolean, role?: 'USER' | 'TENANT') => {
  if (!isAuthenticated || !user) return 'login_required';
  if (!user.verified_at) return 'unverified';
  if (role && user.role !== role) return 'wrong_role';
  return null;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({ component, role }) => {
  const { hydrated, isAuthenticated, loading, user } = useAuthStore();
  if (isCheckingAuth(loading, hydrated)) return <Loading fullScreen text="Memeriksa sesi..." />;
  const notice = getRedirectNotice(user, isAuthenticated, role);
  if (notice) return homeRedirect(notice);
  return <>{component}</>;
};

export default ProtectedRoute;
