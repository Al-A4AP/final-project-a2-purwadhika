/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ComponentType } from "react";
import type { RouteLoadingVariant } from "@/components/common/RouteLoading";
import { RouteLoading } from "@/components/common/RouteLoading";

export const Loadable =
  <P extends object>(
    Component: ComponentType<P>,
    variant: RouteLoadingVariant = "page",
  ) =>
  (props: P) => (
    <Suspense fallback={<RouteLoading variant={variant} />}>
      <Component {...props} />
    </Suspense>
  );

// Public pages
export const HomePage = Loadable(lazy(() => import("@/pages/user/HomePage")));
export const ExplorePage = Loadable(lazy(() => import("@/pages/user/ExplorePage")));
export const PropertyDetailPage = Loadable(lazy(() => import("@/pages/user/PropertyDetailPage")));
export const AboutPage = Loadable(lazy(() => import("@/pages/AboutPage")));
export const ContactPage = Loadable(lazy(() => import("@/pages/ContactPage")));
export const LegalPage = Loadable(lazy(() => import("@/pages/LegalPage")));

// Auth pages
export const LoginPage = Loadable(lazy(() => import("@/pages/auth/LoginPage")), "auth");
export const RegisterPage = Loadable(lazy(() => import("@/pages/auth/RegisterPage")), "auth");
export const UserRegisterPage = Loadable(lazy(() => import("@/pages/auth/UserRegisterPage")), "auth");
export const TenantRegisterPage = Loadable(lazy(() => import("@/pages/auth/TenantRegisterPage")), "auth");
export const VerifyEmailPage = Loadable(lazy(() => import("@/pages/auth/VerifyEmailPage")), "auth");
export const VerifyEmailChangePage = Loadable(lazy(() => import("@/pages/auth/VerifyEmailChangePage")), "auth");
export const ForgotPasswordPage = Loadable(lazy(() => import("@/pages/auth/ForgotPasswordPage")), "auth");
export const ResetPasswordPage = Loadable(lazy(() => import("@/pages/auth/ResetPasswordPage")), "auth");

// User pages
export const ProfilePage = Loadable(lazy(() => import("@/pages/user/ProfilePage")));
export const UserDashboardPage = Loadable(lazy(() => import("@/pages/user/UserDashboardPage")));
export const BookingPage = Loadable(lazy(() => import("@/pages/user/BookingPage")));
export const OrdersPage = Loadable(lazy(() => import("@/pages/user/OrdersPage")));
export const BookingDetailPage = Loadable(lazy(() => import("@/pages/user/BookingDetailPage")));
export const SavedPropertiesPage = Loadable(lazy(() => import("@/pages/user/SavedPropertiesPage")));
export const UserReviewsPage = Loadable(lazy(() => import("@/pages/user/UserReviewsPage")));
export const PaymentSuccessPage = Loadable(lazy(() => import("@/pages/user/PaymentSuccessPage")));
export const NotFoundPage = Loadable(lazy(() => import("@/pages/NotFoundPage")));

// Tenant pages
export const DashboardPage = Loadable(lazy(() => import("@/pages/tenant/DashboardPage")), "tenant");
export const PropertiesListPage = Loadable(lazy(() => import("@/pages/tenant/PropertiesListPage")), "tenant");
export const PropertyFormPage = Loadable(lazy(() => import("@/pages/tenant/PropertyFormPage")), "tenant");
export const RoomsPage = Loadable(lazy(() => import("@/pages/tenant/RoomsPage")), "tenant");
export const CategoriesPage = Loadable(lazy(() => import("@/pages/tenant/CategoriesPage")), "tenant");
export const TenantOrdersPage = Loadable(lazy(() => import("@/pages/tenant/OrdersPage")), "tenant");
export const TenantReviewsPage = Loadable(lazy(() => import("@/pages/tenant/ReviewsPage")), "tenant");
export const ReportsPage = Loadable(lazy(() => import("@/pages/tenant/ReportsPage")), "tenant");
export const PropertyReportPage = Loadable(lazy(() => import("@/pages/tenant/PropertyReportPage")), "tenant");
export const OccupancyPage = Loadable(lazy(() => import("@/pages/tenant/OccupancyPage")), "tenant");
export const PeakSeasonPage = Loadable(lazy(() => import("@/pages/tenant/PeakSeasonPage")), "tenant");
export const PaymentConfirmationPage = Loadable(lazy(() => import("@/pages/tenant/PaymentConfirmationPage")), "tenant");
