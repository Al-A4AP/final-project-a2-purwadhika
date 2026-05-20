import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import UserLayout from '@/components/layout/UserLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import TenantLayout from '@/components/layout/TenantLayout';
import ProtectedRoute from './ProtectedRoute';
import { Loading } from '@/components/common/Loading';

// Helper component for Suspense
const Loadable = (Component: React.LazyExoticComponent<any>) => (props: any) => (
  <Suspense fallback={<Loading fullScreen />}>
    <Component {...props} />
  </Suspense>
);

// Public pages
const HomePage = Loadable(lazy(() => import('@/pages/user/HomePage')));
const PropertyDetailPage = Loadable(lazy(() => import('@/pages/user/PropertyDetailPage')));
const AboutPage = Loadable(lazy(() => import('@/pages/AboutPage')));
const ContactPage = Loadable(lazy(() => import('@/pages/ContactPage')));

// Auth pages
const LoginPage = Loadable(lazy(() => import('@/pages/auth/LoginPage')));
const RegisterPage = Loadable(lazy(() => import('@/pages/auth/RegisterPage')));
const VerifyEmailPage = Loadable(lazy(() => import('@/pages/auth/VerifyEmailPage')));
const ForgotPasswordPage = Loadable(lazy(() => import('@/pages/auth/ForgotPasswordPage')));
const ResetPasswordPage = Loadable(lazy(() => import('@/pages/auth/ResetPasswordPage')));

// User pages
const ProfilePage = Loadable(lazy(() => import('@/pages/user/ProfilePage')));
const BookingPage = Loadable(lazy(() => import('@/pages/user/BookingPage')));
const OrdersPage = Loadable(lazy(() => import('@/pages/user/OrdersPage')));

// Tenant pages
const DashboardPage = Loadable(lazy(() => import('@/pages/tenant/DashboardPage')));
const PropertiesListPage = Loadable(lazy(() => import('@/pages/tenant/PropertiesListPage')));
const PropertyFormPage = Loadable(lazy(() => import('@/pages/tenant/PropertyFormPage')));
const RoomsPage = Loadable(lazy(() => import('@/pages/tenant/RoomsPage')));
const TenantOrdersPage = Loadable(lazy(() => import('@/pages/tenant/OrdersPage').then(module => ({ default: module.default || module.OrdersPage }))));
const ReportsPage = Loadable(lazy(() => import('@/pages/tenant/ReportsPage')));
const NotFoundPage = Loadable(lazy(() => import('@/pages/NotFoundPage')));

export const router = createBrowserRouter([
  // ─── Public + User Routes ─────────────────────────────────
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'properties/:id', element: <PropertyDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
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
      { path: 'login/user', element: <LoginPage /> },
      { path: 'login/tenant', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'register/user', element: <RegisterPage /> },
      { path: 'register/tenant', element: <RegisterPage /> },
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
      { path: 'reports', element: <ReportsPage /> },
    ],
  },
]);
