import type { FC, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';
import type { AuthNotice } from '@/lib/authNotice';

interface ProtectedRouteProps {
  component: ReactNode;
  role?: 'USER' | 'TENANT';
}

const homeRedirect = (authNotice: AuthNotice) => (
  <Navigate to="/" replace state={{ authNotice }} />
);

const ProtectedRoute: FC<ProtectedRouteProps> = ({ component, role }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return homeRedirect('login_required');
  }

  if (!user.verified_at) {
    return homeRedirect('unverified');
  }

  if (role && user.role !== role) {
    return homeRedirect('wrong_role');
  }

  return <>{component}</>;
};

export default ProtectedRoute;
