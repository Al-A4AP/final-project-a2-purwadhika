import { createBrowserRouter } from 'react-router-dom';
import UserLayout from '@/components/layout/UserLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import TenantLayout from '@/components/layout/TenantLayout';
import ProtectedRoute from './ProtectedRoute';

// Public pages
import HomePage from '@/pages/user/HomePage';
import PropertyDetailPage from '@/pages/user/PropertyDetailPage';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

// User pages
import ProfilePage from '@/pages/user/ProfilePage';
import BookingPage from '@/pages/user/BookingPage';
import OrdersPage from '@/pages/user/OrdersPage';

// Tenant pages
import DashboardPage from '@/pages/tenant/DashboardPage';
import PropertiesListPage from '@/pages/tenant/PropertiesListPage';
import PropertyFormPage from '@/pages/tenant/PropertyFormPage';
import RoomsPage from '@/pages/tenant/RoomsPage';
import TenantOrdersPage from '@/pages/tenant/OrdersPage';

export const router = createBrowserRouter([
  // ─── Public + User Routes ─────────────────────────────────
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'properties/:id', element: <PropertyDetailPage /> },
      {
        path: 'profile',
        element: <ProtectedRoute component={<ProfilePage />} />,
      },
      {
        path: 'booking',
        element: <ProtectedRoute component={<BookingPage />} />,
      },
      {
        path: 'orders',
        element: <ProtectedRoute component={<OrdersPage />} />,
      },
    ],
  },

  // ─── Auth Routes ──────────────────────────────────────────
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'verify-email/:token', element: <VerifyEmailPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
    ],
  },

  // ─── Tenant Routes ────────────────────────────────────────
  {
    path: '/tenant',
    element: <TenantLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'properties', element: <PropertiesListPage /> },
      { path: 'properties/new', element: <PropertyFormPage /> },
      { path: 'properties/:id/edit', element: <PropertyFormPage /> },
      { path: 'properties/:id/rooms', element: <RoomsPage /> },
      { path: 'orders', element: <TenantOrdersPage /> },
      // TODO: tenant/reports
    ],
  },
]);
