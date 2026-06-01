/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RouteLoading, type RouteLoadingVariant } from "@/components/common/RouteLoading";
import { RouteErrorPage } from "@/components/common/RouteErrorPage";
import UserLayout from "@/components/layout/UserLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import TenantLayout from "@/components/layout/TenantLayout";
import ProtectedRoute from "./ProtectedRoute";

// Helper component for Suspense
const Loadable =
  <P extends object>(Component: ComponentType<P>, variant: RouteLoadingVariant = "page") =>
  (props: P) => (
    <Suspense fallback={<RouteLoading variant={variant} />}>
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
const LoginPage = Loadable(lazy(() => import("@/pages/auth/LoginPage")), "auth");
const UserLoginPage = Loadable(lazy(() => import("@/pages/auth/UserLoginPage")), "auth");
const TenantLoginPage = Loadable(lazy(() => import("@/pages/auth/TenantLoginPage")), "auth");
const RegisterPage = Loadable(lazy(() => import("@/pages/auth/RegisterPage")), "auth");
const UserRegisterPage = Loadable(lazy(() => import("@/pages/auth/UserRegisterPage")), "auth");
const TenantRegisterPage = Loadable(lazy(() => import("@/pages/auth/TenantRegisterPage")), "auth");
const VerifyEmailPage = Loadable(
  lazy(() => import("@/pages/auth/VerifyEmailPage")),
  "auth",
);
const VerifyEmailChangePage = Loadable(
  lazy(() => import("@/pages/auth/VerifyEmailChangePage")),
  "auth",
);
const ForgotPasswordPage = Loadable(
  lazy(() => import("@/pages/auth/ForgotPasswordPage")),
  "auth",
);
const ResetPasswordPage = Loadable(
  lazy(() => import("@/pages/auth/ResetPasswordPage")),
  "auth",
);

// User pages
const ProfilePage = Loadable(lazy(() => import("@/pages/user/ProfilePage")));
const BookingPage = Loadable(lazy(() => import("@/pages/user/BookingPage")));
const OrdersPage = Loadable(lazy(() => import("@/pages/user/OrdersPage")));
const PaymentSuccessPage = Loadable(lazy(() => import('@/pages/user/PaymentSuccessPage')));

// Tenant pages
const DashboardPage = Loadable(
  lazy(() => import("@/pages/tenant/DashboardPage")),
  "tenant",
);
const PropertiesListPage = Loadable(
  lazy(() => import("@/pages/tenant/PropertiesListPage")),
  "tenant",
);
const PropertyFormPage = Loadable(
  lazy(() => import("@/pages/tenant/PropertyFormPage")),
  "tenant",
);
const RoomsPage = Loadable(lazy(() => import("@/pages/tenant/RoomsPage")), "tenant");
const CategoriesPage = Loadable(lazy(() => import("@/pages/tenant/CategoriesPage")), "tenant");
const TenantOrdersPage = Loadable(
  lazy(() => import("@/pages/tenant/OrdersPage")),
  "tenant",
);
const TenantReviewsPage = Loadable(
  lazy(() => import("@/pages/tenant/ReviewsPage")),
  "tenant",
);
const ReportsPage = Loadable(lazy(() => import("@/pages/tenant/ReportsPage")), "tenant");
const NotFoundPage = Loadable(lazy(() => import("@/pages/NotFoundPage")));

const PUBLIC_ERROR = <RouteErrorPage variant="public" />;
const AUTH_ERROR = <RouteErrorPage variant="auth" />;
const TENANT_ERROR = <RouteErrorPage variant="tenant" />;

const publicRoute = (path: string, element: ReactNode) => ({ path, element, errorElement: PUBLIC_ERROR });
const authRoute = (path: string, element: ReactNode) => ({ path, element, errorElement: AUTH_ERROR });
const tenantRoute = (path: string, element: ReactNode) => ({ path, element, errorElement: TENANT_ERROR });

export const router = createBrowserRouter([
  // ─── Public + User Routes ─────────────────────────────────
  {
    path: "/",
    element: <UserLayout />,
    errorElement: PUBLIC_ERROR,
    children: [
      publicRoute("", <HomePage />),
      publicRoute("properties/:id", <PropertyDetailPage />),
      publicRoute("about", <AboutPage />),
      publicRoute("contact", <ContactPage />),
      publicRoute("legal", <LegalPage />),
      publicRoute("profile", <ProtectedRoute component={<ProfilePage />} role="USER" />),
      publicRoute("booking", <ProtectedRoute component={<BookingPage />} role="USER" />),
      publicRoute("orders", <ProtectedRoute component={<OrdersPage />} role="USER" />),
      publicRoute("payment/success", <ProtectedRoute component={<PaymentSuccessPage />} role="USER" />),
      publicRoute("*", <NotFoundPage />),
    ],
  },

  // ─── Auth Routes ──────────────────────────────────────────
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: AUTH_ERROR,
    children: [
      authRoute("login", <LoginPage />),
      authRoute("login/user", <UserLoginPage />),
      authRoute("login/tenant", <TenantLoginPage />),
      authRoute("register", <RegisterPage />),
      authRoute("register/user", <UserRegisterPage />),
      authRoute("register/tenant", <TenantRegisterPage />),
      authRoute("verify-email/:token", <VerifyEmailPage />),
      authRoute("verify-email-change/:token", <VerifyEmailChangePage />),
      authRoute("forgot-password", <ForgotPasswordPage />),
      authRoute("reset-password", <ResetPasswordPage />),
    ],
  },

  // ─── Tenant Routes ────────────────────────────────────────
  {
    path: "/tenant",
    element: <ProtectedRoute component={<TenantLayout />} role="TENANT" />,
    errorElement: TENANT_ERROR,
    children: [
      tenantRoute("dashboard", <DashboardPage />),
      tenantRoute("properties", <PropertiesListPage />),
      tenantRoute("properties/new", <PropertyFormPage />),
      tenantRoute("properties/:id/edit", <PropertyFormPage />),
      tenantRoute("properties/:id/rooms", <RoomsPage />),
      tenantRoute("categories", <CategoriesPage />),
      tenantRoute("orders", <TenantOrdersPage />),
      tenantRoute("reviews", <TenantReviewsPage />),
      tenantRoute("profile", <ProfilePage />),
      tenantRoute("reports", <ReportsPage />),
    ],
  },
]);
