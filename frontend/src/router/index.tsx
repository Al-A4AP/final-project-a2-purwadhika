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
  OrdersPage, PaymentSuccessPage, PeakSeasonPage,
  ProfilePage, PropertiesListPage, PropertyDetailPage, PropertyFormPage,
  PropertyReportPage, RegisterPage, ReportsPage, RoomsPage, SavedPropertiesPage,
  TenantOrdersPage, TenantRegisterPage, TenantReviewsPage, UserDashboardPage,
  UserRegisterPage, UserReviewsPage, VerifyEmailChangePage, VerifyEmailPage,
  ResetPasswordPage, VouchersPage,
} from "./routePages";

const PUBLIC_ERROR = <RouteErrorPage variant="public" />;
const AUTH_ERROR = <RouteErrorPage variant="auth" />;
const TENANT_ERROR = <RouteErrorPage variant="tenant" />;

const publicUserRoute = (path: string, element: ReactNode) => ({ path, element, errorElement: PUBLIC_ERROR });
const authRoute = (path: string, element: ReactNode) => ({ path, element, errorElement: AUTH_ERROR });
const tenantRoute = (path: string, element: ReactNode) => ({ path, element, errorElement: TENANT_ERROR });

const protectedElement = (component: ReactNode, role: "USER" | "TENANT") =>
  <ProtectedRoute component={component} role={role} />;

const protectedUserRoute = (path: string, element: ReactNode) =>
  publicUserRoute(path, protectedElement(element, "USER"));

const publicUserRoutes = [
  publicUserRoute("", <HomePage />),
  publicUserRoute("explore", <ExplorePage />),
  publicUserRoute("properties/:id", <PropertyDetailPage />),
  publicUserRoute("about", <AboutPage />),
  publicUserRoute("contact", <ContactPage />),
  publicUserRoute("legal", <LegalPage />),
];

const protectedUserRoutes = [
  protectedUserRoute("dashboard", <UserDashboardPage />),
  protectedUserRoute("profile", <ProfilePage />),
  protectedUserRoute("booking", <BookingPage />),
  protectedUserRoute("orders", <OrdersPage />),
  protectedUserRoute("orders/:id", <BookingDetailPage />),
  protectedUserRoute("saved-properties", <SavedPropertiesPage />),
  protectedUserRoute("reviews", <UserReviewsPage />),
  protectedUserRoute("payment/success", <PaymentSuccessPage />),
];

const authRoutes = [
  authRoute("login", <LoginPage />),
  authRoute("register", <RegisterPage />),
  authRoute("register/user", <UserRegisterPage />),
  authRoute("register/tenant", <TenantRegisterPage />),
  authRoute("verify-email/:token", <VerifyEmailPage />),
  authRoute("verify-email-change/:token", <VerifyEmailChangePage />),
  authRoute("forgot-password", <ForgotPasswordPage />),
  authRoute("reset-password", <ResetPasswordPage />),
];

const tenantRoutes = [
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
  tenantRoute("property-report", <PropertyReportPage />),
  tenantRoute("occupancy", <OccupancyPage />),
  tenantRoute("peak-season", <PeakSeasonPage />),
  tenantRoute("vouchers", <VouchersPage />),
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    errorElement: PUBLIC_ERROR,
    children: [
      ...publicUserRoutes,
      ...protectedUserRoutes,
      publicUserRoute("*", <NotFoundPage />),
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: AUTH_ERROR,
    children: authRoutes,
  },
  {
    path: "/tenant",
    element: protectedElement(<TenantLayout />, "TENANT"),
    errorElement: TENANT_ERROR,
    children: tenantRoutes,
  },
]);
