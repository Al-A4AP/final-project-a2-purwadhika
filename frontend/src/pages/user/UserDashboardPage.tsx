import type { FC } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { useUserDashboardState } from "@/hooks/user/dashboard/useUserDashboardState";
import { DashboardWelcome } from "./dashboard/DashboardWelcome";
import { DashboardUpcomingStay } from "./dashboard/DashboardUpcomingStay";
import { DashboardActiveSummary } from "./dashboard/DashboardActiveSummary";
import { DashboardQuickActions } from "./dashboard/DashboardQuickActions";
import { DashboardRecent } from "./dashboard/DashboardRecent";
import { DashboardReviewReminders } from "./dashboard/DashboardReviewReminders";
import { DashboardVouchers } from "./dashboard/DashboardVouchers";
import { DashboardRefundNotice } from "./dashboard/DashboardRefundNotice";

type UserDashboardState = ReturnType<typeof useUserDashboardState>;

const UserDashboardPage: FC = () => <UserDashboardView state={useUserDashboardState()} />;

const UserDashboardView: FC<{ state: UserDashboardState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-12 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl">
      <DashboardWelcome user={state.user} />
      <UserDashboardBody state={state} />
    </div>
  </div>
);

const UserDashboardBody: FC<{ state: UserDashboardState }> = ({ state }) => {
  if (state.loading) return <SectionLoading variant="booking" label="Memuat data dashboard Anda..." />;
  if (state.error) return <DashboardError message={state.error} />;
  return <UserDashboardSections state={state} />;
};

const DashboardError: FC<{ message: string }> = ({ message }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900/50 dark:bg-red-900/10">
    {message}
  </div>
);

const UserDashboardSections: FC<{ state: UserDashboardState }> = ({ state }) => (
  <>
    <DashboardRefundNotice count={state.pendingRefundCount} />
    <div className="grid gap-8 lg:grid-cols-3">
      <DashboardMainColumn state={state} />
      <DashboardSideColumn stats={state.stats} />
    </div>
  </>
);

const DashboardMainColumn: FC<{ state: UserDashboardState }> = ({ state }) => (
  <div className="lg:col-span-2">
    <DashboardUpcomingStay order={state.upcomingStay} />
    <DashboardReviewReminders orders={state.reviewReminders} />
    <DashboardRecent orders={state.recentOrders} />
  </div>
);

const DashboardSideColumn: FC<{ stats: UserDashboardState["stats"] }> = ({ stats }) => (
  <div className="lg:col-span-1">
    <DashboardActiveSummary stats={stats} />
    <DashboardVouchers />
    <DashboardQuickActions />
  </div>
);

export default UserDashboardPage;
