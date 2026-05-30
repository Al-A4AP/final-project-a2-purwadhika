import type { FC, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: ReactNode;
  role?: 'USER' | 'TENANT';
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ component, role }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{component}</>;
};

export default ProtectedRoute;
