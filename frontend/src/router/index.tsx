/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import TenantLayout from "@/components/layout/TenantLayout";
import ProtectedRoute from "./ProtectedRoute";
import { Loading } from "@/components/common/Loading";

// Helper component for Suspense
const Loadable =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => (
    <Suspense fallback={<Loading fullScreen />}>
      <Component {...props} />
    </Suspense>
  );

// Public pages
const HomePage = Loadable(lazy(() => import("@/pages/user/HomePage")));
const PropertyDetailPage = Loadable(
  lazy(() => import("@/pages/user/PropertyDetailPage")),
);
const AboutPage = Loadable(lazy(() => import("@/pages/AboutPage")));
const ContactPage = Loadable(lazy(() => import("@/pages/ContactPage")));
const LegalPage = Loadable(lazy(() => import("@/pages/LegalPage")));

// Auth pages
const LoginPage = Loadable(lazy(() => import("@/pages/auth/LoginPage")));
const UserLoginPage = Loadable(lazy(() => import("@/pages/auth/UserLoginPage")));
const TenantLoginPage = Loadable(lazy(() => import("@/pages/auth/TenantLoginPage")));
const RegisterPage = Loadable(lazy(() => import("@/pages/auth/RegisterPage")));
const UserRegisterPage = Loadable(lazy(() => import("@/pages/auth/UserRegisterPage")));
const TenantRegisterPage = Loadable(lazy(() => import("@/pages/auth/TenantRegisterPage")));
const VerifyEmailPage = Loadable(
  lazy(() => import("@/pages/auth/VerifyEmailPage")),
);
const VerifyEmailChangePage = Loadable(
  lazy(() => import("@/pages/auth/VerifyEmailChangePage")),
);
const ForgotPasswordPage = Loadable(
  lazy(() => import("@/pages/auth/ForgotPasswordPage")),
);
const ResetPasswordPage = Loadable(
  lazy(() => import("@/pages/auth/ResetPasswordPage")),
);

// User pages
const ProfilePage = Loadable(lazy(() => import("@/pages/user/ProfilePage")));
const BookingPage = Loadable(lazy(() => import("@/pages/user/BookingPage")));
const OrdersPage = Loadable(lazy(() => import("@/pages/user/OrdersPage")));
const PaymentSuccessPage = Loadable(lazy(() => import('@/pages/user/PaymentSuccessPage')));

// Tenant pages
const DashboardPage = Loadable(
  lazy(() => import("@/pages/tenant/DashboardPage")),
);
const PropertiesListPage = Loadable(
  lazy(() => import("@/pages/tenant/PropertiesListPage")),
);
const PropertyFormPage = Loadable(
  lazy(() => import("@/pages/tenant/PropertyFormPage")),
);
const RoomsPage = Loadable(lazy(() => import("@/pages/tenant/RoomsPage")));
const CategoriesPage = Loadable(lazy(() => import("@/pages/tenant/CategoriesPage")));
const TenantOrdersPage = Loadable(
  lazy(() => import("@/pages/tenant/OrdersPage")),
);
const TenantReviewsPage = Loadable(
  lazy(() => import("@/pages/tenant/ReviewsPage")),
);
const ReportsPage = Loadable(lazy(() => import("@/pages/tenant/ReportsPage")));
const NotFoundPage = Loadable(lazy(() => import("@/pages/NotFoundPage")));

export const router = createBrowserRouter([
  // ─── Public + User Routes ─────────────────────────────────
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "properties/:id", element: <PropertyDetailPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "legal", element: <LegalPage /> },
      {
        path: "profile",
        element: <ProtectedRoute component={<ProfilePage />} role="USER" />,
      },
      {
        path: "booking",
        element: <ProtectedRoute component={<BookingPage />} role="USER" />,
      },
      {
        path: "orders",
        element: <ProtectedRoute component={<OrdersPage />} role="USER" />,
      },
      {
        path: 'payment/success',
        element: <ProtectedRoute component={<PaymentSuccessPage />} role="USER" />,
      },
    ],
  },

  // ─── Auth Routes ──────────────────────────────────────────
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "login/user", element: <UserLoginPage /> },
      { path: "login/tenant", element: <TenantLoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "register/user", element: <UserRegisterPage /> },
      { path: "register/tenant", element: <TenantRegisterPage /> },
      { path: "verify-email/:token", element: <VerifyEmailPage /> },
      { path: "verify-email-change/:token", element: <VerifyEmailChangePage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },

  // ─── Tenant Routes ────────────────────────────────────────
  {
    path: "/tenant",
    element: <ProtectedRoute component={<TenantLayout />} role="TENANT" />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "properties", element: <PropertiesListPage /> },
      { path: "properties/new", element: <PropertyFormPage /> },
      { path: "properties/:id/edit", element: <PropertyFormPage /> },
      { path: "properties/:id/rooms", element: <RoomsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "orders", element: <TenantOrdersPage /> },
      { path: "reviews", element: <TenantReviewsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "reports", element: <ReportsPage /> },
    ],
  },
]);
