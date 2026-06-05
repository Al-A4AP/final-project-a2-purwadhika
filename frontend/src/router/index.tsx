import type { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RouteErrorPage } from "@/components/common/RouteErrorPage";
import UserLayout from "@/components/layout/UserLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import TenantLayout from "@/components/layout/TenantLayout";
import ProtectedRoute from "./ProtectedRoute";
import {
  AboutPage, BookingDetailPage, BookingPage, CategoriesPage,
  ContactPage, DashboardPage, ExplorePage, ForgotPasswordPage,
  HomePage, LegalPage, LoginPage, NotFoundPage, OccupancyPage,
  OrdersPage, PaymentConfirmationPage, PaymentSuccessPage, PeakSeasonPage,
  ProfilePage, PropertiesListPage, PropertyDetailPage, PropertyFormPage,
  PropertyReportPage, RegisterPage, ReportsPage, RoomsPage, SavedPropertiesPage,
  TenantOrdersPage, TenantRegisterPage, TenantReviewsPage, UserDashboardPage,
  UserRegisterPage, UserReviewsPage, VerifyEmailChangePage, VerifyEmailPage,
  ResetPasswordPage,
} from "./routePages";

const PUBLIC_ERROR = <RouteErrorPage variant="public" />;
const AUTH_ERROR = <RouteErrorPage variant="auth" />;
const TENANT_ERROR = <RouteErrorPage variant="tenant" />;

const publicRoute = (path: string, element: ReactNode) => ({ path, element, errorElement: PUBLIC_ERROR });
const authRoute = (path: string, element: ReactNode) => ({ path, element, errorElement: AUTH_ERROR });
const tenantRoute = (path: string, element: ReactNode) => ({ path, element, errorElement: TENANT_ERROR });

const protected_ = (component: ReactNode, role: "USER" | "TENANT") =>
  <ProtectedRoute component={component} role={role} />;

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    errorElement: PUBLIC_ERROR,
    children: [
      publicRoute("", <HomePage />),
      publicRoute("explore", <ExplorePage />),
      publicRoute("properties/:id", <PropertyDetailPage />),
      publicRoute("about", <AboutPage />),
      publicRoute("contact", <ContactPage />),
      publicRoute("legal", <LegalPage />),
      publicRoute("dashboard", protected_(<UserDashboardPage />, "USER")),
      publicRoute("profile", protected_(<ProfilePage />, "USER")),
      publicRoute("booking", protected_(<BookingPage />, "USER")),
      publicRoute("orders", protected_(<OrdersPage />, "USER")),
      publicRoute("orders/:id", protected_(<BookingDetailPage />, "USER")),
      publicRoute("saved-properties", protected_(<SavedPropertiesPage />, "USER")),
      publicRoute("reviews", protected_(<UserReviewsPage />, "USER")),
      publicRoute("payment/success", protected_(<PaymentSuccessPage />, "USER")),
      publicRoute("*", <NotFoundPage />),
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: AUTH_ERROR,
    children: [
      authRoute("login", <LoginPage />),
      authRoute("register", <RegisterPage />),
      authRoute("register/user", <UserRegisterPage />),
      authRoute("register/tenant", <TenantRegisterPage />),
      authRoute("verify-email/:token", <VerifyEmailPage />),
      authRoute("verify-email-change/:token", <VerifyEmailChangePage />),
      authRoute("forgot-password", <ForgotPasswordPage />),
      authRoute("reset-password", <ResetPasswordPage />),
    ],
  },
  {
    path: "/tenant",
    element: protected_(<TenantLayout />, "TENANT"),
    errorElement: TENANT_ERROR,
    children: [
      tenantRoute("dashboard", <DashboardPage />),
      tenantRoute("properties", <PropertiesListPage />),
      tenantRoute("properties/new", <PropertyFormPage />),
      tenantRoute("properties/:id/edit", <PropertyFormPage />),
      tenantRoute("properties/:id/rooms", <RoomsPage />),
      tenantRoute("categories", <CategoriesPage />),
      tenantRoute("orders", <TenantOrdersPage />),
      tenantRoute("payment-confirmation", <PaymentConfirmationPage />),
      tenantRoute("reviews", <TenantReviewsPage />),
      tenantRoute("profile", <ProfilePage />),
      tenantRoute("reports", <ReportsPage />),
      tenantRoute("property-report", <PropertyReportPage />),
      tenantRoute("occupancy", <OccupancyPage />),
      tenantRoute("peak-season", <PeakSeasonPage />),
    ],
  },
]);
